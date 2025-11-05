'use client';
import Rating from '@mui/material/Rating';
import { Box } from '@mui/material';
import { useState } from 'react';

type sizeType = "small" |  "medium" |  "large"  
interface RatingStarsProps {
  isStatic: boolean;
  defaultValue: number | null;
  size? : sizeType
}

function RatingStars({ isStatic, defaultValue, size }: RatingStarsProps) {
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
          '& .MuiRating-iconFilled, & .MuiRating-iconEmpty': {
            color: '#343839',
            stroke: 'black',
            strokeWidth: 0.1, // slightly visible but very thin
          },
        }}
        name="simple-controlled"
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        readOnly={isStatic}
        size={size ?? "small"}
      />
    </Box>
  );
}

export default RatingStars;
