
import { CaseStudy } from '@/types/caseStudy';

const XANO_BASE_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:gCLQHaRm';

export class XanoService {
  private static async makeRequest<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${XANO_BASE_URL}${endpoint}`, {
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
