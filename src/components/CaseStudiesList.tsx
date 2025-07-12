
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { CaseStudy } from '@/types/caseStudy';
import { toast } from 'sonner';
import { SupabaseService } from '@/services/supabaseService';
import { usePagination } from '@/hooks/usePagination';
import CaseStudyCard from './CaseStudyCard';
import CaseStudyFilters from './CaseStudyFilters';
import CaseStudyModal from './CaseStudyModal';
import CaseStudySubmissionForm from './CaseStudySubmissionForm';
import CaseStudyFilterChips from './CaseStudyFilterChips';
import CaseStudySorting, { SortOption } from './CaseStudySorting';

const CaseStudiesList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>([]);
  const [likesRange, setLikesRange] = useState<number[]>([0, 500]);
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([]);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudy | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('most-liked');
  const hasShownError = useRef(false);

  const { data: caseStudies = [], isLoading, error } = useQuery({
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

    filtered = filtered.filter(cs =>
      cs.Likes >= likesRange[0] && cs.Likes <= likesRange[1]
    );

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
  }, [caseStudies, searchQuery, selectedCategories, selectedCompanies, selectedMarkets, likesRange, selectedObjectives, sortBy]);

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
  }, [searchQuery, selectedCategories, selectedCompanies, selectedMarkets, likesRange, selectedObjectives, sortBy, reset]);

  const handleCaseStudyClick = (caseStudy: CaseStudy) => {
    setSelectedCaseStudy(caseStudy);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCaseStudy(null);
  };

  const handleCategoryChange = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleCompanyChange = (company: string) => {
    if (selectedCompanies.includes(company)) {
      setSelectedCompanies(selectedCompanies.filter(c => c !== company));
    } else {
      setSelectedCompanies([...selectedCompanies, company]);
    }
  };

  const handleMarketChange = (market: string) => {
    if (selectedMarkets.includes(market)) {
      setSelectedMarkets(selectedMarkets.filter(m => m !== market));
    } else {
      setSelectedMarkets([...selectedMarkets, market]);
    }
  };

  const handleObjectiveChange = (objective: string) => {
    if (selectedObjectives.includes(objective)) {
      setSelectedObjectives(selectedObjectives.filter(o => o !== objective));
    } else {
      setSelectedObjectives([...selectedObjectives, objective]);
    }
  };

  const handleLikesRangeChange = (value: number[]) => {
    setLikesRange(value);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedCompanies([]);
    setSelectedMarkets([]);
    setSelectedObjectives([]);
    setLikesRange([0, 500]);
  };

  if (showSubmissionForm) {
    return (
      <section className="py-8 px-4">
        <div className="container max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-stare-navy">Submit Case Study</h1>
            <Button variant="outline" onClick={() => setShowSubmissionForm(false)}>
              Back to Browse
            </Button>
          </div>
          <CaseStudySubmissionForm />
        </div>
      </section>
    );
  }

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
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stare-navy mb-2">Explore Case Studies</h1>
            <p className="text-gray-600 text-sm">
              Showing {paginatedData.length} of {totalItems} case studies
            </p>
          </div>
          <Button 
            onClick={() => setShowSubmissionForm(true)} 
            className="bg-stare-navy hover:bg-stare-navy/90 whitespace-nowrap"
          >
            <Plus className="mr-2 h-4 w-4" />
            Submit Case Study
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1">
            <CaseStudyFilters
              searchQuery={searchQuery}
              selectedCategories={selectedCategories}
              selectedCompanies={selectedCompanies}
              selectedMarkets={selectedMarkets}
              selectedObjectives={selectedObjectives}
              likesRange={likesRange}
              categories={categories}
              companies={companies}
              markets={markets}
              objectives={objectives}
              onSearchChange={handleSearchChange}
              onCategoryChange={handleCategoryChange}
              onCompanyChange={handleCompanyChange}
              onMarketChange={handleMarketChange}
              onObjectiveChange={handleObjectiveChange}
              onLikesRangeChange={handleLikesRangeChange}
            />
          </aside>
          
          <div className="lg:col-span-3">
            {/* Filter Chips */}
            <CaseStudyFilterChips
              selectedCategories={selectedCategories}
              selectedCompanies={selectedCompanies}
              selectedMarkets={selectedMarkets}
              selectedObjectives={selectedObjectives}
              searchQuery={searchQuery}
              onRemoveCategory={handleCategoryChange}
              onRemoveCompany={handleCompanyChange}
              onRemoveMarket={handleMarketChange}
              onRemoveObjective={handleObjectiveChange}
              onClearSearch={() => setSearchQuery('')}
              onClearAll={handleClearAllFilters}
            />

            {/* Sorting */}
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm text-gray-600">
                {filteredAndSortedCaseStudies.length === 0 && caseStudies.length > 0 ? (
                  <span>No results match your filters</span>
                ) : (
                  <span>{filteredAndSortedCaseStudies.length} case studies found</span>
                )}
              </div>
              <CaseStudySorting value={sortBy} onChange={setSortBy} />
            </div>

            {filteredAndSortedCaseStudies.length === 0 ? (
              <div className="text-center py-12">
                {caseStudies.length === 0 ? (
                  <div>
                    <p className="text-gray-500 text-lg mb-4">No case studies found in the database.</p>
                    <Button onClick={() => setShowSubmissionForm(true)}>
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
                      <Button onClick={() => setShowSubmissionForm(true)}>
                        Submit Case Study
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {paginatedData.map(caseStudy => (
                    <CaseStudyCard 
                      key={caseStudy.id} 
                      caseStudy={caseStudy}
                      onClick={handleCaseStudyClick}
                    />
                  ))}
                </div>
                
                {hasMore && (
                  <div className="text-center mt-8">
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
          </div>
        </div>

        <CaseStudyModal
          caseStudy={selectedCaseStudy}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </section>
  );
};

export default CaseStudiesList;
