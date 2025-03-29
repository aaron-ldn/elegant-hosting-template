
import React, { useState } from 'react';
import { PricingPlan } from '@/data/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Plus, Copy, Grid3X3, ListFilter, ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

// Initial data - same as in the Pricing component
const initialPlans: PricingPlan[] = [
  {
    id: '1',
    name: "Starter",
    monthlyPrice: 5.99,
    yearlyPrice: 4.99,
    features: [
      "1 Website",
      "10GB SSD Storage",
      "Unmetered Bandwidth",
      "Free SSL Certificate",
      "1 Email Account",
      "24/7 Support"
    ],
    popular: false,
    cta: "Get Started"
  },
  {
    id: '2',
    name: "Professional",
    monthlyPrice: 12.99,
    yearlyPrice: 9.99,
    features: [
      "10 Websites",
      "50GB SSD Storage",
      "Unmetered Bandwidth",
      "Free SSL Certificates",
      "20 Email Accounts",
      "24/7 Priority Support",
      "Free Domain (1 year)",
      "Daily Backups"
    ],
    popular: true,
    cta: "Get Started"
  },
  {
    id: '3',
    name: "Business",
    monthlyPrice: 24.99,
    yearlyPrice: 19.99,
    features: [
      "Unlimited Websites",
      "100GB SSD Storage",
      "Unmetered Bandwidth",
      "Free SSL Certificates",
      "Unlimited Email Accounts",
      "24/7 Priority Support",
      "Free Domain (1 year)",
      "Daily Backups",
      "Advanced Security",
      "Staging Environment"
    ],
    popular: false,
    cta: "Get Started"
  }
];

