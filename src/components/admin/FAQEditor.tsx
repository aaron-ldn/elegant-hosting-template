
import React, { useState } from 'react';
import { FAQ } from '@/data/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Plus, MoveUp, MoveDown } from 'lucide-react';

// Initial FAQs - same as in the FAQs component
const initialFaqs: FAQ[] = [
  {
    id: '1',
    question: "How reliable is your hosting?",
    answer: "We offer 99.9% uptime guarantee on all our hosting plans. Our infrastructure is built on enterprise-grade hardware with redundant systems to ensure your website stays online."
  },
  {
    id: '2',
    question: "Do you offer refunds?",
    answer: "Yes, we offer a 30-day money-back guarantee on all our hosting plans. If you're not satisfied with our service, you can request a full refund within the first 30 days."
  },
  {
    id: '3',
    question: "Can I upgrade my plan later?",
    answer: "Absolutely! You can upgrade your hosting plan at any time. The price difference will be prorated for the remainder of your billing cycle."
  },
  {
    id: '4',
    question: "What control panel do you use?",
    answer: "We use cPanel, the industry-standard control panel that makes it easy to manage your hosting account, domains, email, and more."
  },
  {
    id: '5',
    question: "Do you offer WordPress hosting?",
    answer: "Yes, all our hosting plans are optimized for WordPress. We also offer one-click WordPress installation to help you get started quickly."
  }
];

const FAQEditor = () => {
  const [faqs, setFaqs] = useState<FAQ[]>(initialFaqs);
  const { toast } = useToast();

  const handleFaqChange = (id: string, field: keyof FAQ, value: string) => {
    setFaqs(faqs.map(faq => {
      if (faq.id === id) {
        return { ...faq, [field]: value };
      }
      return faq;
    }));
  };

  const addFaq = () => {
    const newFaq: FAQ = {
      id: Date.now().toString(),
      question: "New question?",
      answer: "Answer to the new question."
    };
    setFaqs([...faqs, newFaq]);
  };

  const removeFaq = (id: string) => {
    setFaqs(faqs.filter(faq => faq.id !== id));
  };

  const moveFaqUp = (index: number) => {
    if (index === 0) return;
    const newFaqs = [...faqs];
    [newFaqs[index], newFaqs[index - 1]] = [newFaqs[index - 1], newFaqs[index]];
    setFaqs(newFaqs);
  };

  const moveFaqDown = (index: number) => {
    if (index === faqs.length - 1) return;
    const newFaqs = [...faqs];
    [newFaqs[index], newFaqs[index + 1]] = [newFaqs[index + 1], newFaqs[index]];
    setFaqs(newFaqs);
  };

  const handleSave = () => {
    // In a real app, you would save this to a database
    // For now, we'll just show a toast message
    toast({
      title: "FAQs updated",
      description: "Your changes have been saved successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Frequently Asked Questions</h3>
        <Button onClick={addFaq} className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Add FAQ
        </Button>
      </div>

      {faqs.map((faq, index) => (
        <Card key={faq.id} className="mb-6">
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <CardTitle className="text-xl">FAQ #{index + 1}</CardTitle>
              <div className="flex space-x-1">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => moveFaqUp(index)}
                  disabled={index === 0}
                >
                  <MoveUp className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => moveFaqDown(index)}
                  disabled={index === faqs.length - 1}
                >
                  <MoveDown className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-500 hover:text-red-700 hover:bg-red-100"
                  onClick={() => removeFaq(faq.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor={`question-${faq.id}`}>Question</Label>
              <Input 
                id={`question-${faq.id}`} 
                value={faq.question} 
                onChange={(e) => handleFaqChange(faq.id, 'question', e.target.value)} 
              />
            </div>
            <div>
              <Label htmlFor={`answer-${faq.id}`}>Answer</Label>
              <Textarea 
                id={`answer-${faq.id}`} 
                value={faq.answer} 
                onChange={(e) => handleFaqChange(faq.id, 'answer', e.target.value)} 
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      <Button onClick={handleSave} className="w-full">Save Changes</Button>
    </div>
  );
};

export default FAQEditor;
