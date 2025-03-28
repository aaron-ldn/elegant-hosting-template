
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Pricing from '@/components/Pricing';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import AdminLink from '@/components/AdminLink';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="fixed bottom-4 right-4 z-50">
        <AdminLink />
      </div>
      <Hero />
      <Features />
      <Pricing />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
