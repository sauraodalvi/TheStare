
import { useState, useMemo } from 'react';

interface UsePaginationProps<T> {
  data: T[];
  itemsPerPage: number;
}

export function usePagination<T>({ data, itemsPerPage }: UsePaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const paginatedData = useMemo(() => {
    const startIndex = 0;
    const endIndex = currentPage * itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage]);

  const hasMore = currentPage * itemsPerPage < data.length;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const loadMore = async () => {
    if (hasMore && !isLoadingMore) {
      setIsLoadingMore(true);
      // Simulate loading delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      setCurrentPage(prev => prev + 1);
      setIsLoadingMore(false);
    }
  };

  const reset = () => {
    setCurrentPage(1);
    setIsLoadingMore(false);
  };

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
