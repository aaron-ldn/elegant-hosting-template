
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const plans = [
  {
    name: "Starter",
    price: { monthly: 5.99, yearly: 4.99 },
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
    name: "Professional",
    price: { monthly: 12.99, yearly: 9.99 },
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
    name: "Business",
    price: { monthly: 24.99, yearly: 19.99 },
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

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <section id="pricing" className="py-20 bg-hosting-light-gray">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, Transparent <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Choose the perfect plan for your hosting needs. No hidden fees.
          </p>
          
          <div className="inline-flex items-center p-1 bg-white rounded-lg border border-gray-200">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-hosting-blue text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                billingCycle === 'yearly'
                  ? 'bg-hosting-blue text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Yearly <span className="text-xs font-normal ml-1 text-green-500">Save 20%</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:-translate-y-1 ${
                plan.popular ? 'border-2 border-hosting-blue relative' : ''
              }`}
            >
              {plan.popular && (
                <div className="bg-hosting-blue text-white text-xs font-semibold px-3 py-1 absolute top-4 right-4 rounded-full">
                  Most Popular
                </div>
              )}
              <div className="p-6 md:p-8">
                <h3 className="text-xl font-bold text-hosting-gray mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    ${billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly}
                  </span>
                  <span className="text-gray-500 ml-1">/mo</span>
                </div>
                <Button 
                  className={`w-full mb-6 ${
                    plan.popular
                      ? 'bg-hosting-blue hover:bg-hosting-dark-blue text-white'
                      : 'bg-white border-2 border-hosting-blue text-hosting-blue hover:bg-hosting-blue/5'
                  }`}
                >
                  {plan.cta}
                </Button>
                <div className="border-t border-gray-100 pt-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-hosting-teal mr-2 shrink-0 mt-0.5" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Need a custom plan? We've got you covered.</p>
          <Button variant="outline" className="border-hosting-blue text-hosting-blue hover:bg-hosting-blue/5">
            Contact Sales
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
