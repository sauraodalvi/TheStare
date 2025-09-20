
import { useState, useMemo, useCallback } from 'react';

interface UsePaginationProps<T> {
  data: T[];
  itemsPerPage: number;
}

export function usePagination<T>({ data, itemsPerPage }: UsePaginationProps<T>) {
  const [itemsToShow, setItemsToShow] = useState(itemsPerPage);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const paginatedData = useMemo(() => {
    return data.slice(0, itemsToShow);
  }, [data, itemsToShow]);

  const hasMore = itemsToShow < data.length;
  const currentPage = Math.ceil(itemsToShow / itemsPerPage);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const loadMore = useCallback(() => {
    console.log('=== LOAD MORE CLICKED ===');
    console.log('hasMore:', hasMore);
    console.log('isLoadingMore:', isLoadingMore);
    console.log('current itemsToShow:', itemsToShow);
    console.log('data.length:', data.length);
    console.log('itemsPerPage:', itemsPerPage);

    if (hasMore && !isLoadingMore) {
      setIsLoadingMore(true);

      // Simulate loading delay for better UX
      setTimeout(() => {
        const newItemsToShow = Math.min(itemsToShow + itemsPerPage, data.length);
        console.log('Setting itemsToShow to:', newItemsToShow);
        setItemsToShow(newItemsToShow);
        setIsLoadingMore(false);
      }, 300);
    } else {
      console.log('Load more blocked - hasMore:', hasMore, 'isLoadingMore:', isLoadingMore);
    }
  }, [hasMore, isLoadingMore, itemsPerPage, data.length, itemsToShow]);

  const reset = useCallback(() => {
    setItemsToShow(itemsPerPage);
    setIsLoadingMore(false);
  }, [itemsPerPage]);

  return {
    paginatedData,
    hasMore,
    loadMore,
    reset,
    currentPage,
    totalPages,
    totalItems: data.length,
    isLoadingMore
  };
}
