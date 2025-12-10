'use client';
import * as React from 'react';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { poppins } from '@/layout';
import { Article } from '../../../types/types';
import ShowMoreButton from '../../../components/buttons/ShowMoreButton';
import { useShowMore } from '../../../hooks/useShowMore';
import ArticleCard from './ArticalCard';

interface BlogProps {
  articles: Article[];
}

export default function BlogCatalog({ articles }: BlogProps) {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);
  const { visibleItems, handleShowMore, hasMore } = useShowMore(articles, 12);

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
          {visibleItems.map((article: any, index: number) => (
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
        {hasMore && <ShowMoreButton handleShowMore={handleShowMore} />}
      </section>
    </div>
  );
}
