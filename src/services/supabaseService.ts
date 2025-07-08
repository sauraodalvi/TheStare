
import { supabase } from '@/integrations/supabase/client';
import { CaseStudy } from '@/types/caseStudy';

export class SupabaseService {
  static async getCaseStudies(): Promise<CaseStudy[]> {
    console.log('Fetching case studies from airtable_data table...');
    
    try {
      // First, let's check what data exists without filters
      const { data: allData, error: allError } = await supabase
        .from('airtable_data')
        .select('*')
        .limit(5);

      console.log('Sample of all data in airtable_data:', allData);
      console.log('Sample publish values:', allData?.map(item => item.publish));

      // Now fetch the actual data - let's try different publish values
      const { data, error } = await supabase
        .from('airtable_data')
        .select('*')
        .or('publish.eq.Yes,publish.eq.yes,publish.eq.YES,publish.eq.true,publish.eq.True,publish.is.null');

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Failed to fetch case studies: ${error.message}`);
      }

      console.log('Filtered data from airtable_data:', data);

      if (!data || data.length === 0) {
        // If still no data, let's get some data without publish filter
        const { data: anyData, error: anyError } = await supabase
          .from('airtable_data')
          .select('*')
          .limit(10);

        if (anyError) {
          console.error('Error fetching any data:', anyError);
          return [];
        }

        console.log('Using any available data:', anyData);
        
        if (!anyData || anyData.length === 0) {
          console.log('No data found in airtable_data table at all');
          return [];
        }

        // Use any available data for now
        const mappedData: CaseStudy[] = anyData.map((item: any) => ({
          id: item.id,
          created_at: item.created_at || new Date().toISOString(),
          Name: item.name || 'Untitled Case Study',
          Title: item.name || 'Untitled Case Study',
          Company: item.company || 'Unknown Company',
          Organizer: item.organizer || 'Unknown Organizer',
          Objective: Array.isArray(item.objective) ? item.objective : 
                     typeof item.objective === 'string' ? [item.objective] : 
                     ['General Objective'],
          Creators_Tag: item.creators_tag || '',
          PDF: item.pdf ? [item.pdf] : [],
          Likes: item.likes || 0,
          Logo: item.logo ? [item.logo] : [],
          Category: Array.isArray(item.category) ? item.category : 
                    typeof item.category === 'string' ? [item.category] : 
                    ['General'],
          Market: item.market || 'General Market',
          Sort: item.sort_field || 0,
          Type: Array.isArray(item.type_field) ? item.type_field : 
                typeof item.type_field === 'string' ? [item.type_field] : 
                ['Case Study'],
          Image_Tags_Extra: Array.isArray(item.image_tags_extra) ? item.image_tags_extra : [],
          Likes_Filter_Formula: item.likes_filter_formula || '',
          New_Image_Tags_Formula: '',
          Publish: item.publish || 'Yes',
          New_Image_Tag: Array.isArray(item.new_image_tag) ? item.new_image_tag : [],
          Likes_Filter: Array.isArray(item.likes_filter) ? item.likes_filter : [],
          SEO_Index: 0,
          SEO_Slug: '',
          SEO_Title: '',
          Free: 'Yes'
        }));

        console.log('Mapped case studies (from any data):', mappedData);
        return mappedData;
      }

      // Map the filtered data to CaseStudy format
      const mappedData: CaseStudy[] = data.map((item: any) => ({
        id: item.id,
        created_at: item.created_at || new Date().toISOString(),
        Name: item.name || 'Untitled Case Study',
        Title: item.name || 'Untitled Case Study',
        Company: item.company || 'Unknown Company',
        Organizer: item.organizer || 'Unknown Organizer',
        Objective: Array.isArray(item.objective) ? item.objective : 
                   typeof item.objective === 'string' ? [item.objective] : 
                   ['General Objective'],
        Creators_Tag: item.creators_tag || '',
        PDF: item.pdf ? [item.pdf] : [],
        Likes: item.likes || 0,
        Logo: item.logo ? [item.logo] : [],
        Category: Array.isArray(item.category) ? item.category : 
                  typeof item.category === 'string' ? [item.category] : 
                  ['General'],
        Market: item.market || 'General Market',
        Sort: item.sort_field || 0,
        Type: Array.isArray(item.type_field) ? item.type_field : 
              typeof item.type_field === 'string' ? [item.type_field] : 
              ['Case Study'],
        Image_Tags_Extra: Array.isArray(item.image_tags_extra) ? item.image_tags_extra : [],
        Likes_Filter_Formula: item.likes_filter_formula || '',
        New_Image_Tags_Formula: '',
        Publish: item.publish || 'Yes',
        New_Image_Tag: Array.isArray(item.new_image_tag) ? item.new_image_tag : [],
        Likes_Filter: Array.isArray(item.likes_filter) ? item.likes_filter : [],
        SEO_Index: 0,
        SEO_Slug: '',
        SEO_Title: '',
        Free: 'Yes'
      }));

      console.log('Mapped case studies:', mappedData);
      return mappedData;
    } catch (error) {
      console.error('Error fetching case studies:', error);
      throw error;
    }
  }
}
