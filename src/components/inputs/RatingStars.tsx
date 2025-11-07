'use client';
import { useState } from 'react';
import { Box, Rating } from '@mui/material';

type SizeType = 'small' | 'medium' | 'large';

interface RatingStarsProps {
  isStatic?: boolean;
  defaultValue?: number | null;
  onChange?: (newValue: number | null) => void;
  size?: SizeType;
}

export default function RatingStars({
  isStatic = false,
  defaultValue = 0,
  onChange,
  size = 'small',
}: RatingStarsProps) {
  const [value, setValue] = useState<number | null>(defaultValue);

  const handleChange = (
    _event: React.SyntheticEvent,
    newValue: number | null,
  ) => {
    if (!isStatic) {
      setValue(newValue);
      if (onChange) onChange(newValue);
    }
  };

  return (
    <Box sx={{ '& > legend': { mt: 2 } }}>
      <Rating
        precision={0.5}
        name="controlled-rating"
        value={value}
        readOnly={isStatic}
        onChange={handleChange}
        size={size}
        sx={{
          '& .MuiRating-iconFilled, & .MuiRating-iconEmpty': {
            color: '#343839',
            stroke: 'black',
            strokeWidth: 0.1,
          },
        }}
      />
    </Box>
  );
}
