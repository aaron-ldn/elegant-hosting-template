
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
      // Check if we have a database in localStorage first
      const loadedFromStorage = await this.loadFromLocalStorage();
      
      if (!loadedFromStorage) {
        console.log('No database in localStorage, creating a new one...');
        // Initialize SQL.js only if we didn't load from localStorage
        const SQL = await initSqlJs({
          // Updated path to the correct CDN location for wasm file
          locateFile: file => `https://sql.js.org/dist/${file}`
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

        // Create settings table
        this.db.run(`
          CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL,
            updated_at TEXT NOT NULL
          );
        `);

        // Insert default settings
        this.db.run(`
          INSERT OR IGNORE INTO settings (key, value, updated_at)
          VALUES 
            ('site_name', 'CloudHost', '${new Date().toISOString()}'),
            ('site_url', 'https://cloudhost.com', '${new Date().toISOString()}'),
            ('contact_email', 'info@cloudhost.com', '${new Date().toISOString()}')
        `);

        // Insert default admin user if none exists
        const result = this.db.exec("SELECT * FROM users WHERE email = 'admin@cloudhost.com'");
        if (result.length === 0 || result[0].values.length === 0) {
          console.log('Creating default admin user...');
          this.db.run(`
            INSERT INTO users (id, name, email, password, role, status, created_at)
            VALUES ('1', 'Admin User', 'admin@cloudhost.com', 'password', 'admin', 'active', '${new Date().toISOString()}')
          `);
        }

        // Save the database to localStorage
        await this.saveToLocalStorage();
      }

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
      console.log('Waiting for database initialization...');
      await this.initPromise;
    }
  }

  // Save the current database state to localStorage
  private async saveToLocalStorage(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        try {
          const data = this.db.export();
          const buffer = new Uint8Array(data);
          const blob = new Blob([buffer]);
          
          // Convert to base64 for storage
          const reader = new FileReader();
          reader.onload = () => {
            if (reader.result) {
              localStorage.setItem('cloudhost_db', reader.result as string);
              console.log('Database saved to localStorage');
              resolve();
            } else {
              reject(new Error('Failed to read blob data'));
            }
          };
          reader.onerror = () => {
            reject(reader.error);
          };
          reader.readAsDataURL(blob);
        } catch (error) {
          console.error('Error exporting database:', error);
          reject(error);
        }
      } else {
        reject(new Error('Database not initialized'));
      }
    });
  }

  // Load the database from localStorage
  private async loadFromLocalStorage(): Promise<boolean> {
    try {
      const dbData = localStorage.getItem('cloudhost_db');
      if (dbData) {
        console.log('Found database in localStorage, loading...');
        const SQL = await initSqlJs({
          locateFile: file => `https://sql.js.org/dist/${file}`
        });

        // Convert from base64 back to binary
        const binaryString = atob(dbData.split(',')[1]);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        // Create database from the loaded data
        this.db = new SQL.Database(bytes);
        console.log('Database loaded from localStorage');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to load database from localStorage:', error);
      localStorage.removeItem('cloudhost_db'); // Remove corrupted data
      return false;
    }
  }

  // User operations
  async authenticateUser(email: string, password: string): Promise<DBResult> {
    try {
      await this.ensureInitialized();
      
      if (!this.db) {
        console.error('Database not initialized during authentication');
        throw new Error("Database not initialized");
      }
      
      console.log(`Authenticating user: ${email}`);
      
      // First get the user to check if they exist
      const stmt = this.db.prepare("SELECT * FROM users WHERE email = ?");
      stmt.bind([email]);
      
      const result = [];
      while (stmt.step()) {
        result.push(stmt.getAsObject());
      }
      stmt.free();
      
      console.log('Authentication query results:', result);
      
      if (result.length > 0) {
        const user = result[0];
        
        // Compare passwords directly (in a real app, use bcrypt or similar)
        if (user.password === password) {
          // Update last active time
          const updateStmt = this.db.prepare("UPDATE users SET last_active = ? WHERE id = ?");
          updateStmt.bind([new Date().toISOString(), user.id]);
          updateStmt.step();
          updateStmt.free();
          
          await this.saveToLocalStorage();
          
          console.log('Authentication successful');
          return { 
            success: true, 
            data: user 
          };
        }
        
        console.log('Invalid password');
        return { 
          success: false, 
          error: "Invalid password" 
        };
      }
      
      console.log('User not found');
      return { 
        success: false, 
        error: "User not found" 
      };
    } catch (error) {
      console.error('Authentication error:', error);
      return { 
        success: false, 
        error: "Authentication failed: " + (error instanceof Error ? error.message : String(error)) 
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

  // Settings operations
  async getSettings(): Promise<DBResult> {
    await this.ensureInitialized();
    
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      const result = this.db.exec("SELECT key, value FROM settings");
      
      if (result.length > 0) {
        const settings: Record<string, string> = {};
        result[0].values.forEach(row => {
          settings[row[0] as string] = row[1] as string;
        });
        
        return { success: true, data: settings };
      }
      
      return { success: true, data: {} };
    } catch (error) {
      console.error('Get settings error:', error);
      return { success: false, error: "Failed to get settings" };
    }
  }

  async updateSettings(settings: Record<string, string>): Promise<DBResult> {
    await this.ensureInitialized();
    
    try {
      if (!this.db) throw new Error("Database not initialized");
      
      const now = new Date().toISOString();
      
      // Begin a transaction
      this.db.run("BEGIN TRANSACTION");
      
      try {
        const stmt = this.db.prepare(`
          INSERT OR REPLACE INTO settings (key, value, updated_at)
          VALUES (?, ?, ?)
        `);
        
        // Update each setting
        for (const [key, value] of Object.entries(settings)) {
          stmt.bind([key, value, now]);
          stmt.step();
          stmt.reset();
        }
        
        stmt.free();
        
        // Commit the transaction if all updates were successful
        this.db.run("COMMIT");
        
        // Save changes to localStorage
        await this.saveToLocalStorage();
        
        return { success: true };
      } catch (error) {
        // Rollback on error
        this.db.run("ROLLBACK");
        throw error;
      }
    } catch (error) {
      console.error('Update settings error:', error);
      return { success: false, error: "Failed to update settings" };
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
