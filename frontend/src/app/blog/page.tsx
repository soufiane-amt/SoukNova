'use client';

import { useEffect, useState } from 'react';
import SectionShow from '../../components/ui/SectionShow';
import BlogCatalog from './components/BlogCatalog';
import 'aos/dist/aos.css';
import { SiteFooter } from '../../components/layout/SiteFooter';
import { usePagination } from '../../hooks/usePagination';
import { ArticleType } from '../../types/article.dt';
import { BLOG_PAGE_IMAGE } from '../../constants/assets';
import usePageResizer from '../../hooks/usePageResizer';

function BlogPage() {
  const [itemsData, setItemsData] = useState<{
    articles: ArticleType[];
    totalPages: number;
  } | null>(null);
  const { page, handlePageChange } = usePagination();
  const { pageSize } = usePageResizer(handlePageChange);

  useEffect(() => {
    const fetchPageCatalog = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/article?page=${page}&pageSize=${pageSize}`,
      );

      const data = await response.json();
      setItemsData(data);
    };
    fetchPageCatalog();
  }, [page, pageSize]);

  return (
    <main>
      <div className="mx-10 md:mx-20">
        <div data-aos="fade-up">
          <SectionShow
            imageUrl={BLOG_PAGE_IMAGE}
            head="Blog"
            desc="Home ideas and design inspiration"
          />
        </div>
        <BlogCatalog
          itemsData={itemsData}
          page={page}
          pageSize={pageSize}
          handlePageChange={handlePageChange}
        />
      </div>
      <SiteFooter />
    </main>
  );
}

export default BlogPage;