// A component for individual plan editing
const PlanEditor = ({ 
  plan, 
  onUpdate, 
  onDelete, 
  onDuplicate 
}: { 
  plan: PricingPlan; 
  onUpdate: (updatedPlan: PricingPlan) => void; 
  onDelete: () => void;
  onDuplicate: () => void;
}) => {
  const handleChange = (field: keyof PricingPlan, value: any) => {
    onUpdate({ ...plan, [field]: value });
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...plan.features];
    newFeatures[index] = value;
    onUpdate({ ...plan, features: newFeatures });
  };

  const addFeature = () => {
    onUpdate({ ...plan, features: [...plan.features, "New feature"] });
  };

  const removeFeature = (index: number) => {
    const newFeatures = [...plan.features];
    newFeatures.splice(index, 1);
    onUpdate({ ...plan, features: newFeatures });
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle className="text-xl">{plan.name}</CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-blue-500 hover:text-blue-700 hover:bg-blue-100"
              onClick={onDuplicate}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-500 hover:text-red-700 hover:bg-red-100"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-grow overflow-y-auto">
        <div className="space-y-4">
          <div>
            <Label htmlFor={`plan-name-${plan.id}`}>Plan Name</Label>
            <Input 
              id={`plan-name-${plan.id}`} 
              value={plan.name} 
              onChange={(e) => handleChange('name', e.target.value)} 
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              checked={plan.popular} 
              onCheckedChange={(checked) => handleChange('popular', checked)} 
              id={`popular-${plan.id}`} 
            />
            <Label htmlFor={`popular-${plan.id}`}>Mark as Popular</Label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`monthly-price-${plan.id}`}>Monthly Price ($)</Label>
            <Input 
              id={`monthly-price-${plan.id}`} 
              type="number" 
              step="0.01"
              value={plan.monthlyPrice} 
              onChange={(e) => handleChange('monthlyPrice', parseFloat(e.target.value))} 
            />
          </div>
          <div>
            <Label htmlFor={`yearly-price-${plan.id}`}>Yearly Price ($)</Label>
            <Input 
              id={`yearly-price-${plan.id}`} 
              type="number"
              step="0.01" 
              value={plan.yearlyPrice} 
              onChange={(e) => handleChange('yearlyPrice', parseFloat(e.target.value))} 
            />
          </div>
        </div>

        <div>
          <Label htmlFor={`cta-${plan.id}`}>Call to Action Text</Label>
          <Input 
            id={`cta-${plan.id}`} 
            value={plan.cta} 
            onChange={(e) => handleChange('cta', e.target.value)} 
          />
        </div>

        <div>
          <Label className="block mb-2">Features</Label>
          {plan.features.map((feature, index) => (
            <div key={index} className="flex mb-2">
              <Input 
                value={feature} 
                onChange={(e) => handleFeatureChange(index, e.target.value)} 
                className="flex-1 mr-2"
              />
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => removeFeature(index)}
                className="text-red-500 hover:text-red-700 hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={addFeature}
            className="mt-2"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Feature
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const PricingEditor = () => {
  const [plans, setPlans] = useState<PricingPlan[]>(initialPlans);
  const [viewMode, setViewMode] = useState<'grid' | 'single'>('grid');
  const [currentPlanIndex, setCurrentPlanIndex] = useState(0);
  const { toast } = useToast();
  
  const ITEMS_PER_PAGE = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(plans.length / ITEMS_PER_PAGE);
  
  // Get current plans for grid view pagination
  const indexOfLastPlan = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstPlan = indexOfLastPlan - ITEMS_PER_PAGE;
  const currentPlans = plans.slice(indexOfFirstPlan, indexOfLastPlan);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handlePlanUpdate = (updatedPlan: PricingPlan) => {
    setPlans(plans.map(plan => plan.id === updatedPlan.id ? updatedPlan : plan));
  };

  const addPlan = () => {
    const newPlan: PricingPlan = {
      id: Date.now().toString(),
      name: "New Plan",
      monthlyPrice: 9.99,
      yearlyPrice: 7.99,
      features: ["Feature 1", "Feature 2", "Feature 3"],
      popular: false,
      cta: "Get Started"
    };
    setPlans([...plans, newPlan]);
    
    // Move to the last page if we're in grid view
    if (viewMode === 'grid') {
      const newTotalPages = Math.ceil((plans.length + 1) / ITEMS_PER_PAGE);
      setCurrentPage(newTotalPages);
    } else {
      // Move to the new plan if we're in single view
      setCurrentPlanIndex(plans.length);
    }
  };

  const duplicatePlan = (plan: PricingPlan) => {
    const newPlan = {
      ...plan,
      id: Date.now().toString(),
      name: `${plan.name} (Copy)`,
    };
    setPlans([...plans, newPlan]);
    
    // Move to the last page if we added a new plan
    if (viewMode === 'grid') {
      const newTotalPages = Math.ceil((plans.length + 1) / ITEMS_PER_PAGE);
      setCurrentPage(newTotalPages);
    }
  };

  const removePlan = (id: string) => {
    const newPlans = plans.filter(plan => plan.id !== id);
    setPlans(newPlans);
    
    // Adjust currentPlanIndex if we're in single view and the current plan was deleted
    if (viewMode === 'single') {
      if (newPlans.length === 0) {
        // No plans left
        setCurrentPlanIndex(0);
      } else if (currentPlanIndex >= newPlans.length) {
        // Current plan was the last one
        setCurrentPlanIndex(newPlans.length - 1);
      }
    }
    
    // Adjust current page if needed
    const newTotalPages = Math.ceil(newPlans.length / ITEMS_PER_PAGE);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  };

  const handleSave = () => {
    // In a real app, you would save this to a database
    toast({
      title: "Pricing plans updated",
      description: "Your changes have been saved successfully",
    });
  };

  const nextPlan = () => {
    if (currentPlanIndex < plans.length - 1) {
      setCurrentPlanIndex(currentPlanIndex + 1);
    }
  };

  const prevPlan = () => {
    if (currentPlanIndex > 0) {
      setCurrentPlanIndex(currentPlanIndex - 1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-medium">Pricing Plans</h3>
          <div className="bg-gray-100 rounded-md p-1 flex ml-4">
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setViewMode('grid')}
              className="px-2"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'single' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setViewMode('single')}
              className="px-2"
            >
              <ListFilter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button onClick={addPlan} className="flex items-center gap-1">
            <Plus className="h-4 w-4" /> Add Plan
          </Button>
          <Button onClick={handleSave} className="flex items-center gap-1">
            <Save className="h-4 w-4" /> Save All
          </Button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentPlans.map((plan) => (
              <PlanEditor
                key={plan.id}
                plan={plan}
                onUpdate={handlePlanUpdate}
                onDelete={() => removePlan(plan.id)}
                onDuplicate={() => duplicatePlan(plan)}
              />
            ))}
          </div>
          
          {totalPages > 1 && (
            <Pagination className="mt-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) paginate(currentPage - 1);
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i + 1}>
                    <PaginationLink 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        paginate(i + 1);
                      }}
                      isActive={currentPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) paginate(currentPage + 1);
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      ) : (
        <div className="space-y-4">
          {plans.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevPlan}
                  disabled={currentPlanIndex === 0}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <span className="text-sm">
                  Plan {currentPlanIndex + 1} of {plans.length}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextPlan}
                  disabled={currentPlanIndex === plans.length - 1}
                >
                  Next <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <PlanEditor
                plan={plans[currentPlanIndex]}
                onUpdate={handlePlanUpdate}
                onDelete={() => removePlan(plans[currentPlanIndex].id)}
                onDuplicate={() => duplicatePlan(plans[currentPlanIndex])}
              />
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No pricing plans found</p>
              <Button onClick={addPlan}>Add Your First Plan</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PricingEditor;
