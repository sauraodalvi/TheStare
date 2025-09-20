
import { supabase } from '@/integrations/supabase/client';
import { CaseStudy } from '@/types/caseStudy';
import { allCaseStudiesData, validateCaseStudiesData } from '@/data/caseStudiesData';

export class SupabaseService {
  // Robust validation for publish status across different data types
  static isPublished(publishValue: boolean | number | string | null | undefined): boolean {
    if (publishValue === null || publishValue === undefined) return false;

    // Handle boolean values
    if (typeof publishValue === 'boolean') return publishValue;

    // Handle number values
    if (typeof publishValue === 'number') return publishValue === 1;

    // Handle string values
    if (typeof publishValue === 'string') {
      const normalized = publishValue.toLowerCase().trim();
      return normalized === 'yes' || normalized === 'true' || normalized === '1';
    }

    return false;
  }

  // Robust validation for free status
  static isFree(freeValue: boolean | number | string | null | undefined): boolean {
    if (freeValue === null || freeValue === undefined) return false;

    // Handle boolean values
    if (typeof freeValue === 'boolean') return freeValue;

    // Handle number values
    if (typeof freeValue === 'number') return freeValue === 1;

    // Handle string values
    if (typeof freeValue === 'string') {
      const normalized = freeValue.toLowerCase().trim();
      return normalized === 'yes' || normalized === 'true' || normalized === '1';
    }

    return false;
  }

  // Convert Google Drive URLs to direct image URLs
  static convertGoogleDriveImageUrl(url: string): string {
    if (url.includes('drive.google.com/file/d/')) {
      const fileId = url.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
      if (fileId) {
        // Convert to direct image URL that can be displayed in img tags
        const convertedUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
        console.log(`Converting Google Drive image URL: ${url} -> ${convertedUrl}`);
        return convertedUrl;
      }
    }
    return url;
  }

  // Convert Google Drive URLs to iframe-compatible PDF URLs
  static convertGoogleDrivePdfUrl(url: string): string {
    console.log(`🔄 Converting Google Drive PDF URL: ${url}`);

    if (!url || typeof url !== 'string') {
      console.warn('⚠️ Invalid PDF URL provided:', url);
      return url;
    }

    if (url.includes('drive.google.com/file/d/')) {
      const fileId = url.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
      if (fileId) {
        // Convert to iframe-compatible PDF URL using /preview format
        const convertedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
        console.log(`✅ PDF URL converted successfully: ${url} -> ${convertedUrl}`);
        return convertedUrl;
      } else {
        console.warn('⚠️ Could not extract file ID from Google Drive URL:', url);
      }
    } else if (url.includes('drive.google.com')) {
      console.warn('⚠️ Google Drive URL format not supported for PDF conversion:', url);
    } else {
      console.log('ℹ️ Non-Google Drive URL, returning unchanged:', url);
    }

    return url;
  }

  // Fallback method using Google Docs Viewer for PDF embedding
  static convertToGoogleDocsViewer(url: string): string {
    console.log(`🔄 Converting to Google Docs Viewer: ${url}`);

    if (!url || typeof url !== 'string') {
      console.warn('⚠️ Invalid URL provided for Google Docs Viewer:', url);
      return url;
    }

    // Encode the URL for use in Google Docs Viewer
    const encodedUrl = encodeURIComponent(url);
    const viewerUrl = `https://docs.google.com/viewer?url=${encodedUrl}&embedded=true`;

    console.log(`✅ Google Docs Viewer URL created: ${url} -> ${viewerUrl}`);
    return viewerUrl;
  }

