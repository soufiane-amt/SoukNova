import { useEffect, useState } from "react";
import { getPageSize } from "../utils/helpers";

const usePageResizer = (handlePageChange: (event: React.MouseEvent<HTMLButtonElement>, page: number) => void) => {
  const [pageSize, setPageSize] = useState<number>(getPageSize());

  useEffect(() => {
    const onResize = () => {
      handlePageChange({} as any, 1);
      setPageSize(getPageSize());
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return { pageSize };
};

export default usePageResizer;