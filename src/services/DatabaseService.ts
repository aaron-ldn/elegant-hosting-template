
import initSqlJs, { Database } from 'sql.js';

// Type for our database operations
type DBResult = {
  success: boolean;
  data?: any;
  error?: string;
};

class DatabaseService {
  private static instance: DatabaseService;
  private db: Database | null = null;
  private initialized = false;
  private initPromise: Promise<void> | null = null;

  private constructor() {
    // Initialize the database
    this.initPromise = this.initDatabase();
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  private async initDatabase(): Promise<void> {
    try {
      // Initialize SQL.js
      const SQL = await initSqlJs({
        // Specify the path to the wasm file
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
      });

      // Create a new database
      this.db = new SQL.Database();
      
      // Create users table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT NOT NULL,
          status TEXT NOT NULL,
          last_active TEXT,
          created_at TEXT NOT NULL
        );
      `);

      // Create permissions table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS permissions (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT NOT NULL
        );
      `);

      // Create roles_permissions table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS roles_permissions (
          role_name TEXT NOT NULL,
          permission_id TEXT NOT NULL,
          PRIMARY KEY (role_name, permission_id)
        );
      `);

      // Create pages table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS pages (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          slug TEXT UNIQUE NOT NULL,
          content TEXT NOT NULL,
          is_published INTEGER NOT NULL,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          page_order INTEGER NOT NULL,
          show_in_menu INTEGER NOT NULL
        );
      `);

      // Insert default admin user if none exists
      const result = this.db.exec("SELECT * FROM users WHERE email = 'admin@cloudhost.com'");
      if (result.length === 0 || result[0].values.length === 0) {
        this.db.run(`
          INSERT INTO users (id, name, email, password, role, status, created_at)
          VALUES ('1', 'Admin User', 'admin@cloudhost.com', '$2a$10$XQnPY7dBkARgHY7rLJVK8emQF1/3N8mKI1hgNRAYnT.guSf5NUF1e', 'admin', 'active', '${new Date().toISOString()}')
        `);
      }

      // Save the database to localStorage
      this.saveToLocalStorage();

      this.initialized = true;
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  // Ensure database is initialized before performing operations
  private async ensureInitialized(): Promise<void> {
    if (!this.initialized && this.initPromise) {
      await this.initPromise;
    }
  }

  // Save the current database state to localStorage
  private saveToLocalStorage(): void {
    if (this.db) {
      const data = this.db.export();
      const buffer = new Uint8Array(data);
      const blob = new Blob([buffer]);
      
      // Convert to base64 for storage
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          localStorage.setItem('cloudhost_db', reader.result as string);
        }
      };
      reader.readAsDataURL(blob);
    }
  }

  // Load the database from localStorage
  private async loadFromLocalStorage(): Promise<boolean> {
    try {
      const SQL = await initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
      });

      const dbData = localStorage.getItem('cloudhost_db');
      if (dbData) {
        // Convert from base64 back to binary
        const binaryString = atob(dbData.split(',')[1]);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        // Create database from the loaded data
        this.db = new SQL.Database(bytes);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to load database from localStorage:', error);
      return false;
    }
  }

  // User operations
  async authenticateUser(email: string, password: string): Promise<DBResult> {
    await this.ensureInitialized();
    
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      // In a real app, you'd hash the password and compare hashes
      // For this demo, we'll do a simple comparison
      const stmt = this.db.prepare("SELECT * FROM users WHERE email = ? AND password = ?");
      stmt.bind([email, password]);
      
      const result = [];
      while (stmt.step()) {
        result.push(stmt.getAsObject());
      }
      stmt.free();
      
      if (result.length > 0) {
        // Update last active time
        const updateStmt = this.db.prepare("UPDATE users SET last_active = ? WHERE id = ?");
        updateStmt.bind([new Date().toISOString(), result[0].id]);
        updateStmt.step();
        updateStmt.free();
        
        this.saveToLocalStorage();
        
        return { 
          success: true, 
          data: result[0] 
        };
      }
      
      return { 
        success: false, 
        error: "Invalid credentials" 
      };
    } catch (error) {
      console.error('Authentication error:', error);
      return { 
        success: false, 
        error: "Authentication failed" 
      };
    }
  }

  async getUsers(): Promise<DBResult> {
    await this.ensureInitialized();
    
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      const result = this.db.exec("SELECT * FROM users");
      
      if (result.length > 0) {
        const columns = result[0].columns;
        const users = result[0].values.map(row => {
          const user: Record<string, any> = {};
          columns.forEach((col, i) => {
            user[col] = row[i];
          });
          return user;
        });
        
        return { success: true, data: users };
      }
      
      return { success: true, data: [] };
    } catch (error) {
      console.error('Get users error:', error);
      return { success: false, error: "Failed to get users" };
    }
  }

  async createUser(user: any): Promise<DBResult> {
    await this.ensureInitialized();
    
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      const stmt = this.db.prepare(`
        INSERT INTO users (id, name, email, password, role, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.bind([
        user.id,
        user.name,
        user.email,
        user.password, // In real app, this should be hashed
        user.role,
        user.status,
        new Date().toISOString()
      ]);
      
      stmt.step();
      stmt.free();
      
      this.saveToLocalStorage();
      
      return { success: true };
    } catch (error) {
      console.error('Create user error:', error);
      return { success: false, error: "Failed to create user" };
    }
  }

  // More database methods would go here for pages, permissions, etc.

  async getPages(): Promise<DBResult> {
    await this.ensureInitialized();
    
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      const result = this.db.exec("SELECT * FROM pages");
      
      if (result.length > 0) {
        const columns = result[0].columns;
        const pages = result[0].values.map(row => {
          const page: Record<string, any> = {};
          columns.forEach((col, i) => {
            // Convert SQLite boolean (0/1) to JavaScript boolean
            if (col === 'is_published' || col === 'show_in_menu') {
              page[col] = row[i] === 1;
            } else {
              page[col] = row[i];
            }
          });
          return page;
        });
        
        return { success: true, data: pages };
      }
      
      return { success: true, data: [] };
    } catch (error) {
      console.error('Get pages error:', error);
      return { success: false, error: "Failed to get pages" };
    }
  }
}

export default DatabaseService;
