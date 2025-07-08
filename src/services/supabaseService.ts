
import { supabase } from '@/integrations/supabase/client';
import { CaseStudy } from '@/types/caseStudy';

export class SupabaseService {
  static async getCaseStudies(): Promise<CaseStudy[]> {
    console.log('Fetching case studies from airtable_data table...');
    
    try {
      const { data, error } = await supabase
        .from('airtable_data')
        .select('*')
        .eq('publish', 'Yes'); // Only get published case studies

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Failed to fetch case studies: ${error.message}`);
      }

      console.log('Raw data from airtable_data:', data);

      if (!data || data.length === 0) {
        console.log('No case studies found in airtable_data table');
        return [];
      }

      // Map the airtable_data to CaseStudy format
      const mappedData: CaseStudy[] = data.map((item: any) => ({
        id: item.id,
        created_at: item.created_at,
        Name: item.name || '',
        Title: item.name || '', // Use name as title if title doesn't exist
        Company: item.company || '',
        Organizer: item.organizer || '',
        Objective: Array.isArray(item.objective) ? item.objective : [],
        Creators_Tag: item.creators_tag || '',
        PDF: item.pdf ? [item.pdf] : [],
        Likes: item.likes || 0,
        Logo: item.logo ? [item.logo] : [],
        Category: Array.isArray(item.category) ? item.category : [],
        Market: item.market || '',
        Sort: item.sort_field || 0,
        Type: Array.isArray(item.type_field) ? item.type_field : [],
        Image_Tags_Extra: Array.isArray(item.image_tags_extra) ? item.image_tags_extra : [],
        Likes_Filter_Formula: item.likes_filter_formula || '',
        New_Image_Tags_Formula: '',
        Publish: item.publish || '',
        New_Image_Tag: Array.isArray(item.new_image_tag) ? item.new_image_tag : [],
        Likes_Filter: Array.isArray(item.likes_filter) ? item.likes_filter : [],
        SEO_Index: 0,
        SEO_Slug: '',
        SEO_Title: '',
        Free: 'Yes' // Default to free
      }));

      console.log('Mapped case studies:', mappedData);
      return mappedData;
    } catch (error) {
      console.error('Error fetching case studies:', error);
      throw error;
    }
  }
}
