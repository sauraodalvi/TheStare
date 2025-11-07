import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rnpxnaqfoqdivxrlozfr.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key-here';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface InterviewQuestion {
  id?: number;
  created_at?: string;
  category: string;
  company: string[];
  question: string;
  answer: {
    text: string;
    generated_at: string;
    model: string;
  } | null;
  image: string | null;
}

export interface QuestionFilters {
  category?: string;
  company?: string;
  search?: string;
}
