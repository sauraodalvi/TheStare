
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
    if (hasMore && !isLoadingMore) {
      setIsLoadingMore(true);
      
      // Simulate loading delay for better UX
      setTimeout(() => {
        setItemsToShow(prev => Math.min(prev + itemsPerPage, data.length));
        setIsLoadingMore(false);
      }, 300);
    }
  }, [hasMore, isLoadingMore, itemsPerPage, data.length]);

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
