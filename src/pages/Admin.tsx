
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { LayoutDashboard, Users, FileText, Settings, Layers, HelpCircle, FilePenLine } from "lucide-react";
import PricingEditor from "@/components/admin/PricingEditor";
import FAQEditor from "@/components/admin/FAQEditor";
import UserManagement from "@/components/admin/UserManagement";
import PageManagement from "@/components/admin/PageManagement";
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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activePage, setActivePage] = useState('');
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      toast({
        title: "Login successful",
        description: "Welcome to the admin panel",
      });
    } else {
      toast({
        title: "Login failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    }
  };

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
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">Login</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

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
        return (
          <Card>
            <CardHeader>
              <CardTitle>Website Settings</CardTitle>
              <CardDescription>
                Configure your website settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site-name">Site Name</Label>
                <Input 
                  id="site-name" 
                  defaultValue="CloudHost" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-url">Site URL</Label>
                <Input 
                  id="site-url" 
                  defaultValue="https://cloudhost.com" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">Contact Email</Label>
                <Input 
                  id="contact-email" 
                  defaultValue="info@cloudhost.com" 
                  type="email"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => {
                toast({
                  title: "Settings updated",
                  description: "Your settings have been saved",
                });
              }}>
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-100">
        <Sidebar collapsible="icon" variant="sidebar">
          <SidebarHeader className="flex flex-col items-center justify-center p-4 border-b">
            <h2 className="text-xl font-bold">CloudHost Admin</h2>
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
              onClick={() => setIsAuthenticated(false)}
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
