
export interface PricingPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  popular: boolean;
  cta: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}
