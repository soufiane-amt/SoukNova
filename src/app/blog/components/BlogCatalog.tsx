'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Menu, MenuzButton } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Squares3X3IconButton } from '../../../components/ui/squares/Squares3X3Icon';
import { Squares2X2IconButton } from '../../../components/ui/squares/Squares2X2Icon';
import { Grid } from '@mui/material';
import ArticalCard from './ArticalCard';
import Link from 'next/link';
import ArticleCard from './ArticalCard';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { poppins } from '@/layout';

interface BlogProps {
  articles: any[];
}

export default function BlogCatalog({ articles }: BlogProps) {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);
  const [showCount, setShowCount] = useState(16);

  const handleShowMore = () => {
    const newShowCount = Math.min(showCount + 16, articles.length);
    setShowCount(newShowCount);
  };

  return (
    <div>
      <div className="flex items-baseline justify-between pt-24 pb-6">
        <div>
          <p className={`font-semibold border-b ${poppins.className}`}>All Blogs</p>
        </div>
        <div></div>
      </div>

      <section aria-labelledby="blogs-heading" className="pt-6 pb-24">
        <h2 id="blogs-heading" className="sr-only">
          Blogs
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {articles.slice(0, showCount).map((article, index) => (
            <div
              key={article.id}
              data-aos="fade-up"
              data-aos-delay={`${index * 50}`}
            >
              <ArticleCard
                id={article.id}
                title={article.title}
                image={article.images[0]}
                date={article.date}
              />
            </div>
          ))}
        </div>
        {showCount < articles.length && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleShowMore}
              className="cursor-pointer px-8 py-2 text-sm md:text-base font-medium text-black bg-white border rounded-full"
            >
              Show More
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
