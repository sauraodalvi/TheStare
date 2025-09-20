import { useState, useCallback } from 'react';

interface UseServerPaginationProps {
  initialPage?: number;
  itemsPerPage?: number;
}

interface PaginationState {
  currentPage: number;
  isLoadingMore: boolean;
  hasMore: boolean;
  totalCount: number;
  itemsPerPage: number;
}

export function useServerPagination({ 
  initialPage = 1, 
  itemsPerPage = 30 
}: UseServerPaginationProps = {}) {
  const [state, setState] = useState<PaginationState>({
    currentPage: initialPage,
    isLoadingMore: false,
    hasMore: true,
    totalCount: 0,
    itemsPerPage: itemsPerPage
  });

  const loadMore = useCallback(() => {
    try {
      console.log('=== SERVER PAGINATION LOAD MORE ===');
      console.log('Current page:', state.currentPage);
      console.log('Has more:', state.hasMore);
      console.log('Is loading:', state.isLoadingMore);
      
      if (state.hasMore && !state.isLoadingMore) {
        setState(prev => {
          if (prev.isLoadingMore) {
            console.log('Already loading, skipping duplicate loadMore call');
            return prev;
          }
          return {
            ...prev,
            currentPage: prev.currentPage + 1,
            isLoadingMore: true
          };
        });
      } else {
        console.log('Load more blocked - hasMore:', state.hasMore, 'isLoadingMore:', state.isLoadingMore);
      }
    } catch (error) {
      console.error('Error in loadMore:', error);
      setState(prev => ({
        ...prev,
        isLoadingMore: false
      }));
    }
  }, [state.hasMore, state.isLoadingMore, state.currentPage]);

  const updatePaginationState = useCallback((newData: { 
    hasMore: boolean; 
    totalCount: number;
    isLoadingMore?: boolean;
  }) => {
    console.log('Updating pagination state:', newData);
    setState(prev => ({
      ...prev,
      hasMore: newData.hasMore,
      totalCount: newData.totalCount,
      isLoadingMore: newData.isLoadingMore ?? false
    }));
  }, []);

  const reset = useCallback(() => {
    console.log('Resetting pagination to initial state');
    setState({
      currentPage: initialPage,
      isLoadingMore: false,
      hasMore: true,
      totalCount: 0,
      itemsPerPage: itemsPerPage
    });
  }, [initialPage, itemsPerPage]);

  const setLoadingMore = useCallback((loading: boolean) => {
    setState(prev => ({
      ...prev,
      isLoadingMore: loading
    }));
  }, []);

  return {
    currentPage: state.currentPage,
    isLoadingMore: state.isLoadingMore,
    hasMore: state.hasMore,
    totalCount: state.totalCount,
    itemsPerPage,
    loadMore,
    updatePaginationState,
    reset,
    setLoadingMore
  };
}
