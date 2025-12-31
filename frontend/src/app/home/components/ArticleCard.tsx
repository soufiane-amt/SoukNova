'use client';
import { useState } from 'react';
import Image from 'next/image';
import { poppins } from '@/layout';
import Link from 'next/link';
import { Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { ARTICLE_DEFAULT_IMAGE } from '../../../constants/assets';

interface ArticleCardProps {
  id: string;
  title: string;
  image: string;
}

export function ArticleCard({ id, title, image }: ArticleCardProps) {
  const [imgSrc, setImgSrc] = useState<string>(image || ARTICLE_DEFAULT_IMAGE);
  return (
    <Link
      href={`/blog/${id}`}
      className="group cursor-pointer w-full max-w-sm flex flex-col mb-8 h-full justify-between "
    >
      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg shadow-sm transition-shadow duration-300 min-h-[200px] md:min-h-[300px]">
        <Image
          src={imgSrc}
          alt={title}
          fill
          onError={() => {
            if (imgSrc !== ARTICLE_DEFAULT_IMAGE)
              setImgSrc(ARTICLE_DEFAULT_IMAGE);
          }}
          className="object-cover transition-transform duration-300 group-hover:scale-105 w-full"
        />
      </div>
      <p
        className={`${poppins.className} pt-4 font-medium text-sm md:text-lg overflow-hidden line-clamp-1`}
      >
        {title}
      </p>
      <div className="mt-2 w-full">
        <Button
          variant="text"
          disableElevation
          disableRipple
          disableFocusRipple
          sx={{
            all: 'unset',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            color: 'inherit',
            justifyItems: 'center',
            borderBottom: '1px solid currentColor',
            fontFamily: poppins.className,
            height: '15px',
            paddingBlock: 0.8,
          }}
          endIcon={<ArrowForwardIcon sx={{ width: 18 }} />}
        >
          Read more
        </Button>
      </div>
    </Link>
  );
}
