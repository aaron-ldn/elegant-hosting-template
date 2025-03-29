
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Page } from '@/data/types';

// Mock data - in a real app, this would come from an API or database
const mockPages: Page[] = [
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
    // Simulate API call to fetch page data
    setTimeout(() => {
      // Filter only published pages that should be shown in the menu
      const menuPages = mockPages
        .filter(page => page.isPublished && page.showInMenu)
        .sort((a, b) => a.order - b.order);
      
      setPages(menuPages);
    }, 300);
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
