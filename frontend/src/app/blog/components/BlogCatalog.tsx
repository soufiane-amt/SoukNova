'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { poppins } from '@/layout';
import { Article } from '../../../types/types';
import ArticleCard from './ArticalCard';
import { Box, Pagination } from '@mui/material';

const PAGE_SIZE = 16;
interface BlogProps {
  articles: Article[];
}

export default function BlogCatalog({ articles }: BlogProps) {
  const [itemsList, setItemsList] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [pagesCount, setPagesCount] = useState(0);
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  useEffect(() => {
    const fetchPageCatalog = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/article?page=${page}&pageSize=${PAGE_SIZE}`,
      );

      const data = await response.json();
      setPagesCount(data.totalPages);
      setItemsList(data.articles);
    };
    fetchPageCatalog();
  }, [page]);
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
    window.scrollTo({ top: 50, behavior: 'smooth' });
  };

  useEffect(() => {
    setPage(1);
  }, [articles]);

  return (
    <div>
      <div className="flex items-baseline justify-between pt-24 pb-6">
        <div>
          <p className={`font-semibold border-b ${poppins.className}`}>
            All Blogs
          </p>
        </div>
      </div>

      <section aria-labelledby="blogs-heading" className="pt-6 pb-24">
        <h2 id="blogs-heading" className="sr-only">
          Blogs
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {itemsList.map((article: any, index: number) => (
            <div
              key={article.id}
              data-aos="fade-up"
              data-aos-delay={`${index * 50}`}
              className="flex justify-center"
            >
              <ArticleCard
                id={article.id}
                title={article.title}
                image={article.image}
                date={article.date}
              />
            </div>
          ))}
        </div>

        {pagesCount > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
            <Pagination
              count={pagesCount}
              page={page}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
            />
          </Box>
        )}
      </section>
    </div>
  );
}