  // Priority-based thumbnail selection with fallbacks
  static getThumbnailUrl(item: any, company: string): string[] {
    console.log(`🔄 Processing thumbnails for ${company}:`);
    const thumbnails: string[] = [];

    // Priority 1: google_drive_logo_thumbnail (convert if needed)
    if (item.google_drive_logo_thumbnail) {
      console.log(`  Found google_drive_logo_thumbnail:`, item.google_drive_logo_thumbnail);
      const converted = SupabaseService.convertGoogleDriveImageUrl(item.google_drive_logo_thumbnail);
      thumbnails.push(converted);
      console.log(`  Added converted thumbnail:`, converted);
    }

    // Priority 2: google_drive_logo_path (convert if needed)
    if (item.google_drive_logo_path) {
      console.log(`  Found google_drive_logo_path:`, item.google_drive_logo_path);
      const converted = SupabaseService.convertGoogleDriveImageUrl(item.google_drive_logo_path);
      thumbnails.push(converted);
      console.log(`  Added converted logo:`, converted);
    }

    // Priority 3: logo field (if it's an array, use first item)
    if (item.logo) {
      if (Array.isArray(item.logo)) {
        thumbnails.push(...item.logo.filter(Boolean));
      } else if (typeof item.logo === 'string') {
        thumbnails.push(item.logo);
      }
    }

    // Priority 4: Company-specific placeholder (you can expand this)
    const companyPlaceholders: Record<string, string> = {
      'Google': 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=500&auto=format&fit=crop',
      'Microsoft': 'https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=500&auto=format&fit=crop',
      'Amazon': 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=500&auto=format&fit=crop',
      'Apple': 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500&auto=format&fit=crop',
      'Netflix': 'https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=500&auto=format&fit=crop'
    };

    if (companyPlaceholders[company]) {
      thumbnails.push(companyPlaceholders[company]);
    }

    // Priority 5: Generic case study placeholder
    thumbnails.push('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&auto=format&fit=crop');

    console.log(`  Final thumbnail array for ${company}:`, thumbnails);
    return thumbnails;
  }

