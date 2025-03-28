
import React, { useState } from 'react';
import { PricingPlan } from '@/data/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Plus } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

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

const PricingEditor = () => {
  const [plans, setPlans] = useState<PricingPlan[]>(initialPlans);
  const { toast } = useToast();

  const handlePlanChange = (id: string, field: keyof PricingPlan, value: any) => {
    setPlans(plans.map(plan => {
      if (plan.id === id) {
        return { ...plan, [field]: value };
      }
      return plan;
    }));
  };

  const handleFeatureChange = (planId: string, index: number, value: string) => {
    setPlans(plans.map(plan => {
      if (plan.id === planId) {
        const newFeatures = [...plan.features];
        newFeatures[index] = value;
        return { ...plan, features: newFeatures };
      }
      return plan;
    }));
  };

  const addFeature = (planId: string) => {
    setPlans(plans.map(plan => {
      if (plan.id === planId) {
        return { ...plan, features: [...plan.features, "New feature"] };
      }
      return plan;
    }));
  };

  const removeFeature = (planId: string, index: number) => {
    setPlans(plans.map(plan => {
      if (plan.id === planId) {
        const newFeatures = [...plan.features];
        newFeatures.splice(index, 1);
        return { ...plan, features: newFeatures };
      }
      return plan;
    }));
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
  };

  const removePlan = (id: string) => {
    setPlans(plans.filter(plan => plan.id !== id));
  };

  const handleSave = () => {
    // In a real app, you would save this to a database
    // For now, we'll just show a toast message
    toast({
      title: "Pricing plans updated",
      description: "Your changes have been saved successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Pricing Plans</h3>
        <Button onClick={addPlan} className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Add Plan
        </Button>
      </div>

      {plans.map((plan) => (
        <Card key={plan.id} className="mb-6">
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-500 hover:text-red-700 hover:bg-red-100"
                onClick={() => removePlan(plan.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`plan-name-${plan.id}`}>Plan Name</Label>
                <Input 
                  id={`plan-name-${plan.id}`} 
                  value={plan.name} 
                  onChange={(e) => handlePlanChange(plan.id, 'name', e.target.value)} 
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Switch 
                  checked={plan.popular} 
                  onCheckedChange={(checked) => handlePlanChange(plan.id, 'popular', checked)} 
                  id={`popular-${plan.id}`} 
                />
                <Label htmlFor={`popular-${plan.id}`}>Mark as Popular</Label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`monthly-price-${plan.id}`}>Monthly Price ($)</Label>
                <Input 
                  id={`monthly-price-${plan.id}`} 
                  type="number" 
                  step="0.01"
                  value={plan.monthlyPrice} 
                  onChange={(e) => handlePlanChange(plan.id, 'monthlyPrice', parseFloat(e.target.value))} 
                />
              </div>
              <div>
                <Label htmlFor={`yearly-price-${plan.id}`}>Yearly Price ($)</Label>
                <Input 
                  id={`yearly-price-${plan.id}`} 
                  type="number"
                  step="0.01" 
                  value={plan.yearlyPrice} 
                  onChange={(e) => handlePlanChange(plan.id, 'yearlyPrice', parseFloat(e.target.value))} 
                />
              </div>
            </div>

            <div>
              <Label htmlFor={`cta-${plan.id}`}>Call to Action Text</Label>
              <Input 
                id={`cta-${plan.id}`} 
                value={plan.cta} 
                onChange={(e) => handlePlanChange(plan.id, 'cta', e.target.value)} 
              />
            </div>

            <div>
              <Label className="block mb-2">Features</Label>
              {plan.features.map((feature, index) => (
                <div key={index} className="flex mb-2">
                  <Input 
                    value={feature} 
                    onChange={(e) => handleFeatureChange(plan.id, index, e.target.value)} 
                    className="flex-1 mr-2"
                  />
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeFeature(plan.id, index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => addFeature(plan.id)}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Feature
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button onClick={handleSave} className="w-full">Save Changes</Button>
    </div>
  );
};

export default PricingEditor;
