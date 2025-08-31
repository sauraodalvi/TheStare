
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
    const result = data.slice(startIndex, endIndex);
    console.log('Pagination data:', { 
      currentPage, 
      itemsPerPage, 
      totalData: data.length, 
      startIndex, 
      endIndex, 
      resultLength: result.length 
    });
    return result;
  }, [data, currentPage, itemsPerPage]);

  const hasMore = currentPage * itemsPerPage < data.length;
  console.log('HasMore calculation:', { 
    currentPage, 
    itemsPerPage, 
    totalData: data.length, 
    hasMore: currentPage * itemsPerPage < data.length 
  });
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const loadMore = () => {
    console.log('LoadMore called:', { hasMore, isLoadingMore, currentPage, itemsPerPage, dataLength: data.length });
    if (hasMore && !isLoadingMore) {
      setIsLoadingMore(true);
      setCurrentPage(prev => {
        const newPage = prev + 1;
        console.log('Setting new page:', newPage);
        return newPage;
      });
      setIsLoadingMore(false);
    } else {
      console.log('LoadMore blocked:', { hasMore, isLoadingMore });
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
