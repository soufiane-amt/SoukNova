'use client';
import Rating from '@mui/material/Rating';
import { Box } from '@mui/material';
import { useState } from 'react';

interface RatingStarsProps {
  isStatic: boolean;
  defaultValue: number | null;
}

function RatingStars({ isStatic, defaultValue }: RatingStarsProps) {
  const [value, setValue] = useState(defaultValue);

  return (
    <Box
      sx={{
        '& > legend': { mt: 2 },
      }}
    >
      <Rating
        precision={0.5}
        sx={{
          '& .MuiRating-iconFilled': {
            color: '#343839',
          },
          '& .MuiRating-iconEmpty': {
            color: '#BDBDBD',
          },
        }}
        name="simple-controlled"
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        readOnly={isStatic}
        size="small"
      />
    </Box>
  );
}

export default RatingStars;
