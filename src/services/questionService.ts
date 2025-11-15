import { supabase } from '@/lib/supabase';

export interface InterviewQuestion {
  id?: string | number;
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

// Table name in Supabase
const QUESTIONS_TABLE = 'questions';

/**
 * Fetches questions from Supabase with optional filtering
 * @throws {Error} If there's an error fetching from Supabase
 */
export const fetchQuestions = async (filters: QuestionFilters = {}): Promise<InterviewQuestion[]> => {
  try {
    console.log('Fetching questions from Supabase with filters:', filters);
    
    // Start building the query
    let query = supabase
      .from(QUESTIONS_TABLE)
      .select('*');

    // Apply filters if provided
    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    if (filters.company) {
      query = query.contains('company', [filters.company]);
    }

    if (filters.search) {
      query = query.ilike('question', `%${filters.search}%`);
    }

    // Execute the query
    const { data, error, status } = await query
      .order('created_at', { ascending: false });

    // Handle errors
    if (error) {
      console.error('Supabase query error:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      
      if (status === 404) {
        throw new Error(`The table '${QUESTIONS_TABLE}' does not exist in the database. Please create it in your Supabase dashboard.`);
      }
      
      throw new Error(`Failed to fetch questions: ${error.message}`);
    }

    console.log(`Successfully fetched ${data?.length || 0} questions`);
    return data || [];
  } catch (error) {
    console.error('Error in fetchQuestions:', error);
    // Re-throw the error to be handled by the component
    throw error;
  }
};

export const addQuestion = async (question: Omit<InterviewQuestion, 'id' | 'created_at'>) => {
  try {
    console.log('Adding new question:', { question });
    
    // Check for duplicate question (case-insensitive)
    const { data: existingQuestions, error: checkError } = await supabase
      .from(QUESTIONS_TABLE)
      .select('id, question')
      .ilike('question', question.question.trim());

    if (checkError) {
      console.error('Error checking for duplicate question:', checkError);
      throw new Error('Failed to check for existing questions');
    }

    if (existingQuestions && existingQuestions.length > 0) {
      throw new Error('This question already exists in the database.');
    }

    // Prepare the question data
    const questionData = {
      ...question,
      company: Array.isArray(question.company) 
        ? question.company.map(c => c.trim()).filter(Boolean) 
        : [],
      answer: question.answer || null,
      image: question.image || null
    };

    // Insert the new question with proper typing
    const { data, error: insertError } = await supabase
      .from<InterviewQuestion, typeof QUESTIONS_TABLE>(QUESTIONS_TABLE)
      .insert([questionData as any])
      .select()
      .single();

    if (insertError) {
      console.error('Error adding question:', {
        code: insertError.code,
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint
      });
      throw new Error(`Failed to add question: ${insertError.message}`);
    }

    console.log('Successfully added question:', data);
    return data;
  } catch (error) {
    console.error('Error in addQuestion:', error);
    throw error;
  }
};

// Helper function to safely update a question answer with retries
export const updateQuestionAnswer = async (id: string | number, answer: { text: string; model: string }) => {
  const maxRetries = 3;
  let lastError: Error | null = null;
  const questionId = id.toString();
  
  // Prepare the answer data with timestamp
  const answerData = {
    text: answer.text,
    generated_at: new Date().toISOString(),
    model: answer.model,
  };

  // Log the update attempt
  console.log('updateQuestionAnswer called:', { 
    id: questionId,
    answerLength: answer.text.length,
    model: answer.model,
    timestamp: new Date().toISOString()
  });

  // Try different update strategies
  const updateStrategies = [
    // Try with updated_at first
    async () => {
      const { data, error } = await supabase
        .from(QUESTIONS_TABLE)
        .update({ 
          answer: answerData,
          updated_at: new Date().toISOString()
        } as any) // Type assertion to handle strict typing
        .eq('id', questionId)
        .select()
        .single();
      return { data, error, strategy: 'with_updated_at' };
    },
    // Try without updated_at if first attempt fails
    async () => {
      const { data, error } = await supabase
        .from(QUESTIONS_TABLE)
        .update({ answer: answerData } as any)
        .eq('id', questionId)
        .select()
        .single();
      return { data, error, strategy: 'without_updated_at' };
    },
    // Try with raw answer object if previous attempts fail
    async () => {
      const { data, error } = await supabase
        .from(QUESTIONS_TABLE)
        .update({ answer: JSON.stringify(answerData) } as any)
        .eq('id', questionId)
        .select()
        .single();
      return { data, error, strategy: 'with_stringified_answer' };
    }
  ];

  // Try each strategy with retries
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    for (const strategy of updateStrategies) {
      try {
        console.log(`Attempt ${attempt + 1}: Trying update strategy...`);
        const result = await strategy();
        const { data, error, strategy: usedStrategy } = result;
        
        if (!error && data) {
          console.log(`Successfully updated answer using strategy: ${usedStrategy}`, {
            id: questionId,
            answerLength: answer.text.length,
            timestamp: new Date().toISOString()
          });
          return data;
        }
        
        lastError = error || new Error('Unknown error during update');
        console.warn(`Update attempt ${attempt + 1} failed with strategy ${usedStrategy}:`, error);
      } catch (error) {
        lastError = error as Error;
        console.error(`Error in update attempt ${attempt + 1}:`, error);
      }
      
      // Add a small delay between retries
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
      }
    }
  }
  
  // If we get here, all attempts failed
  const errorMessage = lastError?.message || 'Unknown error during update';
  const errorDetails = {
    id: questionId,
    error: errorMessage,
    timestamp: new Date().toISOString(),
    answerLength: answer.text.length
  };
  
  console.error('All update attempts failed:', errorDetails);
  throw new Error(`Failed to update answer after ${maxRetries} attempts: ${errorMessage}`);
};

/**
 * Fetches unique companies from the database
 * @returns Array of unique company names
 */
export const getUniqueCompanies = async (): Promise<string[]> => {
  try {
    console.log('Fetching unique companies from database');
    
    // Fetch all questions to extract companies
    const { data: questions, error } = await supabase
      .from(QUESTIONS_TABLE)
      .select('company');

    if (error) {
      console.error('Error fetching companies:', {
        code: error.code,
        message: error.message
      });
      throw new Error('Failed to fetch companies');
    }

    // Extract and dedupe companies
    const companies = new Set<string>();
    questions?.forEach(question => {
      if (Array.isArray(question.company)) {
        question.company.forEach(company => {
          if (company && typeof company === 'string') {
            companies.add(company.trim());
          }
        });
      }
    });

    return Array.from(companies).sort();
  } catch (error) {
    console.error('Error in getUniqueCompanies:', error);
    // Return empty array if there's an error
    return [];
  }
};
