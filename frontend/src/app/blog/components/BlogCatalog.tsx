'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Menu, MenuButton } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Squares3X3IconButton } from '../../../components/ui/squares/Squares3X3Icon';
import { Squares2X2IconButton } from '../../../components/ui/squares/Squares2X2Icon';
import { Grid } from '@mui/material';
import ArticalCard from './ArticalCard';
import Link from 'next/link';
// Removed: import { motion } from 'framer-motion';
import ArticleCard from './ArticalCard';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface BlogProps {
  articles: any[];
}

export default function BlogCatalog({ articles }: BlogProps) {
  useEffect(() => {
    // Initialize AOS with a duration and "once: true" so animations only run once per element
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <div>
      <div className="flex items-baseline justify-between pt-24 pb-6">
        <div></div>
        <div className="flex items-center justify-center">
          <Menu as="div" className="relative inline-block text-left mr-10">
            <div>
              <MenuButton className="group inline-flex justify-center text-sm font-bold text-gray-700 hover:text-gray-900" data-aos="fade-left">
                Sort by
                <ChevronDownIcon
                  aria-hidden="true"
                  className="-mr-1 ml-1 size-5 shrink-0 text-black"
                />
              </MenuButton>
            </div>
          </Menu>
        </div>
      </div>

      <section aria-labelledby="blogs-heading" className="pt-6 pb-24">
        <h2 id="blogs-heading" className="sr-only">
          Blogs
        </h2>
        <div
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {articles.map((article, index) => (
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
      </section>
    </div>
  );
}