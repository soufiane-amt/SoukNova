'use client';
import * as React from 'react';
import { Skeleton } from '@mui/material';

interface ProductCarouselSkeletonProps {
  count?: number;
}

export default function ProductCarouselSkeleton({
  count = 6,
}: ProductCarouselSkeletonProps) {
  return (
    <div className="flex overflow-x-auto overflow-y-hidden space-x-6 py-3 custom-scrollbar">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={`carousel-skel-${idx}`}
          className="w-[280px] flex-shrink-0 mb-5"
        >
          <div className="relative w-full h-[320px] overflow-hidden bg-[#f4f4f4]">
            <Skeleton
              variant="rectangular"
              animation="wave"
              sx={{ width: '100%', height: 320 }}
            />
          </div>
          <div className="mt-3">
            <Skeleton variant="text" animation="wave" width="60%" height={20} />
            <div className="flex gap-4 mt-2">
              <Skeleton
                variant="text"
                animation="wave"
                width="40%"
                height={20}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
