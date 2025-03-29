
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Page } from '@/data/types';
import { PlusCircle, Edit, Trash2, Eye, MoveVertical } from 'lucide-react';

// Mock data - in a real app, this would come from an API or database
const initialPages: Page[] = [
  {
    id: '1',
    title: 'About Us',
    slug: 'about-us',
    content: '<h1>About Us</h1><p>We are a leading web hosting provider...</p>',
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    order: 1,
    showInMenu: true
  },
  {
    id: '2',
    title: 'Services',
    slug: 'services',
    content: '<h1>Our Services</h1><p>We offer a range of services...</p>',
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    order: 2,
    showInMenu: true
  }
];

const PageManagement = () => {
  const [pages, setPages] = useState<Page[]>(initialPages);
  const [currentPage, setCurrentPage] = useState<Page | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [showInMenu, setShowInMenu] = useState(true);

  const resetForm = () => {
    setTitle('');
    setSlug('');
    setContent('');
    setIsPublished(true);
    setShowInMenu(true);
    setCurrentPage(null);
    setIsEditing(false);
  };

  const handleEditPage = (page: Page) => {
    setCurrentPage(page);
    setTitle(page.title);
    setSlug(page.slug);
    setContent(page.content);
    setIsPublished(page.isPublished);
    setShowInMenu(page.showInMenu);
    setIsEditing(true);
  };

  const handleDeletePage = (id: string) => {
    setPages(pages.filter(page => page.id !== id));
    toast({
      title: "Page deleted",
      description: "The page has been deleted successfully",
    });
  };

  const handleCreateOrUpdatePage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !slug.trim() || !content.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const timestamp = new Date().toISOString();
    
    if (isEditing && currentPage) {
      // Update existing page
      const updatedPages = pages.map(page => 
        page.id === currentPage.id 
          ? { 
              ...page, 
              title, 
              slug, 
              content, 
              isPublished, 
              showInMenu,
              updatedAt: timestamp 
            } 
          : page
      );
      
      setPages(updatedPages);
      toast({
        title: "Page updated",
        description: "Your changes have been saved",
      });
    } else {
      // Create new page
      const newPage: Page = {
        id: uuidv4(),
        title,
        slug,
        content,
        isPublished,
        showInMenu,
        createdAt: timestamp,
        updatedAt: timestamp,
        order: pages.length + 1
      };
      
      setPages([...pages, newPage]);
      toast({
        title: "Page created",
        description: "New page has been created successfully",
      });
    }
    
    resetForm();
  };

  const handleMovePageUp = (index: number) => {
    if (index === 0) return;
    
    const newPages = [...pages];
    [newPages[index].order, newPages[index-1].order] = [newPages[index-1].order, newPages[index].order];
    newPages.sort((a, b) => a.order - b.order);
    
    setPages(newPages);
    toast({
      title: "Page order updated",
      description: "The page has been moved up in the menu",
    });
  };

  const handleMovePageDown = (index: number) => {
    if (index === pages.length - 1) return;
    
    const newPages = [...pages];
    [newPages[index].order, newPages[index+1].order] = [newPages[index+1].order, newPages[index].order];
    newPages.sort((a, b) => a.order - b.order);
    
    setPages(newPages);
    toast({
      title: "Page order updated",
      description: "The page has been moved down in the menu",
    });
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    // Only auto-generate slug if we're creating a new page and slug hasn't been manually edited
    if (!isEditing && (!slug || slug === generateSlug(title))) {
      setSlug(generateSlug(newTitle));
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Page Management</CardTitle>
          <CardDescription>
            Create and manage pages for your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <form onSubmit={handleCreateOrUpdatePage} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Page Title</Label>
                  <Input 
                    id="title" 
                    placeholder="Enter page title"
                    value={title}
                    onChange={handleTitleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input 
                    id="slug" 
                    placeholder="Enter URL slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Page Content</Label>
                <Textarea 
                  id="content" 
                  placeholder="Enter page content (supports HTML)"
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="font-mono"
                />
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 md:items-center">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="published"
                    checked={isPublished}
                    onCheckedChange={setIsPublished}
                  />
                  <Label htmlFor="published">Published</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="showInMenu"
                    checked={showInMenu}
                    onCheckedChange={setShowInMenu}
                  />
                  <Label htmlFor="showInMenu">Show in Menu</Label>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit">
                  {isEditing ? 'Update Page' : 'Create Page'}
                </Button>
                {isEditing && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Pages</h3>
              {pages.length === 0 ? (
                <p className="text-muted-foreground">No pages created yet</p>
              ) : (
                <div className="divide-y">
                  {pages.map((page, index) => (
                    <div key={page.id} className="py-3 flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">
                          {page.title} 
                          {!page.isPublished && (
                            <span className="ml-2 text-xs bg-amber-100 text-amber-800 rounded-full px-2 py-0.5">
                              Draft
                            </span>
                          )}
                          {page.showInMenu && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
                              In Menu
                            </span>
                          )}
                        </h4>
                        <p className="text-sm text-muted-foreground">/pages/{page.slug}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          disabled={index === 0}
                          onClick={() => handleMovePageUp(index)}
                          title="Move Up"
                        >
                          <MoveVertical className="h-4 w-4 rotate-180" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          disabled={index === pages.length - 1}
                          onClick={() => handleMovePageDown(index)}
                          title="Move Down"
                        >
                          <MoveVertical className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditPage(page)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-500"
                          onClick={() => handleDeletePage(page.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          asChild
                        >
                          <a href={`/pages/${page.slug}`} target="_blank" rel="noopener noreferrer">
                            <Eye className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PageManagement;
