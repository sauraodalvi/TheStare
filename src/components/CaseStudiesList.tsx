
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { CaseStudy } from '@/types/caseStudy';
import { toast } from 'sonner';
import { SupabaseService } from '@/services/supabaseService';
import { usePagination } from '@/hooks/usePagination';
import CaseStudyCard from './CaseStudyCard';
import CaseStudyModal from './CaseStudyModal';
import CaseStudySubmissionModal from './CaseStudySubmissionModal';
import CaseStudyFilterChips from './CaseStudyFilterChips';
import CaseStudyHeader from './CaseStudyHeader';
import { SortOption } from './CaseStudySorting';

const CaseStudiesList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>([]);
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([]);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudy | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('most-liked');
  const hasShownError = useRef(false);

  const { data: caseStudies = [], isLoading, error, refetch } = useQuery({
    queryKey: ['caseStudies'],
    queryFn: SupabaseService.getCaseStudies,
    retry: 1,
  });

  console.log('Case studies data:', caseStudies);
  console.log('Loading state:', isLoading);
  console.log('Error state:', error);

  const categories = [...new Set(caseStudies.flatMap(cs => cs.Category || []).filter(cat => cat && cat !== 'All'))];
  const companies = [...new Set(caseStudies.map(cs => cs.Company).filter(Boolean))];
  const markets = [...new Set(caseStudies.map(cs => cs.Market).filter(Boolean))];
  const objectives = [...new Set(caseStudies.flatMap(cs => cs.Objective || []).filter(obj => obj && obj.trim() !== ''))];

  useEffect(() => {
    if (error && !hasShownError.current) {
      hasShownError.current = true;
      console.log('API Error details:', error);
      toast.error('Failed to load case studies', {
        description: 'There was an error loading case studies from the database.'
      });
    }
  }, [error]);

  const filteredAndSortedCaseStudies = useMemo(() => {
    let filtered = [...caseStudies];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(cs =>
        cs.Title?.toLowerCase().includes(query) ||
        cs.Name?.toLowerCase().includes(query) ||
        cs.Company?.toLowerCase().includes(query) ||
        cs.Organizer?.toLowerCase().includes(query)
      );
    }

    // Apply other filters
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(cs =>
        cs.Category?.some(cat => selectedCategories.includes(cat))
      );
    }

    if (selectedCompanies.length > 0) {
      filtered = filtered.filter(cs =>
        selectedCompanies.includes(cs.Company)
      );
    }

    if (selectedMarkets.length > 0) {
      filtered = filtered.filter(cs =>
        selectedMarkets.includes(cs.Market)
      );
    }

    if (selectedObjectives.length > 0) {
      filtered = filtered.filter(cs =>
        cs.Objective?.some(objective => selectedObjectives.includes(objective))
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'most-liked':
        filtered.sort((a, b) => (b.Likes || 0) - (a.Likes || 0));
        break;
      case 'most-recent':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'a-z':
        filtered.sort((a, b) => (a.Title || a.Name || '').localeCompare(b.Title || b.Name || ''));
        break;
      case 'z-a':
        filtered.sort((a, b) => (b.Title || b.Name || '').localeCompare(a.Title || a.Name || ''));
        break;
      default:
        break;
    }

    return filtered;
  }, [caseStudies, searchQuery, selectedCategories, selectedCompanies, selectedMarkets, selectedObjectives, sortBy]);

  const {
    paginatedData,
    hasMore,
    loadMore,
    reset,
    totalItems,
    isLoadingMore
  } = usePagination({
    data: filteredAndSortedCaseStudies,
    itemsPerPage: 30
  });

  // Reset pagination when filters change
  useEffect(() => {
    reset();
  }, [searchQuery, selectedCategories, selectedCompanies, selectedMarkets, selectedObjectives, sortBy, reset]);

  const handleCaseStudyClick = (caseStudy: CaseStudy) => {
    setSelectedCaseStudy(caseStudy);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCaseStudy(null);
  };

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedCompanies([]);
    setSelectedMarkets([]);
    setSelectedObjectives([]);
  };

  const handleSubmissionSuccess = () => {
    refetch();
    toast.success('Case study submitted successfully!');
  };

  if (isLoading) {
    return (
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-stare-navy">Explore Case Studies</h1>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-stare-navy" />
            <span className="ml-2 text-gray-600">Loading case studies...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-stare-navy">Explore Case Studies</h1>
          <div className="text-center py-12">
            <div className="text-red-600">
              <p className="text-lg font-medium">Unable to load case studies</p>
              <p className="text-sm text-gray-500 mt-2">Please check your database connection.</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Retry
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stare-navy mb-2">Explore Case Studies</h1>
          <p className="text-gray-600">Discover inspiring case studies from leading companies</p>
        </div>
        
        <CaseStudyHeader
          searchQuery={searchQuery}
          selectedCategories={selectedCategories}
          selectedCompanies={selectedCompanies}
          selectedMarkets={selectedMarkets}
          selectedObjectives={selectedObjectives}
          categories={categories}
          companies={companies}
          markets={markets}
          objectives={objectives}
          sortBy={sortBy}
          totalResults={filteredAndSortedCaseStudies.length}
          onSearchChange={setSearchQuery}
          onCategoryChange={setSelectedCategories}
          onCompanyChange={setSelectedCompanies}
          onMarketChange={setSelectedMarkets}
          onObjectiveChange={setSelectedObjectives}
          onSortChange={setSortBy}
          onSubmitClick={() => setShowSubmissionModal(true)}
        />

        {/* Filter Chips */}
        <CaseStudyFilterChips
          selectedCategories={selectedCategories}
          selectedCompanies={selectedCompanies}
          selectedMarkets={selectedMarkets}
          selectedObjectives={selectedObjectives}
          searchQuery={searchQuery}
          onRemoveCategory={(cat) => setSelectedCategories(prev => prev.filter(c => c !== cat))}
          onRemoveCompany={(comp) => setSelectedCompanies(prev => prev.filter(c => c !== comp))}
          onRemoveMarket={(market) => setSelectedMarkets(prev => prev.filter(m => m !== market))}
          onRemoveObjective={(obj) => setSelectedObjectives(prev => prev.filter(o => o !== obj))}
          onClearSearch={() => setSearchQuery('')}
          onClearAll={handleClearAllFilters}
        />

        {filteredAndSortedCaseStudies.length === 0 ? (
          <div className="text-center py-12">
            {caseStudies.length === 0 ? (
              <div>
                <p className="text-gray-500 text-lg mb-4">No case studies found in the database.</p>
                <Button onClick={() => setShowSubmissionModal(true)}>
                  Submit the First Case Study
                </Button>
              </div>
            ) : (
              <div>
                <p className="text-gray-500 text-lg mb-2">No results found</p>
                <p className="text-gray-400 text-sm mb-4">Try changing filters or submit your own case study.</p>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={handleClearAllFilters}>
                    Clear Filters
                  </Button>
                  <Button onClick={() => setShowSubmissionModal(true)}>
                    Submit Case Study
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedData.map(caseStudy => (
                <CaseStudyCard 
                  key={caseStudy.id} 
                  caseStudy={caseStudy}
                  onClick={handleCaseStudyClick}
                />
              ))}
            </div>
            
            {hasMore && (
              <div className="text-center mt-12">
                <Button 
                  onClick={loadMore}
                  variant="outline"
                  size="lg"
                  className="px-8"
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading more...
                    </>
                  ) : (
                    'Show More'
                  )}
                </Button>
              </div>
            )}
          </>
        )}

        <CaseStudyModal
          caseStudy={selectedCaseStudy}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />

        <CaseStudySubmissionModal
          isOpen={showSubmissionModal}
          onClose={() => setShowSubmissionModal(false)}
          onSuccess={handleSubmissionSuccess}
        />
      </div>
    </section>
  );
};

export default CaseStudiesList;