  // Priority-based PDF selection with fallbacks
  static getPdfUrls(item: any): string[] {
    console.log(`🔄 Processing PDFs for ${item.company || 'Unknown'}:`);
    const pdfs: string[] = [];

    // Priority 1: google_drive_pdf_path
    if (item.google_drive_pdf_path) {
      console.log(`  Found google_drive_pdf_path:`, item.google_drive_pdf_path);
      pdfs.push(item.google_drive_pdf_path);
      console.log(`  Added PDF:`, item.google_drive_pdf_path);
    }

    // Priority 2: pdf field (if it's an array, use all items)
    if (item.pdf) {
      if (Array.isArray(item.pdf)) {
        pdfs.push(...item.pdf.filter(Boolean));
      } else if (typeof item.pdf === 'string') {
        pdfs.push(item.pdf);
      }
    }

    // Priority 3: airtable_pdf_path (legacy field)
    if (item.airtable_pdf_path) {
      pdfs.push(item.airtable_pdf_path);
    }

    console.log(`  Final PDF array for ${item.company || 'Unknown'}:`, pdfs);
    return pdfs;
  }
  static async getCaseStudies(isAuthenticated = false, subscriptionType: 'free' | 'paid' = 'free', page = 1, limit = 30): Promise<{ data: CaseStudy[], totalCount: number, hasMore: boolean }> {
    console.log('=== SupabaseService.getCaseStudies Debug ===');
    console.log('isAuthenticated parameter:', isAuthenticated);
    console.log('subscriptionType parameter:', subscriptionType);
    console.log('page parameter:', page);
    console.log('limit parameter:', limit);
    console.log('Fetching case studies from case_studies table...');

    // Validate static data first (only on first page)
    if (page === 1) {
      validateCaseStudiesData();
    }
    
    try {
      // Start with base query for published case studies
      let query = supabase
        .from('case_studies')
        .select('*')
        .eq('publish', true);
      
      console.log('Base query conditions: publish=true');
      
      // Log access details
      console.log('=== CASE STUDY ACCESS ===');
      console.log('Is authenticated:', isAuthenticated);
      console.log('Subscription type:', subscriptionType);
      
      // Apply filters based on authentication and subscription
      if (isAuthenticated && subscriptionType === 'paid') {
        // Paid users see all published case studies (no additional filters needed)
        console.log('Paid user: Showing all published case studies');
      } else {
        // Unauthenticated users and free users only see free published case studies
        // Prefer plan = 0 if available; if the column doesn't exist, the query will error and fallback will kick in.
        // Cast to any because generated Supabase types may not yet include the new 'plan' column
        query = (query as any).eq('plan', 0);
        const userType = isAuthenticated ? 'Free user' : 'Unauthenticated user';
        console.log(`${userType}: Showing only free published case studies (plan = 0)`);
      }
      
      console.log('Final query:', query);
      
      // Calculate pagination offset
      const offset = (page - 1) * limit;

      // First, get the total count with the same filters as the main query
      let countQuery = supabase
        .from('case_studies')
        .select('*', { count: 'exact', head: true })
        .eq('publish', true);
      
      // Apply the same free/plan filter if needed
      if (!isAuthenticated || subscriptionType !== 'paid') {
        console.log('Applying plan=0 filter to count query');
        // Cast to any for the same reason as above
        countQuery = (countQuery as any).eq('plan', 0);
      } else {
        console.log('No plan filter applied to count query (paid user)');
      }
      
      const { count, error: countError } = await countQuery;
      const totalCount = count || 0;
      
      console.log('Total count with filters:', totalCount);
      
      if (countError) {
        console.error('Error getting count:', countError);
        throw new Error(`Failed to get case studies count: ${countError.message}`);
      }
      
      // Then fetch the paginated data
      const { data, error } = await query
        .select()
        .order('sort_order', { ascending: true }) // Primary sort by sort_order
        .order('likes', { ascending: false }) // Secondary sort by likes
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Failed to fetch case studies: ${error.message}`);
      }

      // Log sample data after fetching
      if (data && data.length > 0) {
        console.log('Sample case studies being shown:');
        data.slice(0, 3).forEach((item, index) => {
          console.log(`  ${index + 1}. ${item.name} (Free: ${item.free}, Publish: ${item.publish})`);
        });
      }

      console.log('=== SUPABASE DATA LOADING ===');
      console.log('Page:', page, 'Limit:', limit, 'Offset:', offset);
      console.log('Fetched items:', data?.length, 'records');
      console.log('Total count in database:', totalCount);
      console.log('Authentication status:', isAuthenticated);
      console.log('Subscription type:', subscriptionType);
      console.log('Sample of first 3 records:', data?.slice(0, 3).map(item => ({
        name: item.name,
        company: item.company,
        sort_order: item.sort_order,
        publish: item.publish,
        free: item.free,
        google_drive_logo_path: item.google_drive_logo_path,
        google_drive_pdf_path: item.google_drive_pdf_path
      })));

      // Count published vs unpublished in current page
      const publishedCount = data?.filter(item => SupabaseService.isPublished(item.publish)).length || 0;
      const freeCount = data?.filter(item => SupabaseService.isFree(item.free)).length || 0;
      console.log('Supabase published count (current page):', publishedCount);
      console.log('Supabase free count (current page):', freeCount);

      if (!data || data.length === 0) {
        console.log('No data found in case_studies table from Supabase. Falling back to static dataset.');
        // Fallback to static data when Supabase returns empty (e.g., RLS blocking)
        let staticData = allCaseStudiesData.filter(cs => SupabaseService.isPublished(cs.Publish));
        if (!isAuthenticated || subscriptionType !== 'paid') {
          staticData = staticData.filter(cs => SupabaseService.isFree(cs.Free));
        }
        staticData.sort((a, b) => (a.Sort || 0) - (b.Sort || 0));
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedData = staticData.slice(startIndex, endIndex);
        const totalCount = staticData.length;
        const hasMore = endIndex < totalCount;
        console.log('[Fallback-zero] total:', totalCount, 'page-size:', paginatedData.length, 'hasMore:', hasMore);
        return {
          data: paginatedData,
          totalCount,
          hasMore
        };
      }

      // Map the data to CaseStudy format with better data cleaning
      // First, create a map to ensure we don't have duplicate case studies by ID
      const uniqueDataMap = new Map<string, any>();
      
      data.forEach((item) => {
        // Create a unique key using name and company since id might not exist
        const key = item.name && item.company 
          ? `${item.name}-${item.company}`.toLowerCase()
          : `item-${Math.random().toString(36).substr(2, 9)}`; // Fallback random key
        
        if (!uniqueDataMap.has(key)) {
          uniqueDataMap.set(key, item);
        } else {
          console.log(`Found duplicate case study: ${key}`);
        }
      });
      
      // Convert map values back to array and sort by sort_order
      const uniqueData = Array.from(uniqueDataMap.values())
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
      
      console.log(`Deduplicated ${data.length - uniqueData.length} duplicate case studies`);
      
      // Calculate if there are more items to load after deduplication
      const hasMoreItems = offset + uniqueData.length < totalCount;
      console.log('Has more items after deduplication:', hasMoreItems);
      
      const mappedData: CaseStudy[] = uniqueData.map((item: any, index: number) => {
        console.log('Raw item logo data:', {
          google_drive_logo_path: item.google_drive_logo_path,
          logo: item.logo,
          name: item.name
        });
        
        // Generate a stable unique ID using name + company
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
          PDF: SupabaseService.getPdfUrls(item),
          Likes: item.likes !== null && item.likes !== undefined ? Number(item.likes) : 0,
          Logo: SupabaseService.getThumbnailUrl(item, item.company || 'Unknown'),
          Category: SupabaseService.cleanArrayField(item.category),
          Market: item.market || 'General Market',
          Sort: item.sort_order || 0,
          Type: SupabaseService.cleanArrayField(item.type || item.type_field),
          Image_Tags_Extra: SupabaseService.cleanArrayField(item.image_tags_extra),
          Likes_Filter_Formula: item.likes_filter_formula || '',
          New_Image_Tags_Formula: '',
          Publish: item.publish,
          New_Image_Tag: SupabaseService.cleanArrayField(item.new_image_tag),
          Likes_Filter: SupabaseService.cleanArrayField(item.likes_filter),
          SEO_Index: 0,
          SEO_Slug: '',
          SEO_Title: '',
          Free: item.free,
          // Add Supabase specific fields
          google_drive_logo_path: item.google_drive_logo_path,
          google_drive_pdf_path: item.google_drive_pdf_path
        };
      });

      console.log('Mapped case studies count:', mappedData.length);
      console.log('Authentication status for final return:', isAuthenticated);
      console.log('First few mapped case studies with Supabase fields:', mappedData.slice(0, 3).map(cs => ({
        id: cs.id,
        name: cs.Name,
        company: cs.Company,
        publish: cs.Publish,
        free: cs.Free,
        google_drive_logo_path: cs.google_drive_logo_path,
        google_drive_pdf_path: cs.google_drive_pdf_path,
        Logo: cs.Logo,
        PDF: cs.PDF
      })));

      // PRIORITIZE SUPABASE DATA - Only use static data as fallback when Supabase has no data
      console.log('=== PRIORITIZING SUPABASE DATA ===');
      console.log('Supabase data count:', mappedData.length);
      console.log('Supabase total count:', totalCount || 0);

      let finalData: CaseStudy[];
      let finalTotalCount: number;
      let finalHasMore: boolean;

      if (mappedData.length > 0) {
        // Use Supabase data exclusively when available
        console.log('Using Supabase data exclusively (no static data mixing)');
        const finalData = mappedData;
        const finalTotalCount = totalCount || mappedData.length;

        // Calculate if there are more pages
        const hasMore = (offset + limit) < finalTotalCount;

        console.log('=== RETURNING DATA ===');
        console.log('Data length:', finalData.length);
        console.log('Total count:', finalTotalCount);
        console.log('Has more pages:', hasMore);
        
        // Log sample data for debugging
        if (finalData.length > 0) {
          console.log('Sample data:', finalData.slice(0, 3).map(cs => ({
            id: cs.id,
            name: cs.Name,
            company: cs.Company,
            google_drive_logo_path: cs.google_drive_logo_path,
            google_drive_pdf_path: cs.google_drive_pdf_path
          })));
        }

        return {
          data: finalData,
          totalCount: finalTotalCount,
          hasMore
        };
      }
    } catch (error) {
      console.error('Error fetching case studies from Supabase:', error);

      // Handle specific error types to prevent unhandled promise rejections
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }

      console.log('=== FALLBACK TO STATIC DATA ===');

      // Fallback to static data when Supabase fails - implement client-side pagination for static data
      let staticData = allCaseStudiesData.filter(cs => SupabaseService.isPublished(cs.Publish));
      
      // Filter by free status if user is not a paid subscriber
      if (!isAuthenticated || subscriptionType !== 'paid') {
        staticData = staticData.filter(cs => SupabaseService.isFree(cs.Free));
      }

      // Sort static data by Sort field (equivalent to sort_order)
      staticData.sort((a, b) => (a.Sort || 0) - (b.Sort || 0));

      // Apply client-side pagination to static data
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = staticData.slice(startIndex, endIndex);
      const totalCount = staticData.length;
      const hasMore = endIndex < totalCount;

      console.log('Fallback static data total:', totalCount);
      console.log('Fallback page data:', paginatedData.length);
      console.log('Fallback has more:', hasMore);
      console.log('=== END FALLBACK ===');

      return {
        data: paginatedData,
        totalCount,
        hasMore
      };
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
