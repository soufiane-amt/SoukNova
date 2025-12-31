import { useEffect, useState } from 'react';
import { getPageSize } from '../utils/helpers';

const usePageResizer = (
  handlePageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    page: number,
  ) => void,
) => {
  const [pageSize, setPageSize] = useState<number>(() => getPageSize());

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onResize = () => {
      handlePageChange({} as any, 1);
      setPageSize(getPageSize());
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [handlePageChange]);

  return { pageSize };
};

export default usePageResizer;
