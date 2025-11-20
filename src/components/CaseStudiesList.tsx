
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
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
import { Skeleton } from './LayoutStable';

// Define the shape of the pagination state
interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalCount: number;
  hasMore: boolean;
  isLoadingMore: boolean;
}

const CaseStudiesList: React.FC = () => {
  // Authentication and data fetching
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const hasShownError = useRef(false);
  
  // UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>([]);
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([]);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudy | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('api-order');
  
  // Data state
  const [allCaseStudies, setAllCaseStudies] = useState<CaseStudy[]>([]);
  
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
  
  // Define the query data type to match the return type of SupabaseService.getCaseStudies
  type CaseStudyQueryData = {
    data: CaseStudy[];
    totalCount: number;
    hasMore: boolean;
  };

  // Fetch subscription info from profiles (subscription_type_int) when logged in
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

  // Determine subscription type based on profile first, then user metadata
  const subscriptionType = useMemo(() => {
    if (!user) return 'free';

    // Support profiles.subscription_type as smallint (0/1) if migration swapped types
    const subVal = profileSubData?.subscription_type;
    if (typeof subVal === 'number') {
      return subVal === 1 ? 'paid' : 'free';
    }
    if (typeof subVal === 'string') {
      const normalized = subVal.toLowerCase().trim();
      if (normalized === '1' || normalized === 'paid' || normalized === 'pro') return 'paid';
      return 'free';
    }

    // Fallback: Normalize user metadata subscriptionType
    const rawSub: unknown = (user as any)?.user_metadata?.subscriptionType;
    if (!rawSub) return 'free';
    const normalized = String(rawSub).toLowerCase().trim();
    const paidAliases = new Set([
      'paid', 'pro', 'premium', 'plus', 'lifetime', 'enterprise', 'business', 'team',
      'active', 'active_paid', 'trial', 'trialing', 'subscriber', 'subscribed'
    ]);
    return paidAliases.has(normalized) ? 'paid' : 'free';
  }, [user, profileSubData]);

  // Include all relevant dependencies in the query key to refetch when they change
  const queryKey = useMemo(() => [
    'caseStudies', 
    user?.id, 
    subscriptionType, 
    currentPage,
    searchQuery,
    selectedCategories.join(','),
    selectedCompanies.join(','),
    selectedMarkets.join(','),
    selectedObjectives.join(',')
  ], [
    user?.id, 
    subscriptionType, 
    currentPage,
    searchQuery,
    selectedCategories,
    selectedCompanies,
    selectedMarkets,
    selectedObjectives
  ]);

  const isSubscriptionReady = useMemo(() => {
    // If not logged in, we're ready (treated as free)
    if (!user?.id) return true;
    // If logged in, wait until profileSubData is fetched
    return profileSubData !== undefined;
  }, [user?.id, profileSubData]);

  const { data: pageData, isLoading, error, refetch, isFetching } = useQuery<CaseStudyQueryData, Error>({
    queryKey,
    queryFn: async () => {
      try {
        console.log('=== FETCHING CASE STUDIES ===');
        console.log('User:', user?.id ? 'Authenticated' : 'Not authenticated');
        console.log('Subscription type:', subscriptionType);
        console.log('Page:', currentPage, 'Items per page:', itemsPerPage);
        
        const result = await SupabaseService.getCaseStudies(
          !!user, // isAuthenticated
          subscriptionType,
          currentPage, 
          itemsPerPage
        );
        
        console.log('=== FETCHED CASE STUDIES ===');
        console.log('Total count:', result.totalCount);
        console.log('Has more:', result.hasMore);
        console.log('First item free status:', result.data[0]?.Free);
        
        console.log(`Fetched ${result.data.length} items, total count: ${result.totalCount}, hasMore: ${result.hasMore}`);

        // Update the case studies list with deduplication
        setAllCaseStudies(prev => {
          // If this is the first page, replace the entire list
          if (currentPage === 1) {
            console.log('Resetting case studies with new data');
            return result.data;
          }
          
          // For subsequent pages, merge with existing data
          const existingKeys = new Set(prev.map(cs => cs.id));
          const newItems = result.data.filter(cs => !existingKeys.has(cs.id));
          
          if (newItems.length === 0) {
            console.log('No new items to add');
            return prev;
          }
          
          console.log(`Adding ${newItems.length} new items to existing ${prev.length}`);
          return [...prev, ...newItems];
        });

        return result;
      } catch (err) {
        console.error('Error fetching case studies:', err);
        throw err;
      }
    },
    retry: 1,
    enabled: isSubscriptionReady,
    placeholderData: (previousData) => previousData,
  });

  useEffect(() => {
    if (error && !hasShownError.current) {
      hasShownError.current = true;
      toast.error('Failed to load case studies. Please try again later.');
    }
  }, [error]);

  useEffect(() => {
    console.log('=== AUTH STATE CHANGED ===');
    console.log('User:', user);
    console.log('Is authenticated:', !!user);
    console.log('Subscription type:', user?.user_metadata?.subscriptionType);
  }, [user]);

  // Update pagination state when pageData changes
  useEffect(() => {
    if (pageData) {
      updatePaginationState({
        totalCount: pageData.totalCount,
        hasMore: pageData.hasMore,
        isLoadingMore: false,
      });
    }
  }, [pageData, updatePaginationState]);

  useEffect(() => {
    if (isLoading && currentPage > 1) {
      updatePaginationState({
        isLoadingMore: true,
        hasMore: hasMore,
        totalCount: totalCount,
      });
    } else {
      updatePaginationState({
        isLoadingMore: false,
        hasMore: hasMore,
        totalCount: totalCount,
      });
    }
  }, [isLoading, currentPage, updatePaginationState, hasMore, totalCount]);

  // Memoize derived data from case studies - must be called before any conditional returns
  const { categories, companies, markets, objectives } = useMemo(() => {
    const safeAllCaseStudies = allCaseStudies || [];
    
    const categories = [...new Set(safeAllCaseStudies.flatMap((cs) => cs?.Category || []).filter((cat) => cat && cat !== 'All'))];
    const companies = [...new Set(safeAllCaseStudies.map((cs) => cs?.Company).filter(Boolean))];
    const markets = [...new Set(safeAllCaseStudies.map((cs) => cs?.Market).filter(Boolean))];
    const objectives = [...new Set(safeAllCaseStudies.flatMap((cs) => cs?.Objective || []).filter((obj) => obj && obj.trim() !== ''))];
    
    return { categories, companies, markets, objectives };
  }, [allCaseStudies]);

  // Memoize filtered and sorted case studies
  const filteredAndSortedCaseStudies = useMemo(() => {
    if (!allCaseStudies || allCaseStudies.length === 0) {
      return [];
    }
    
    let result = [...allCaseStudies];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((study) =>
        (study.Title?.toLowerCase().includes(query) ||
        study.Name?.toLowerCase().includes(query) ||
        study.Company?.toLowerCase().includes(query) ||
        study.Organizer?.toLowerCase().includes(query)) ?? false
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter((cs) =>
        Array.isArray(cs.Category) && cs.Category.some((cat) => 
          cat && selectedCategories.includes(cat)
        )
      );
    }

    if (selectedCompanies.length > 0) {
      result = result.filter((cs) =>
        cs.Company && selectedCompanies.includes(cs.Company)
      );
    }

    if (selectedMarkets.length > 0) {
      result = result.filter((cs) =>
        cs.Market && selectedMarkets.includes(cs.Market)
      );
    }

    if (selectedObjectives.length > 0) {
      result = result.filter((cs) => 
        cs.Objective && cs.Objective.some((obj) => 
          obj && selectedObjectives.includes(obj)
        )
      );
    }

    switch (sortBy) {
      case 'api-order':
        result.sort((a, b) => (a.Sort || 0) - (b.Sort || 0));
        break;
      case 'most-liked':
        result.sort((a, b) => (b.Likes || 0) - (a.Likes || 0));
        break;
      case 'most-recent':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'a-z':
        result.sort((a, b) => (a.Title || a.Name || '').localeCompare(b.Title || b.Name || ''));
        break;
      case 'z-a':
        result.sort((a, b) => (b.Title || b.Name || '').localeCompare(a.Title || a.Name || ''));
        break;
      default:
        result.sort((a, b) => (a.Sort || 0) - (b.Sort || 0));
        break;
    }

    return result;
  }, [allCaseStudies, searchQuery, selectedCategories, selectedCompanies, selectedMarkets, selectedObjectives, sortBy]);

  const displayedCaseStudies = filteredAndSortedCaseStudies || [];

  useEffect(() => {
    resetPagination();
    setAllCaseStudies([]);
    // Invalidate the same key used by useQuery to force a refetch
    queryClient.invalidateQueries({ queryKey: ['caseStudies'] });
    hasShownError.current = false;
  }, [user?.id, subscriptionType, queryClient, resetPagination]);

  useEffect(() => {
    if (searchQuery || selectedCategories.length > 0 || selectedCompanies.length > 0 ||
        selectedMarkets.length > 0 || selectedObjectives.length > 0) {
      resetPagination();
      setAllCaseStudies([]);
      queryClient.invalidateQueries({ queryKey: ['caseStudies'] });
    }
  }, [searchQuery, selectedCategories, selectedCompanies, selectedMarkets, selectedObjectives, resetPagination, queryClient]);

  const handleLoadMore = useCallback(() => {
    console.log('Load more clicked. Current state:', { isLoadingMore, hasMore });
    if (!isLoadingMore && hasMore) {
      console.log('Loading more items...');
      loadMoreItems();
    } else {
      console.log('Load more prevented. State:', { isLoadingMore, hasMore });
    }
  }, [isLoadingMore, hasMore, loadMoreItems]);

  const handleCaseStudyClick = useCallback((caseStudy: CaseStudy) => {
    setSelectedCaseStudy(caseStudy);
    setIsModalOpen(true);
  }, [setSelectedCaseStudy, setIsModalOpen]);

  const handleOpenSubmissionModal = useCallback(() => {
    setIsSubmissionModalOpen(true);
  }, [setIsSubmissionModalOpen]);

  const handleCloseSubmissionModal = useCallback(() => {
    setIsSubmissionModalOpen(false);
  }, [setIsSubmissionModalOpen]);

  const handleSortChange = useCallback((value: SortOption) => {
    setSortBy(value);
  }, [setSortBy]);

  const handleCloseModal = useCallback(() => {
    setSelectedCaseStudy(null);
    setIsModalOpen(false);
  }, [setSelectedCaseStudy, setIsModalOpen]);

  const handleSubmissionSuccess = useCallback(() => {
    setIsSubmissionModalOpen(false);
    refetch();
  }, [refetch, setIsSubmissionModalOpen]);

  const handleClearAllFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedCompanies([]);
    setSelectedMarkets([]);
    setSelectedObjectives([]);
  }, []);

  // Calculate loading and error states after all hooks are called
  const isLoadingState = isLoading && currentPage === 1;
  const hasError = !!error;
  
  // Calculate the actual count of displayed case studies
  const displayedCount = displayedCaseStudies.length;
  const totalItemsCount = Math.max(displayedCount, totalCount);
  // Show the button if we have more items to load or if we haven't loaded all items yet
  const hasMoreItems = hasMore || displayedCount < totalItemsCount;

  // Main content
  // Early returns must be after all hooks
  if (isLoadingState) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton width="300px" height={40} className="mb-4" />
          <Skeleton width="100%" height={48} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-lg">
              <Skeleton width="100%" height={200} />
              <Skeleton width="80%" height={24} />
              <Skeleton width="60%" height={20} />
              <Skeleton width="40%" height={20} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
        <div className="bg-destructive/10 p-4 rounded-lg max-w-md">
          <h3 className="text-lg font-medium text-destructive">Failed to load case studies</h3>
          <p className="text-sm text-muted-foreground mt-2">
            There was an error loading the case studies. Please try again.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Retrying...
              </>
            ) : (
              'Retry'
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <section className="py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Explore Case Studies</h1>
              <p className="text-muted-foreground mt-2">Discover inspiring case studies from leading companies</p>
            </div>
          </div>
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
          totalResults={displayedCaseStudies.length}
          onSearchChange={setSearchQuery}
          onCategoryChange={setSelectedCategories}
          onCompanyChange={setSelectedCompanies}
          onMarketChange={setSelectedMarkets}
          onObjectiveChange={setSelectedObjectives}
          onSortChange={setSortBy}
          onSubmitClick={() => setIsSubmissionModalOpen(true)}
        />

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedCaseStudies.map((caseStudy, index) => {
            // Use database ID as primary key, fallback to index if not available
            const uniqueKey = caseStudy.id ? `case-study-${caseStudy.id}` : `case-study-${index}`;
            
            return (
              <CaseStudyCard
                key={uniqueKey}
                caseStudy={caseStudy}
                onClick={() => handleCaseStudyClick(caseStudy)}
              />
            );
          })}
        </div>

        {displayedCaseStudies.length === 0 ? (
          <div className="text-center py-12 col-span-full">
            <h3 className="text-lg font-medium text-muted-foreground">
              {isLoading ? 'Loading case studies...' : 'No case studies found'}
            </h3>
            <p className="text-muted-foreground mt-2">
              {searchQuery ||
                selectedCategories.length > 0 ||
                selectedCompanies.length > 0 ||
                selectedMarkets.length > 0 ||
                selectedObjectives.length > 0
                ? 'Try adjusting your search or filter criteria.'
                : 'No case studies are available at the moment. Please check back later.'}
            </p>
          </div>
        ) : (
          <div className="mt-8 text-center col-span-full">
            <Button
              variant="outline"
              onClick={handleLoadMore}
              disabled={isLoadingMore || !hasMoreItems}
              className="mb-4"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : hasMoreItems ? (
                'Show More'
              ) : (
                'No More Results'
              )}
            </Button>
            <p className="text-sm text-muted-foreground">
              Showing {displayedCount} of {totalItemsCount} case studies
              {hasMoreItems ? ' (scroll to load more)' : ''}
            </p>
          </div>
        )}

      {selectedCaseStudy && (
        <CaseStudyModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          caseStudy={selectedCaseStudy}
        />
      )}

      <CaseStudySubmissionModal
        isOpen={isSubmissionModalOpen}
        onClose={handleCloseSubmissionModal}
        onSuccess={handleSubmissionSuccess}
      />
    </div>
  </section>
);
};

const CaseStudiesListWithErrorBoundary = () => (
  <ErrorBoundary>
    <CaseStudiesList />
  </ErrorBoundary>
);

export default CaseStudiesListWithErrorBoundary;
