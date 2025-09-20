import { supabase } from '@/integrations/supabase/client';

export const checkProfilesTable = async () => {
  try {
    // Get the table structure
    const { data: columns, error } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type')
      .eq('table_name', 'profiles')
      .eq('table_schema', 'public');

    if (error) {
      console.error('Error fetching table schema:', error);
      return null;
    }

    console.log('Profiles table columns:', columns);
    return columns;
  } catch (error) {
    console.error('Error in checkProfilesTable:', error);
    return null;
  }
};

// Call the function when this module is imported
checkProfilesTable().then(columns => {
  console.log('Profiles table columns:', columns);
});
