
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

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: Role;
  status: 'active' | 'inactive';
  lastActive?: string;
  createdAt: string;
}

export type Role = 'admin' | 'editor' | 'viewer';

export interface Permission {
  id: string;
  name: string;
  description: string;
  roles: Role[];
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  order: number;
  showInMenu: boolean;
}
