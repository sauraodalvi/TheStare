
export interface CaseStudy {
  id: string;
  title: string;
  isNew: boolean;
  likes: number;
  category: string;
  company: string;
  creator?: string;
  market: 'B2C' | 'B2B' | 'B2C & B2B';
  objective: CaseStudyObjective[];
  description: string;
  image: string;
}

export type CaseStudyObjective = 
  | 'Acquisition'
  | 'Activation'
  | 'Adoption'
  | 'Conversion'
  | 'Engagement'
  | 'First Time Experience'
  | 'Gamification'
  | 'Growth'
  | 'GTM'
  | 'Monetization'
  | 'MVP'
  | 'Notification'
  | 'Onboarding'
  | 'Personalization';

export interface CaseStudiesFilters {
  categories: string[];
  companies: string[];
  markets: ('B2C' | 'B2B' | 'B2C & B2B')[];
  likesRange: 'All' | 'More than 100' | 'Between 50 to 100' | 'Less than 50';
  objectives: CaseStudyObjective[];
  searchQuery: string;
}
