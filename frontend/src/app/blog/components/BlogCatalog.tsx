'use client';
import * as React from 'react';
import 'aos/dist/aos.css';
import { poppins } from '@/layout';
import ArticleCard from './ArticalCard';
import CustomPagination from '../../../components/ui/CustomPagination';
import { ArticleType } from '../../../types/article.dt';
import { Skeleton } from '@mui/material';

function ArticleCardSkeleton() {
  return (
    <div className="w-full max-w-sm ">
      <Skeleton
        variant="rectangular"
        animation="wave"
        className="w-full rounded-lg"
        sx={{ height: 250, borderRadius: '0.5rem' }}
      />
      <Skeleton
        variant="text"
        animation="wave"
        width="70%"
        height={28}
        className="mt-4"
      />
      <Skeleton
        variant="text"
        animation="wave"
        width="40%"
        height={20}
        className="mt-2"
      />
    </div>
  );
}

interface BlogProps {
  itemsData: {
    articles: ArticleType[];
    totalPages: number;
  } | null;
  pageSize: number;
  page: number;
  handlePageChange: (e: React.ChangeEvent<unknown>, v: number) => void;
}

export default function BlogCatalog({
  itemsData,
  page,
  handlePageChange,
  pageSize,
}: BlogProps) {
  return (
    <div>
      <div className="flex items-baseline justify-between pt-24 pb-6">
        <div>
          <p className={`font-semibold border-b ${poppins.className}`}>
            Published articles:
          </p>
        </div>
      </div>

      <section aria-labelledby="blogs-heading" className="pt-6 pb-24">
        <h2 id="blogs-heading" className="sr-only">
          Blogs
        </h2>
        <div className=" grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6">
          {itemsData && (itemsData?.articles?.length ?? 0) > 0 ? (
            <>
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

              <div className="col-span-full flex justify-center mt-6">
                <CustomPagination
                  pagesCount={itemsData.totalPages}
                  page={page}
                  handlePageChange={handlePageChange}
                />
              </div>
            </>
          ) : (
            Array.from({ length: pageSize }).map((_, idx) => (
              <div key={`skeleton-${idx}`} className="flex justify-center">
                <ArticleCardSkeleton />
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
