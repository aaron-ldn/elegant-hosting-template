
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQs = () => {
  // This will be replaced with dynamic content from the admin panel later
  const faqs = [
    {
      question: "How reliable is your hosting?",
      answer: "We offer 99.9% uptime guarantee on all our hosting plans. Our infrastructure is built on enterprise-grade hardware with redundant systems to ensure your website stays online."
    },
    {
      question: "Do you offer refunds?",
      answer: "Yes, we offer a 30-day money-back guarantee on all our hosting plans. If you're not satisfied with our service, you can request a full refund within the first 30 days."
    },
    {
      question: "Can I upgrade my plan later?",
      answer: "Absolutely! You can upgrade your hosting plan at any time. The price difference will be prorated for the remainder of your billing cycle."
    },
    {
      question: "What control panel do you use?",
      answer: "We use cPanel, the industry-standard control panel that makes it easy to manage your hosting account, domains, email, and more."
    },
    {
      question: "Do you offer WordPress hosting?",
      answer: "Yes, all our hosting plans are optimized for WordPress. We also offer one-click WordPress installation to help you get started quickly."
    }
  ];

  return (
    <section id="faqs" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-lg text-gray-600">
            Find answers to common questions about our hosting services.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-semibold">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQs;
