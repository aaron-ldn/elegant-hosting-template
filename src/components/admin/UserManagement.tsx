
import React, { useState } from 'react';
import { User, Role, Permission } from '@/data/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, UserX, UserCheck, Edit, ChevronDown, Shield, Key } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

// Mock initial data for users
const initialUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@cloudhost.com",
    role: "admin",
    status: "active",
    lastActive: "2023-06-12T09:45:00",
    createdAt: "2023-01-15T08:30:00"
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@cloudhost.com",
    role: "editor",
    status: "active",
    lastActive: "2023-06-10T14:22:00",
    createdAt: "2023-02-20T10:15:00"
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@cloudhost.com",
    role: "viewer",
    status: "inactive",
    lastActive: "2023-05-28T11:10:00",
    createdAt: "2023-03-05T09:45:00"
  }
];

// Mock permissions data
const initialPermissions: Permission[] = [
  {
    id: "1",
    name: "Manage Users",
    description: "Create, edit, and delete users",
    roles: ["admin"]
  },
  {
    id: "2",
    name: "Edit Content",
    description: "Edit website content, pricing, and FAQs",
    roles: ["admin", "editor"]
  },
  {
    id: "3",
    name: "View Dashboard",
    description: "View dashboard statistics",
    roles: ["admin", "editor", "viewer"]
  },
  {
    id: "4",
    name: "Change Settings",
    description: "Modify website settings",
    roles: ["admin"]
  }
];

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [permissions, setPermissions] = useState<Permission[]>(initialPermissions);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: '',
    email: '',
    role: 'viewer',
    status: 'active',
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isRoleManagementOpen, setIsRoleManagementOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  
  const { toast } = useToast();

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      toast({
        title: "Error",
        description: "Name and email are required",
        variant: "destructive",
      });
      return;
    }

    const user: User = {
      id: uuidv4(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role as Role,
      status: newUser.status as 'active' | 'inactive',
      createdAt: new Date().toISOString(),
    };

    setUsers([...users, user]);
    setNewUser({
      name: '',
      email: '',
      role: 'viewer',
      status: 'active',
    });
    setShowAddUser(false);
    
    toast({
      title: "Success",
      description: `${user.name} has been added as a ${user.role}`,
    });
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowAddUser(true);
    setNewUser({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
  };

  const handleUpdateUser = () => {
    if (!selectedUser || !newUser.name || !newUser.email) {
      toast({
        title: "Error",
        description: "Name and email are required",
        variant: "destructive",
      });
      return;
    }

    const updatedUsers = users.map(user => 
      user.id === selectedUser.id 
        ? { 
            ...user, 
            name: newUser.name as string, 
            email: newUser.email as string, 
            role: newUser.role as Role, 
            status: newUser.status as 'active' | 'inactive' 
          } 
        : user
    );

    setUsers(updatedUsers);
    setShowAddUser(false);
    setSelectedUser(null);
    setNewUser({
      name: '',
      email: '',
      role: 'viewer',
      status: 'active',
    });
    
    toast({
      title: "Success",
      description: "User has been updated",
    });
  };

  const handleDeleteUser = (id: string) => {
    const userToDelete = users.find(user => user.id === id);
    if (!userToDelete) return;
    
    setUsers(users.filter(user => user.id !== id));
    
    toast({
      title: "Success",
      description: `${userToDelete.name} has been removed`,
    });
  };

  const handleUpdatePermission = (permissionId: string, role: Role, checked: boolean) => {
    setPermissions(permissions.map(permission => {
      if (permission.id === permissionId) {
        return {
          ...permission,
          roles: checked 
            ? [...permission.roles, role] 
            : permission.roles.filter(r => r !== role)
        };
      }
      return permission;
    }));
    
    toast({
      title: "Permissions updated",
      description: "Role permissions have been updated",
    });
  };

  const getRoleLabel = (role: Role) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'editor': return 'Content Editor';
      case 'viewer': return 'Viewer (Read-only)';
      default: return role;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-muted-foreground">Manage staff members and their permissions</p>
        </div>
        
        <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setSelectedUser(null);
              setNewUser({
                name: '',
                email: '',
                role: 'viewer',
                status: 'active',
              });
            }}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedUser ? 'Edit User' : 'Add New User'}</DialogTitle>
              <DialogDescription>
                {selectedUser 
                  ? 'Update the user details below.' 
                  : 'Fill in the information for the new staff member.'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newUser.name || ''}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email || ''}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <select 
                  id="role"
                  value={newUser.role || 'viewer'}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as Role })}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="admin">Administrator</option>
                  <option value="editor">Content Editor</option>
                  <option value="viewer">Viewer (Read-only)</option>
                </select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <select 
                  id="status"
                  value={newUser.status || 'active'}
                  onChange={(e) => setNewUser({ ...newUser, status: e.target.value as 'active' | 'inactive' })}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddUser(false)}>
                Cancel
              </Button>
              <Button onClick={selectedUser ? handleUpdateUser : handleAddUser}>
                {selectedUser ? 'Update User' : 'Add User'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <Card key={user.id} className={user.status === 'inactive' ? 'opacity-70' : ''}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{user.name}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditUser(user)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <UserX className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex flex-col space-y-1">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{getRoleLabel(user.role)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex h-2 w-2 rounded-full ${
                    user.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                  }`} />
                  <span className="text-sm text-muted-foreground capitalize">{user.status}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground pt-0">
              <div className="w-full">
                <div className="flex justify-between">
                  <span>Last active:</span>
                  <span>{formatDate(user.lastActive)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Created:</span>
                  <span>{formatDate(user.createdAt)}</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <Collapsible
        open={isRoleManagementOpen}
        onOpenChange={setIsRoleManagementOpen}
        className="border rounded-lg"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex gap-2 items-center">
            <Key className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Roles & Permissions</h3>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              <ChevronDown className={`h-4 w-4 transition-transform ${isRoleManagementOpen ? 'transform rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent>
          <div className="p-4">
            <div className="mb-4">
              <p className="text-muted-foreground text-sm">Manage what each role can do within the admin panel</p>
            </div>
            
            <div className="overflow-hidden border rounded-md">
              <div className="grid grid-cols-5 gap-1 bg-muted p-3 font-medium text-sm border-b">
                <div className="col-span-2">Permission</div>
                <div className="text-center">Admin</div>
                <div className="text-center">Editor</div>
                <div className="text-center">Viewer</div>
              </div>
              
              {permissions.map((permission) => (
                <div key={permission.id} className="grid grid-cols-5 gap-1 p-3 border-b last:border-0 items-center text-sm">
                  <div className="col-span-2">
                    <div className="font-medium">{permission.name}</div>
                    <div className="text-xs text-muted-foreground">{permission.description}</div>
                  </div>
                  
                  <div className="flex justify-center">
                    <Checkbox
                      checked={permission.roles.includes('admin')}
                      onCheckedChange={(checked) => 
                        handleUpdatePermission(permission.id, 'admin', checked as boolean)
                      }
                      disabled={permission.name === 'Manage Users'} // Admin always has this permission
                    />
                  </div>
                  
                  <div className="flex justify-center">
                    <Checkbox
                      checked={permission.roles.includes('editor')}
                      onCheckedChange={(checked) => 
                        handleUpdatePermission(permission.id, 'editor', checked as boolean)
                      }
                    />
                  </div>
                  
                  <div className="flex justify-center">
                    <Checkbox
                      checked={permission.roles.includes('viewer')}
                      onCheckedChange={(checked) => 
                        handleUpdatePermission(permission.id, 'viewer', checked as boolean)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default UserManagement;
