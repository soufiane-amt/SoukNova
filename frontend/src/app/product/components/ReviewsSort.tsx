import {
  Box,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import React from 'react';

const ReviewsSort = () => {
  const [sortOption, setSortOption] = React.useState('newest');

  const handleChange = (event: SelectChangeEvent) => {
    setSortOption(event.target.value as string);
  };

  return (
    <Box
      sx={{
        minWidth: 150,
        marginTop: 3,
        borderColor: 'black',
      }}
    >
      <FormControl fullWidth>
        <Select
          value={sortOption}
          onChange={handleChange}
          sx={{
            fontSize: '1.2rem',
            borderRadius: '8px',
            height: '56px',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#141718',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#141718',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#141718',
            },
          }}
        >
          <MenuItem value="all">All reviews</MenuItem>
          <MenuItem value="newest">Newest</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default ReviewsSort;
