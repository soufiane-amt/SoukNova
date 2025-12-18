'use client';

import { useEffect, useState } from 'react';
import SectionShow from '../../components/ui/SectionShow';
import BlogCatalog from './components/BlogCatalog';
import 'aos/dist/aos.css';
import { SiteFooter } from '../../components/layout/SiteFooter';
import Loader from '../../components/feedback/loader/Loader';
import { usePagination } from '../../hooks/usePagination';
import { ArticleType } from '../../types/article.dt';

const imageUrl = '/images/blog/ourBlogPage.png';
const PAGE_SIZE = 16;

function BlogPage() {
  const [itemsData, setItemsData] = useState<{
    articles: ArticleType[];
    totalPages: number;
  } | null>();
  const { page, handlePageChange } = usePagination();

  useEffect(() => {
    const fetchPageCatalog = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/article?page=${page}&pageSize=${PAGE_SIZE}`,
      );

      const data = await response.json();
      setItemsData(data);
    };
    fetchPageCatalog();
  }, [page]);

  if (!itemsData) {
    return <Loader />;
  }

  return (
    <main>
      <div className="mx-10 md:mx-20">
        <div data-aos="fade-up">
          <SectionShow
            imageUrl={imageUrl}
            head="Blog"
            desc="Home ideas and design inspiration"
          />
        </div>
        <BlogCatalog
          itemsData={itemsData}
          page={page}
          handlePageChange={handlePageChange}
        />
      </div>
      <SiteFooter />
    </main>
  );
}

export default BlogPage;
