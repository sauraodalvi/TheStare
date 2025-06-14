
import { CaseStudy } from '@/types/caseStudy';

const XANO_API_KEY = 'eyJhbGciOiJBMjU2S1ciLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwiemlwIjoiREVGIn0.yxZo9lMUATor5Svv02s41NtKCHMRk_DanQD4bt5vmv1z4mwcl65fNYWiJKr-pG2J9o3n5iKmAKXXO7qj6_IXL9ISKe9Txo8O.MXNJ9XnY2Ylv5WV5FsX8Ww.TW3yRmHHFu0tPDfRXStcGTtWdQ1H7TERA4KcsO3viH5zKEFEvEVVqcuKAD5TDeY758LJjmIBEzt4ZfOw6kzeoiSnLrhMrThvhfdvy3sdVgTt_ynL3n2PSB-RG8r3NFc670TDKzT69XtGhUU46rvzB_vrbxpgoxfByJN-fLgS4qQ.kqEL7V6VTuvRsgEBwwm5upJJJvjWX-eXPqbWaJt99vw';

export class XanoService {
  private static async makeRequest<T>(endpoint: string): Promise<T> {
    const response = await fetch(`https://x8ki-letl-twmt.n7.xano.io/api:${XANO_API_KEY}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  static async getCaseStudies(): Promise<CaseStudy[]> {
    try {
      const data = await this.makeRequest<CaseStudy[]>('/case_studies');
      return data || [];
    } catch (error) {
      console.error('Error fetching case studies:', error);
      throw error;
    }
  }

  static async getCaseStudy(id: number): Promise<CaseStudy> {
    try {
      const data = await this.makeRequest<CaseStudy>(`/case_studies/${id}`);
      return data;
    } catch (error) {
      console.error('Error fetching case study:', error);
      throw error;
    }
  }
}
