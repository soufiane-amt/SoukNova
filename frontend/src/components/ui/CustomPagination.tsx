import { Box, Pagination } from '@mui/material';
import React from 'react';

interface CustomPaginationProps {
  pagesCount: number;
  page: number;
  handlePageChange: (e: React.ChangeEvent<unknown>, v: number) => void;
}
function CustomPagination({
  pagesCount,
  page,
  handlePageChange,
}: CustomPaginationProps) {
  if (pagesCount <= 1) return null;
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
      <Pagination
        count={pagesCount}
        page={page}
        onChange={handlePageChange}
        color="primary"
        shape="rounded"
        sx={{
          '& .MuiPaginationItem-root.Mui-selected': {
            borderRadius: '50%', // fully rounded
            fontWeight: 'bold', // bold number
            backgroundColor: '#000', // black background
            color: '#fff', // white text
          },
          '& .MuiPaginationItem-root:hover': {
            borderRadius: '50%',
          },
        }}
      />
    </Box>
  );
}

export default React.memo(CustomPagination);
