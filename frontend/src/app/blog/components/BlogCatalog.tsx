'use client';
import * as React from 'react';
import 'aos/dist/aos.css';
import { poppins } from '@/layout';
import ArticleCard from './ArticalCard';
import CustomPagination from '../../../components/ui/CustomPagination';

interface BlogProps {
  itemsData: any;
  page: number;
  handlePageChange: (e: React.ChangeEvent<unknown>, v: number) => void;
}

export default function BlogCatalog({
  itemsData,
  page,
  handlePageChange,
}: BlogProps) {
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
          {itemsData.articles.map((article: any, index: number) => (
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
        <CustomPagination
          pagesCount={itemsData.totalPages}
          page={page}
          handlePageChange={handlePageChange}
        />
      </section>
    </div>
  );
}
