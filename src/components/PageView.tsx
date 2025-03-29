
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Page } from '@/data/types';
import { ArrowLeft } from 'lucide-react';

// Storage key for pages
const PAGES_STORAGE_KEY = 'cloudhost_pages';

// Initial fallback pages if none are found in storage
const initialPages: Page[] = [
  {
    id: '1',
    title: 'About Us',
    slug: 'about-us',
    content: '<h1 class="text-3xl font-bold mb-6">About Us</h1><p class="mb-4">We are a leading web hosting provider committed to delivering exceptional service and reliability to businesses of all sizes.</p><p class="mb-4">Founded in 2010, CloudHost has grown to become one of the most trusted names in web hosting, serving thousands of customers worldwide.</p><h2 class="text-2xl font-bold mt-8 mb-4">Our Mission</h2><p class="mb-4">Our mission is to empower businesses with reliable, scalable, and secure hosting solutions that enable growth and success in the digital world.</p>',
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
    content: '<h1 class="text-3xl font-bold mb-6">Our Services</h1><p class="mb-4">We offer a comprehensive range of hosting services designed to meet your specific needs:</p><ul class="list-disc pl-6 mb-6"><li class="mb-2">Shared Hosting</li><li class="mb-2">VPS Hosting</li><li class="mb-2">Dedicated Servers</li><li class="mb-2">Cloud Hosting</li><li class="mb-2">WordPress Hosting</li></ul><p>Each service is backed by our 24/7 support team and 99.9% uptime guarantee.</p>',
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    order: 2,
    showInMenu: true
  }
];

const PageView = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Get pages from localStorage
    const savedPages = localStorage.getItem(PAGES_STORAGE_KEY);
    let pagesArray: Page[] = [];
    
    if (savedPages) {
      try {
        pagesArray = JSON.parse(savedPages);
      } catch (error) {
        console.error('Error parsing saved pages:', error);
        pagesArray = initialPages;
      }
    } else {
      pagesArray = initialPages;
    }

    // Find the requested page
    setTimeout(() => {
      const foundPage = pagesArray.find(p => p.slug === slug && p.isPublished);
      
      if (foundPage) {
        setPage(foundPage);
      } else {
        setError('Page not found');
      }
      
      setLoading(false);
    }, 300); // Keep the small delay for UX
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6 mb-4"></div>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-6">The page you're looking for doesn't exist or isn't published.</p>
        <Link 
          to="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: page.content }}></div>
      <div className="mt-12 pt-6 border-t">
        <Link 
          to="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default PageView;
