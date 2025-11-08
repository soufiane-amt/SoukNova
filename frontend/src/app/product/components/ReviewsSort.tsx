import {
  Box,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { poppins } from '@/layout';

import React from 'react';

const ReviewsSort = () => {
  const [sortOption, setSortOption] = React.useState('all');

  const handleChange = (event: SelectChangeEvent) => {
    setSortOption(event.target.value as string);
  };

  return (
    <Box
      sx={{
        minWidth: 150,
        marginTop: 3,
        fontSize: 2,
      }}
    >
      <FormControl fullWidth>
        <Select
          value={sortOption}
          onChange={handleChange}
          variant="outlined"
          className={poppins.className} // apply Poppins font
          sx={{
            fontSize: '1rem',
            fontWeight: 700,
            fontFamily: 'var(--font-poppins)',
            borderRadius: '8px',
            height: '40px',
            textAlign: 'left', // aligns the text to the start
            '& .MuiSelect-select': {
              paddingRight: '16px', // optional, adds spacing from the edge
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderWidth: 2,
              borderColor: 'black',
            },
          }}
        >
          <MenuItem value="all">All Reviews</MenuItem>
          <MenuItem value="newest">Newest</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default ReviewsSort;
