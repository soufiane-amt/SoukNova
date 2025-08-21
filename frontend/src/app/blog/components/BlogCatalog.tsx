'use client';
import * as React from 'react';
import { useState } from 'react';
import { Menu, MenuButton } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Squares3X3IconButton } from '../../../components/ui/squares/Squares3X3Icon';
import { Squares2X2IconButton } from '../../../components/ui/squares/Squares2X2Icon';
import { Grid } from '@mui/material';
import ArticalCard from './ArticalCard';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ArticleCard from './ArticalCard';

interface BlogProps {
  articles: any[]; // Changed from empty array to 'any[]' for better type clarity
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Stagger the animation of child elements
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export default function BlogCatalog({ articles }: BlogProps) {
  return (
    <div>
        <div className="flex items-baseline justify-between pt-24 pb-6">
          <div></div>
          <div className="flex items-center justify-center">
            <Menu as="div" className="relative inline-block text-left mr-10">
              <div>
                <MenuButton className="group inline-flex justify-center text-sm font-bold text-gray-700 hover:text-gray-900">
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

          <motion.div
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {articles.map((article) => (
              <motion.div
                key={article.id}
                variants={itemVariants}
                style={{ willChange: 'transform, opacity' }}
              >
                <ArticleCard
                  id={article.id}
                  title={article.title}
                  image={article.images[0]}
                  date={article.date}
                />
              </motion.div>
            ))}
          </motion.div>
        </section>
    </div>
  );
}
