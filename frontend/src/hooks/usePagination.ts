import { useState, useCallback } from 'react';

export function usePagination(initialPage = 1, scrollTop = 50) {
  const [page, setPage] = useState(initialPage);

  const handlePageChange = useCallback(
    (_: React.ChangeEvent<unknown>, value: number) => {
      setPage(value);
      window.scrollTo({ top: scrollTop, behavior: 'smooth' });
    },
    [scrollTop],
  );

  return {
    page,
    setPage,
    handlePageChange,
  };
}
