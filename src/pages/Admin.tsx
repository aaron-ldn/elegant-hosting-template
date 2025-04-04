import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { LayoutDashboard, Users, FileText, Settings, Layers, HelpCircle, FilePenLine, Loader2 } from "lucide-react";
import PricingEditor from "@/components/admin/PricingEditor";
import FAQEditor from "@/components/admin/FAQEditor";
import UserManagement from "@/components/admin/UserManagement";
import PageManagement from "@/components/admin/PageManagement";
import PageBuilder from "@/components/admin/PageBuilder";
import SettingsManager from "@/components/admin/SettingsManager";
import DatabaseService from "@/services/DatabaseService";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarFooter,
} from "@/components/ui/sidebar";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('admin@cloudhost.com');
  const [password, setPassword] = useState('password');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activePage, setActivePage] = useState('');
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const storedUser = localStorage.getItem('cloudhost_user');
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            setIsAuthenticated(true);
            console.log('User session restored from localStorage');
          } catch (error) {
            console.error('Failed to parse stored user data:', error);
            localStorage.removeItem('cloudhost_user');
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsInitializing(false);
      }
    };
    
    checkUserSession();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log(`Attempting login with: ${email}`);
      const dbService = DatabaseService.getInstance();
      const result = await dbService.authenticateUser(email, password);
      
      console.log('Login result:', result);
      
      if (result.success && result.data) {
        localStorage.setItem('cloudhost_user', JSON.stringify(result.data));
        
        setUser(result.data);
        setIsAuthenticated(true);
        toast({
          title: "Login successful",
          description: `Welcome back, ${result.data.name}`,
        });
      } else {
        toast({
          title: "Login failed",
          description: result.error || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login error",
        description: "An unexpected error occurred: " + (error instanceof Error ? error.message : String(error)),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('cloudhost_user');
    setIsAuthenticated(false);
    setUser(null);
    setEmail('admin@cloudhost.com');
    setPassword('password');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const handleDevLogin = () => {
    const devUser = {
      id: 'dev-user',
      name: 'Developer',
      email: 'dev@example.com',
      role: 'admin',
      status: 'active',
    };
    localStorage.setItem('cloudhost_user', JSON.stringify(devUser));
    setIsAuthenticated(true);
    setUser(devUser);
    toast({
      title: "Dev mode active",
      description: "Logged in using development credentials",
    });
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>
                  Key metrics and website performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Visitors
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">1,248</div>
                      <p className="text-xs text-muted-foreground">
                        +12% from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Conversion Rate
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">3.2%</div>
                      <p className="text-xs text-muted-foreground">
                        +0.5% from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Active Users
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">342</div>
                      <p className="text-xs text-muted-foreground">
                        +18% from last month
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'pages':
        if (activePage === 'manage') {
          return <PageManagement />;
        } else if (activePage === 'builder') {
          return <PageBuilder />;
        } else if (activePage === 'pricing') {
          return (
            <Card>
              <CardHeader>
                <CardTitle>Pricing Plans</CardTitle>
                <CardDescription>
                  Manage your pricing plans
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PricingEditor />
              </CardContent>
            </Card>
          );
        } else if (activePage === 'faqs') {
          return (
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Manage your FAQs section
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FAQEditor />
              </CardContent>
            </Card>
          );
        } else if (activePage === 'content') {
          return (
            <Card>
              <CardHeader>
                <CardTitle>Website Content</CardTitle>
                <CardDescription>
                  Update your website content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hero-title">Hero Title</Label>
                  <Input 
                    id="hero-title" 
                    defaultValue="Professional Web Hosting Solutions" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero-subtitle">Hero Subtitle</Label>
                  <Input 
                    id="hero-subtitle" 
                    defaultValue="Fast, reliable, and secure hosting for your business" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="about-text">About Section</Label>
                  <Textarea 
                    id="about-text" 
                    rows={5}
                    defaultValue="CloudHost provides enterprise-grade hosting solutions for businesses of all sizes. With 99.9% uptime guarantee and 24/7 support, we ensure your website performs at its best." 
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => {
                  toast({
                    title: "Content updated",
                    description: "Your changes have been saved",
                  });
                }}>
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          );
        }
        return (
          <Card>
            <CardHeader>
              <CardTitle>Pages</CardTitle>
              <CardDescription>
                Select a page to edit from the sidebar menu
              </CardDescription>
            </CardHeader>
          </Card>
        );
      case 'users':
        return <UserManagement />;
      case 'settings':
        return <SettingsManager />;
      default:
        return null;
    }
  };

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>
              Login to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="text-xs text-muted-foreground">
                Default login: admin@cloudhost.com / password
              </div>
            </CardContent>
            <CardFooter className="flex-col space-y-2">
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : "Login"}
              </Button>
              
              <div className="w-full">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={handleDevLogin}
                >
                  Quick Dev Login
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-100">
        <Sidebar collapsible="icon" variant="sidebar">
          <SidebarHeader className="flex flex-col items-center justify-center p-4 border-b">
            <h2 className="text-xl font-bold">CloudHost Admin</h2>
            {user && (
              <p className="text-xs text-muted-foreground">{user.name} ({user.role})</p>
            )}
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={activeSection === 'dashboard'}
                      tooltip="Dashboard"
                      onClick={() => {
                        setActiveSection('dashboard');
                        setActivePage('');
                      }}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={activeSection === 'pages'}
                      tooltip="Pages"
                      onClick={() => {
                        setActiveSection('pages');
                        setActivePage('');
                      }}
                    >
                      <FileText className="h-4 w-4" />
                      <span>Pages</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  {activeSection === 'pages' && (
                    <>
                      <SidebarMenuItem className="pl-6">
                        <SidebarMenuButton 
                          isActive={activePage === 'manage'}
                          tooltip="Page Management"
                          size="sm"
                          onClick={() => {
                            setActivePage('manage');
                          }}
                        >
                          <FilePenLine className="h-4 w-4" />
                          <span>Page Management</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem className="pl-6">
                        <SidebarMenuButton 
                          isActive={activePage === 'builder'}
                          tooltip="Page Builder"
                          size="sm"
                          onClick={() => {
                            setActivePage('builder');
                          }}
                        >
                          <Layers className="h-4 w-4" />
                          <span>Page Builder</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem className="pl-6">
                        <SidebarMenuButton 
                          isActive={activePage === 'content'}
                          tooltip="Content"
                          size="sm"
                          onClick={() => {
                            setActivePage('content');
                          }}
                        >
                          <span>General Content</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem className="pl-6">
                        <SidebarMenuButton 
                          isActive={activePage === 'pricing'}
                          tooltip="Pricing"
                          size="sm"
                          onClick={() => {
                            setActivePage('pricing');
                          }}
                        >
                          <Layers className="h-4 w-4" />
                          <span>Pricing Plans</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem className="pl-6">
                        <SidebarMenuButton 
                          isActive={activePage === 'faqs'}
                          tooltip="FAQs"
                          size="sm"
                          onClick={() => {
                            setActivePage('faqs');
                          }}
                        >
                          <HelpCircle className="h-4 w-4" />
                          <span>FAQs</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </>
                  )}
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={activeSection === 'users'}
                      tooltip="Users"
                      onClick={() => {
                        setActiveSection('users');
                        setActivePage('');
                      }}
                    >
                      <Users className="h-4 w-4" />
                      <span>Users</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={activeSection === 'settings'}
                      tooltip="Settings"
                      onClick={() => {
                        setActiveSection('settings');
                        setActivePage('');
                      }}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="w-full"
            >
              Logout
            </Button>
          </SidebarFooter>
        </Sidebar>
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
