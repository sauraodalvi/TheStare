
import { supabase } from '@/integrations/supabase/client';
import { CaseStudy } from '@/types/caseStudy';

export class SupabaseService {
  static async getCaseStudies(isAuthenticated = false): Promise<CaseStudy[]> {
    console.log('=== SupabaseService.getCaseStudies Debug ===');
    console.log('isAuthenticated parameter:', isAuthenticated);
    console.log('Fetching case studies from case_studies table...');
    
    try {
      let query = supabase
        .from('case_studies')
        .select('*')
        .eq('publish', true); // Only show published case studies
      
      console.log('Base query conditions: publish=true');
      
      // If user is not authenticated, only show free case studies  
      if (!isAuthenticated) {
        query = query.eq('free', true);
        console.log('User NOT authenticated: Adding free=true filter');
      } else {
        console.log('User IS authenticated: Showing all published case studies');
      }
      
      console.log('Final query:', query);
      
      const { data, error } = await query.order('likes', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Failed to fetch case studies: ${error.message}`);
      }

      console.log('Raw data from case_studies:', data?.length, 'records');
      console.log('Sample of first 3 records:', data?.slice(0, 3));

      if (!data || data.length === 0) {
        console.log('No data found in case_studies table');
        return [];
      }

      // Map the data to CaseStudy format with better data cleaning
      const mappedData: CaseStudy[] = data.map((item: any, index: number) => {
        console.log('Raw item logo data:', {
          google_drive_logo_thumbnail: item.google_drive_logo_thumbnail,
          logo: item.logo,
          name: item.name
        });
        
        // Generate a stable unique ID using name + company + index as fallback
        const uniqueString = item.name && item.company 
          ? `${item.name}-${item.company}`.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()
          : `case-study-${index}`;
        
        // Convert string to numeric ID (simple hash)
        const uniqueId = Math.abs(uniqueString.split('').reduce((a, b) => {
          a = ((a << 5) - a) + b.charCodeAt(0);
          return a & a;
        }, 0)) || index + 1;
        
        return {
          id: uniqueId,
          created_at: item.created_at || new Date().toISOString(),
          Name: item.name || 'Untitled Case Study',
          Title: item.name || 'Untitled Case Study',
          Company: item.company || 'Unknown Company',
          Organizer: item.organizer || 'Unknown Organizer',
          Objective: SupabaseService.cleanArrayField(item.objective),
          Creators_Tag: item.creators_tag || '',
          PDF: item.google_drive_pdf_path ? [item.google_drive_pdf_path] : (item.pdf ? [item.pdf] : []),
          Likes: item.likes !== null && item.likes !== undefined ? Number(item.likes) : 0,
          Logo: item.google_drive_logo_thumbnail ? [item.google_drive_logo_thumbnail] : (item.logo ? [item.logo] : []),
          Category: SupabaseService.cleanArrayField(item.category),
          Market: item.market || 'General Market',
          Sort: item.sort_order || item.sort_field || 0,
          Type: SupabaseService.cleanArrayField(item.type || item.type_field),
          Image_Tags_Extra: SupabaseService.cleanArrayField(item.image_tags_extra),
          Likes_Filter_Formula: item.likes_filter_formula || '',
          New_Image_Tags_Formula: '',
          Publish: item.publish !== false ? 'Yes' : 'No',
          New_Image_Tag: SupabaseService.cleanArrayField(item.new_image_tag),
          Likes_Filter: SupabaseService.cleanArrayField(item.likes_filter),
          SEO_Index: 0,
          SEO_Slug: '',
          SEO_Title: '',
          Free: item.free !== false ? 'Yes' : 'No'
        };
      });

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
