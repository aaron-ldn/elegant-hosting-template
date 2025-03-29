
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Page } from '@/data/types';

// Storage key for pages
const PAGES_STORAGE_KEY = 'cloudhost_pages';

// Initial fallback pages if none are found in storage
const initialPages: Page[] = [
  {
    id: '1',
    title: 'About Us',
    slug: 'about-us',
    content: '',
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
    content: '',
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    order: 2,
    showInMenu: true
  }
];

const PageNavigationMenu = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const location = useLocation();

  useEffect(() => {
    // Load pages from localStorage
    const loadPages = () => {
      const savedPages = localStorage.getItem(PAGES_STORAGE_KEY);
      if (savedPages) {
        try {
          const parsedPages = JSON.parse(savedPages);
          // Filter only published pages that should be shown in the menu
          const menuPages = parsedPages
            .filter((page: Page) => page.isPublished && page.showInMenu)
            .sort((a: Page, b: Page) => a.order - b.order);
          
          setPages(menuPages);
        } catch (error) {
          console.error('Error parsing saved pages:', error);
          // Fall back to initial pages if there's an error
          const menuPages = initialPages
            .filter(page => page.isPublished && page.showInMenu)
            .sort((a, b) => a.order - b.order);
          
          setPages(menuPages);
        }
      } else {
        // Use initial pages if none are in storage
        const menuPages = initialPages
          .filter(page => page.isPublished && page.showInMenu)
          .sort((a, b) => a.order - b.order);
        
        setPages(menuPages);
      }
    };

    loadPages();

    // Add event listener to detect changes in localStorage
    window.addEventListener('storage', loadPages);

    return () => {
      window.removeEventListener('storage', loadPages);
    };
  }, []);

  return (
    <div className="flex space-x-4">
      {pages.map(page => (
        <Link
          key={page.id}
          to={`/pages/${page.slug}`}
          className={`text-sm font-medium transition-colors hover:text-primary ${
            location.pathname === `/pages/${page.slug}` 
              ? 'text-primary' 
              : 'text-muted-foreground'
          }`}
        >
          {page.title}
        </Link>
      ))}
    </div>
  );
};

export default PageNavigationMenu;
