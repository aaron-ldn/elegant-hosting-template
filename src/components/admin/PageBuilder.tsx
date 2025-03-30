
import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import SortableElement from '@/components/admin/pagebuilder/SortableElement';
import ElementToolbox from '@/components/admin/pagebuilder/ElementToolbox';
import { v4 as uuidv4 } from 'uuid';

// Define element types
export type ElementType = 'heading' | 'paragraph' | 'image' | 'button' | 'divider' | 'spacer';

// Element interface
export interface PageElement {
  id: string;
  type: ElementType;
  content: string;
  props?: Record<string, any>;
}

// Page interface
export interface BuilderPage {
  id: string;
  title: string;
  slug: string;
  elements: PageElement[];
  isPublished: boolean;
  showInMenu: boolean;
  createdAt: string;
  updatedAt: string;
  order: number;
}

const BUILDER_PAGES_STORAGE_KEY = 'cloudhost_builder_pages';

const PageBuilder = () => {
  const [pages, setPages] = useState<BuilderPage[]>([]);
  const [currentPage, setCurrentPage] = useState<BuilderPage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pageTitle, setPageTitle] = useState('');
  const [pageSlug, setPageSlug] = useState('');
  const { toast } = useToast();

  // Set up DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load pages from localStorage
  useEffect(() => {
    const savedPages = localStorage.getItem(BUILDER_PAGES_STORAGE_KEY);
    if (savedPages) {
      try {
        setPages(JSON.parse(savedPages));
      } catch (error) {
        console.error('Error loading builder pages:', error);
      }
    }
  }, []);

  // Save pages to localStorage whenever they change
  useEffect(() => {
    if (pages.length > 0) {
      localStorage.setItem(BUILDER_PAGES_STORAGE_KEY, JSON.stringify(pages));
    }
  }, [pages]);

  const createNewPage = () => {
    if (!pageTitle.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for the page",
        variant: "destructive",
      });
      return;
    }

    const newPageSlug = pageSlug.trim() || pageTitle.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');
    const timestamp = new Date().toISOString();
    
    const newPage: BuilderPage = {
      id: uuidv4(),
      title: pageTitle,
      slug: newPageSlug,
      elements: [],
      isPublished: false,
      showInMenu: false,
      createdAt: timestamp,
      updatedAt: timestamp,
      order: pages.length + 1
    };
    
    setPages([...pages, newPage]);
    setCurrentPage(newPage);
    setPageTitle('');
    setPageSlug('');
    
    toast({
      title: "Page created",
      description: `New page "${newPage.title}" has been created`,
    });
  };

  const savePage = () => {
    if (!currentPage) return;
    
    setIsLoading(true);
    
    try {
      const updatedPages = pages.map(page => 
        page.id === currentPage.id ? {...currentPage, updatedAt: new Date().toISOString()} : page
      );
      
      setPages(updatedPages);
      
      toast({
        title: "Page saved",
        description: `Changes to "${currentPage.title}" have been saved`,
      });
    } catch (error) {
      console.error('Error saving page:', error);
      toast({
        title: "Save failed",
        description: "There was an error saving the page",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddElement = (type: ElementType) => {
    if (!currentPage) return;
    
    const newElement: PageElement = {
      id: uuidv4(),
      type,
      content: getDefaultContent(type),
      props: getDefaultProps(type),
    };
    
    setCurrentPage({
      ...currentPage,
      elements: [...currentPage.elements, newElement],
    });
  };

  const getDefaultContent = (type: ElementType): string => {
    switch (type) {
      case 'heading': return 'New Heading';
      case 'paragraph': return 'Enter text here...';
      case 'image': return 'https://placehold.co/600x400';
      case 'button': return 'Click Me';
      default: return '';
    }
  };

  const getDefaultProps = (type: ElementType): Record<string, any> => {
    switch (type) {
      case 'heading': return { size: 'h2' };
      case 'image': return { alt: 'Image description' };
      case 'button': return { variant: 'default', url: '#' };
      case 'spacer': return { height: '30px' };
      default: return {};
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id || !currentPage) return;
    
    const oldIndex = currentPage.elements.findIndex(el => el.id === active.id);
    const newIndex = currentPage.elements.findIndex(el => el.id === over.id);
    
    const updatedElements = arrayMove(currentPage.elements, oldIndex, newIndex);
    setCurrentPage({...currentPage, elements: updatedElements});
  };

  const updateElementContent = (id: string, content: string) => {
    if (!currentPage) return;
    
    const updatedElements = currentPage.elements.map(el => 
      el.id === id ? {...el, content} : el
    );
    
    setCurrentPage({...currentPage, elements: updatedElements});
  };

  const updateElementProps = (id: string, props: Record<string, any>) => {
    if (!currentPage) return;
    
    const updatedElements = currentPage.elements.map(el => 
      el.id === id ? {...el, props: {...el.props, ...props}} : el
    );
    
    setCurrentPage({...currentPage, elements: updatedElements});
  };

  const deleteElement = (id: string) => {
    if (!currentPage) return;
    
    const updatedElements = currentPage.elements.filter(el => el.id !== id);
    setCurrentPage({...currentPage, elements: updatedElements});
  };

  const publishPage = () => {
    if (!currentPage) return;
    
    try {
      const htmlContent = generateHtmlContent(currentPage.elements);
      
      // Extract pages from localStorage
      const PAGES_STORAGE_KEY = 'cloudhost_pages';
      const savedPages = localStorage.getItem(PAGES_STORAGE_KEY);
      let pagesArray = [];
      
      if (savedPages) {
        try {
          pagesArray = JSON.parse(savedPages);
        } catch (error) {
          console.error('Error parsing saved pages:', error);
          pagesArray = [];
        }
      }
      
      // Check if the page already exists in the pages array
      const existingPageIndex = pagesArray.findIndex(p => p.slug === currentPage.slug);
      const timestamp = new Date().toISOString();
      
      if (existingPageIndex !== -1) {
        // Update existing page
        pagesArray[existingPageIndex] = {
          ...pagesArray[existingPageIndex],
          title: currentPage.title,
          content: htmlContent,
          isPublished: true,
          updatedAt: timestamp,
        };
      } else {
        // Create new page
        pagesArray.push({
          id: currentPage.id,
          title: currentPage.title,
          slug: currentPage.slug,
          content: htmlContent,
          isPublished: true,
          showInMenu: currentPage.showInMenu,
          createdAt: timestamp,
          updatedAt: timestamp,
          order: pagesArray.length + 1
        });
      }
      
      // Save updated pages array back to localStorage
      localStorage.setItem(PAGES_STORAGE_KEY, JSON.stringify(pagesArray));
      
      // Update current page isPublished status
      setCurrentPage({...currentPage, isPublished: true});
      
      toast({
        title: "Page published",
        description: `"${currentPage.title}" has been published successfully`,
      });
    } catch (error) {
      console.error('Error publishing page:', error);
      toast({
        title: "Publishing failed",
        description: "There was an error publishing the page",
        variant: "destructive",
      });
    }
  };

  const generateHtmlContent = (elements: PageElement[]): string => {
    return elements.map(element => {
      switch (element.type) {
        case 'heading':
          const headingSize = element.props?.size || 'h2';
          const headingClass = getHeadingClass(headingSize);
          return `<${headingSize} class="${headingClass}">${element.content}</${headingSize}>`;
          
        case 'paragraph':
          return `<p class="mb-4">${element.content}</p>`;
          
        case 'image':
          return `<img src="${element.content}" alt="${element.props?.alt || ''}" class="max-w-full h-auto rounded mb-4" />`;
          
        case 'button':
          const btnVariant = element.props?.variant || 'default';
          const btnClass = getBtnClass(btnVariant);
          return `<a href="${element.props?.url || '#'}" class="${btnClass}">${element.content}</a>`;
          
        case 'divider':
          return `<hr class="my-6 border-t border-gray-200" />`;
          
        case 'spacer':
          const height = element.props?.height || '20px';
          return `<div style="height: ${height}"></div>`;
          
        default:
          return '';
      }
    }).join('\n');
  };

  const getHeadingClass = (size: string): string => {
    switch (size) {
      case 'h1': return 'text-4xl font-bold mb-6';
      case 'h2': return 'text-3xl font-bold mb-4';
      case 'h3': return 'text-2xl font-bold mb-3';
      case 'h4': return 'text-xl font-bold mb-2';
      case 'h5': return 'text-lg font-bold mb-2';
      case 'h6': return 'text-base font-bold mb-2';
      default: return 'text-3xl font-bold mb-4';
    }
  };

  const getBtnClass = (variant: string): string => {
    switch (variant) {
      case 'default': return 'inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-4';
      case 'outline': return 'inline-block px-6 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 mb-4';
      case 'ghost': return 'inline-block px-6 py-2 text-blue-600 hover:bg-blue-50 rounded mb-4';
      default: return 'inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-4';
    }
  };

  // UI for when no page is selected
  if (!currentPage) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Page Builder</CardTitle>
            <CardDescription>
              Create or select a page to start building
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="page-title">Page Title</Label>
                <Input 
                  id="page-title" 
                  value={pageTitle}
                  onChange={(e) => {
                    setPageTitle(e.target.value);
                    if (!pageSlug) {
                      setPageSlug(e.target.value.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-'));
                    }
                  }}
                  placeholder="Enter page title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="page-slug">Page Slug</Label>
                <Input 
                  id="page-slug" 
                  value={pageSlug}
                  onChange={(e) => setPageSlug(e.target.value.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-'))}
                  placeholder="enter-page-slug"
                />
              </div>
            </div>
            
            <Button onClick={createNewPage}>Create New Page</Button>
            
            {pages.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Your Pages</h3>
                <div className="divide-y">
                  {pages.map((page) => (
                    <div key={page.id} className="py-3 flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{page.title}</h4>
                        <p className="text-sm text-muted-foreground">/pages/{page.slug}</p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(page)}
                      >
                        Edit
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // UI for when a page is selected
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Editing: {currentPage.title}</CardTitle>
            <CardDescription>
              Drag and drop elements to build your page
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(null)}
            >
              Back
            </Button>
            <Button 
              variant="outline"
              onClick={publishPage}
            >
              Publish
            </Button>
            <Button 
              onClick={savePage}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : "Save Changes"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <ElementToolbox onAddElement={handleAddElement} />
            </div>
            <div className="md:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Canvas</CardTitle>
                  <CardDescription>
                    Click on elements to edit their properties
                  </CardDescription>
                </CardHeader>
                <CardContent className="min-h-[400px] border-2 border-dashed border-gray-200 rounded-md p-4">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToVerticalAxis, restrictToParentElement]}
                  >
                    <SortableContext
                      items={currentPage.elements.map(el => el.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-2">
                        {currentPage.elements.length === 0 ? (
                          <div className="text-center py-12 text-muted-foreground">
                            Drag elements from the toolbox to start building your page
                          </div>
                        ) : (
                          currentPage.elements.map((element) => (
                            <SortableElement
                              key={element.id}
                              element={element}
                              updateContent={updateElementContent}
                              updateProps={updateElementProps}
                              deleteElement={deleteElement}
                            />
                          ))
                        )}
                      </div>
                    </SortableContext>
                  </DndContext>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PageBuilder;
