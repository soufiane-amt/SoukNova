'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import ArticleCard from './ArticalCard';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { poppins } from '@/layout';
import { Article } from '../../../types/types';
import ShowMoreButton from '../../../components/ui/ShowMoreButton';

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
  const [showCount, setShowCount] = useState(16);

  const handleShowMore = () => {
    const newShowCount = Math.min(showCount + 16, articles.length);
    setShowCount(newShowCount);
  };
  const visibleArticles = React.useMemo(
    () => articles.slice(0, showCount),
    [articles, showCount],
  );

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
          {visibleArticles.map((article, index) => (
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
          <ShowMoreButton handleShowMore={handleShowMore} />
        )}
      </section>
    </div>
  );
}
