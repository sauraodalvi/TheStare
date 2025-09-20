
export interface CaseStudy {
  id: number;
  created_at: string;
  Name: string;
  Company: string;
  Organizer: string;
  Objective: string[];
  Creators_Tag: string;
  PDF: string[];
  Likes: number;
  Logo: string[];
  Category: string[];
  Market: string;
  Sort: number;
  Type: string[];
  Image_Tags_Extra: string[];
  Likes_Filter_Formula: string;
  New_Image_Tags_Formula: string;
  Publish: boolean | number | string | null;
  New_Image_Tag: string[];
  Likes_Filter: string[];
  SEO_Index: number;
  SEO_Slug: string;
  SEO_Title: string;
  Title: string;
  Free: boolean | number | string | null;
  // Supabase specific fields
  google_drive_logo_path?: string | null;
  google_drive_logo_thumbnail?: string | null;
  google_drive_pdf_path?: string | null;
}

export type CaseStudyObjective = string;

export interface CaseStudiesFilters {
  categories: string[];
  companies: string[];
  markets: string[];
  likesRange: 'All' | 'More than 100' | 'Between 50 to 100' | 'Less than 50';
  objectives: string[];
  searchQuery: string;
}
