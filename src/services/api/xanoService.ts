import { supabase } from '@/lib/supabaseClient';

export class XanoService {
  private static readonly XANO_BASE_URL = 'https://x8ki-letl-twmt.n7.xano.io/api';

  private static async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.XANO_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to fetch from Xano API');
    }

    return response.json();
  }

  static async getCaseStudies(): Promise<any[]> {
    try {
      // Call our secure endpoint instead of directly to Xano
      const { data, error } = await supabase.functions.invoke('xano-proxy', {
        body: { endpoint: '/case_studies', method: 'GET' },
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching case studies:', error);
      return [];
    }
  }

  static async getCaseStudy(id: number): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('xano-proxy', {
        body: { endpoint: `/case_studies/${id}`, method: 'GET' },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching case study ${id}:`, error);
      throw error;
    }
  }
}
