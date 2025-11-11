import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { CaseStudy } from '@/types/caseStudy';
import { toast } from 'sonner';
import { SupabaseService } from '@/services/supabaseService';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useServerPagination } from '@/hooks/useServerPagination';
import CaseStudyCard from './CaseStudyCard';
import CaseStudyModal from './CaseStudyModal';
import CaseStudySubmissionModal from './CaseStudySubmissionModal';
import CaseStudyFilterChips from './CaseStudyFilterChips';
import CaseStudyHeader from './CaseStudyHeader';
import { SortOption } from './CaseStudySorting';
import ErrorBoundary from './ErrorBoundary';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebounce } from 'use-debounce';

interface CaseStudyQueryData {
  data: CaseStudy[];
  totalCount: number;
  hasMore: boolean;
}

const OptimizedCaseStudiesList: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const hasShownError = useRef(false);
  
  // State for filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>([]);
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([]);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudy | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('api-order');
  
  // Server-side pagination
  const {
    currentPage,
    totalCount,
    hasMore,
    isLoadingMore,
    itemsPerPage,
    updatePaginationState,
    reset: resetPagination,
    loadMore: loadMoreItems
  } = useServerPagination();

  // Fetch subscription info
  const { data: profileSubData } = useQuery<{ subscription_type?: any }, Error>({
    queryKey: ['profile-subscription', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_type')
        .eq('id', user!.id as string)
        .single();
      if (error) throw error;
      return data || {} as any;
    },
    staleTime: 60_000,
  });

  // Determine subscription type
  const subscriptionType = useMemo(() => {
    if (!user) return 'free';
    const subVal = profileSubData?.subscription_type;
    if (typeof subVal === 'number') return subVal === 1 ? 'paid' : 'free';
    if (typeof subVal === 'string') {
      const normalized = subVal.toLowerCase().trim();
      if (normalized === '1' || normalized === 'paid' || normalized === 'pro') return 'paid';
      return 'free';
    }
    const rawSub: unknown = (user as any)?.user_metadata?.subscriptionType;
    if (!rawSub) return 'free';
    const normalized = String(rawSub).toLowerCase().trim();
    const paidAliases = new Set([
      'paid', 'pro', 'premium', 'plus', 'lifetime', 'enterprise', 'business', 'team',
      'active', 'active_paid', 'trial', 'trialing', 'subscriber', 'subscribed'
    ]);
    return paidAliases.has(normalized) ? 'paid' : 'free';
  }, [user, profileSubData]);

  // Build query key with all dependencies
  const queryKey = useMemo(() => [
    'caseStudies', 
    user?.id, 
    subscriptionType, 
    currentPage,
    itemsPerPage,
    debouncedSearchQuery,
    selectedCategories.join(','),
    selectedCompanies.join(','),
    selectedMarkets.join(','),
    selectedObjectives.join(','),
    sortBy
  ], [
    user?.id, 
    subscriptionType, 
    currentPage,
    itemsPerPage,
    debouncedSearchQuery,
    selectedCategories,
    selectedCompanies,
    selectedMarkets,
    selectedObjectives,
    sortBy
  ]);

  // Fetch case studies with server-side filtering and sorting
  const { 
    data: pageData, 
    isLoading, 
    error, 
    isFetching 
  } = useQuery<CaseStudyQueryData, Error>({
    queryKey,
    queryFn: async () => {
      try {
        const result = await SupabaseService.getCaseStudies(
          !!user,
          subscriptionType,
          currentPage,
          itemsPerPage,
          {
            search: debouncedSearchQuery,
            categories: selectedCategories,
            companies: selectedCompanies,
            markets: selectedMarkets,
            objectives: selectedObjectives,
            sortBy
          }
        );

        return {
          data: result.data,
          totalCount: result.totalCount,
          hasMore: result.hasMore
        };
      } catch (err) {
        console.error('Error fetching case studies:', err);
        throw err;
      }
    },
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  // Handle errors
  useEffect(() => {
    if (error && !hasShownError.current) {
      hasShownError.current = true;
      toast.error('Failed to load case studies. Please try again later.');
    }
  }, [error]);

  // Update pagination state when data changes
  useEffect(() => {
    if (pageData) {
      updatePaginationState({
        totalCount: pageData.totalCount,
        hasMore: pageData.hasMore,
        isLoadingMore: false,
      });
    }
  }, [pageData, updatePaginationState]);

  // Handle loading more
  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      loadMoreItems();
    }
  }, [isLoadingMore, hasMore, loadMoreItems]);

  // Handle case study selection
  const handleSelectCaseStudy = useCallback((caseStudy: CaseStudy) => {
    setSelectedCaseStudy(caseStudy);
    setIsModalOpen(true);
  }, []);

  // Handle filter changes
  const handleFilterChange = useCallback((type: string, value: string) => {
    resetPagination();
    switch (type) {
      case 'category':
        setSelectedCategories(prev => 
          prev.includes(value) 
            ? prev.filter(cat => cat !== value)
            : [...prev, value]
        );
        break;
      case 'company':
        setSelectedCompanies(prev => 
          prev.includes(value)
            ? prev.filter(company => company !== value)
            : [...prev, value]
        );
        break;
      case 'market':
        setSelectedMarkets(prev => 
          prev.includes(value)
            ? prev.filter(market => market !== value)
            : [...prev, value]
        );
        break;
      case 'objective':
        setSelectedObjectives(prev => 
          prev.includes(value)
            ? prev.filter(obj => obj !== value)
            : [...prev, value]
        );
        break;
    }
  }, [resetPagination]);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    resetPagination();
    setSelectedCategories([]);
    setSelectedCompanies([]);
    setSelectedMarkets([]);
    setSelectedObjectives([]);
    setSearchQuery('');
  }, [resetPagination]);

  // Render loading skeleton
  const renderSkeletons = useCallback((count: number) => {
    return Array.from({ length: count }).map((_, index) => (
      <div key={index} className="col-span-1">
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    ));
  }, []);

  // Memoize the case studies list
  const caseStudies = useMemo(() => pageData?.data || [], [pageData]);

  // Calculate if we should show the loading more indicator
  const showLoadingMore = isLoadingMore || (isFetching && currentPage > 1);

  return (
    <div className="container mx-auto px-4 py-8">
      <CaseStudyHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onAddWorkClick={() => setIsSubmissionModalOpen(true)}
      />

      {/* Filter Chips */}
      <div className="mb-6">
        <CaseStudyFilterChips
          categories={[]}
          selectedCategories={selectedCategories}
          onCategoryClick={(category) => handleFilterChange('category', category)}
          onClearAll={clearAllFilters}
          hasActiveFilters={
            selectedCategories.length > 0 ||
            selectedCompanies.length > 0 ||
            selectedMarkets.length > 0 ||
            selectedObjectives.length > 0
          }
        />
      </div>

      {/* Case Studies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading && currentPage === 1 ? (
          renderSkeletons(6)
        ) : (
          <>
            {caseStudies.map((caseStudy) => (
              <div key={caseStudy.id} className="h-full">
                <CaseStudyCard
                  caseStudy={caseStudy}
                  onClick={handleSelectCaseStudy}
                />
              </div>
            ))}
            {showLoadingMore && renderSkeletons(3)}
          </>
        )}
      </div>

      {/* Load More Button */}
      {hasMore && !isLoading && (
        <div className="mt-8 text-center">
          <Button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            variant="outline"
            className="min-w-[200px]"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}

      {/* Modals */}
      {selectedCaseStudy && (
        <CaseStudyModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          caseStudy={selectedCaseStudy}
        />
      )}

      <CaseStudySubmissionModal
        isOpen={isSubmissionModalOpen}
        onClose={() => setIsSubmissionModalOpen(false)}
      />
    </div>
  );
};

const OptimizedCaseStudiesListWithErrorBoundary = () => (
  <ErrorBoundary>
    <OptimizedCaseStudiesList />
  </ErrorBoundary>
);

export default OptimizedCaseStudiesListWithErrorBoundary;
