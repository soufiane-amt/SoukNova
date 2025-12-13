'use client';

import { useEffect, useState } from 'react';
import SectionShow from '../../components/ui/SectionShow';
import BlogCatalog from './components/BlogCatalog';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { SiteFooter } from '../../components/layout/SiteFooter';
import Loader from '../../components/feedback/loader/Loader';

const imageUrl = '/images/blog/ourBlogPage.png';
const PAGE_SIZE = 16;

function BlogPage() {
  const [itemsData, setItemsData] = useState<any>();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setItemsData(data);
      setLoading(false);
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

  if (loading) {
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
