
import { supabase } from '@/integrations/supabase/client';
import { CaseStudy } from '@/types/caseStudy';

export class SupabaseService {
  static async getCaseStudies(): Promise<CaseStudy[]> {
    console.log('Fetching case studies from airtable_data table...');
    
    try {
      const { data, error } = await supabase
        .from('airtable_data')
        .select('*')
        .order('likes', { ascending: false }); // Default sort by likes

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Failed to fetch case studies: ${error.message}`);
      }

      console.log('Raw data from airtable_data:', data);

      if (!data || data.length === 0) {
        console.log('No data found in airtable_data table');
        return [];
      }

      // Map the data to CaseStudy format with better data cleaning
      const mappedData: CaseStudy[] = data.map((item: any) => ({
        id: item.id,
        created_at: item.created_at || new Date().toISOString(),
        Name: item.name || 'Untitled Case Study',
        Title: item.name || 'Untitled Case Study',
        Company: item.company || 'Unknown Company',
        Organizer: item.organizer || 'Unknown Organizer',
        Objective: SupabaseService.cleanArrayField(item.objective),
        Creators_Tag: item.creators_tag || '',
        PDF: item.pdf ? [item.pdf] : [],
        Likes: typeof item.likes === 'number' ? item.likes : 0,
        Logo: item.logo_url ? [item.logo_url] : (item.logo ? [item.logo] : []),
        Category: SupabaseService.cleanArrayField(item.category),
        Market: item.market || 'General Market',
        Sort: item.sort_field || 0,
        Type: SupabaseService.cleanArrayField(item.type_field),
        Image_Tags_Extra: SupabaseService.cleanArrayField(item.image_tags_extra),
        Likes_Filter_Formula: item.likes_filter_formula || '',
        New_Image_Tags_Formula: '',
        Publish: item.publish || 'Yes',
        New_Image_Tag: SupabaseService.cleanArrayField(item.new_image_tag),
        Likes_Filter: SupabaseService.cleanArrayField(item.likes_filter),
        SEO_Index: 0,
        SEO_Slug: '',
        SEO_Title: '',
        Free: item.Free !== false ? 'Yes' : 'No' // Default to free unless explicitly set to false
      }));

      console.log('Mapped case studies:', mappedData);
      return mappedData;
    } catch (error) {
      console.error('Error fetching case studies:', error);
      throw error;
    }
  }

  // Helper method to clean array fields and remove unwanted values
  private static cleanArrayField(field: any): string[] {
    if (!field) return [];
    
    let arrayField: string[] = [];
    
    if (Array.isArray(field)) {
      arrayField = field;
    } else if (typeof field === 'string') {
      // Handle JSON strings or comma-separated strings
      try {
        const parsed = JSON.parse(field);
        arrayField = Array.isArray(parsed) ? parsed : [field];
      } catch {
        arrayField = field.includes(',') ? field.split(',') : [field];
      }
    } else {
      arrayField = [String(field)];
    }

    // Clean and filter the array
    return arrayField
      .map(item => String(item).trim())
      .filter(item => item && item !== 'All' && item !== 'null' && item !== 'undefined')
      .slice(0, 5); // Limit to 5 items max
  }
}
