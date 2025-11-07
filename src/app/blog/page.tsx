'use client';

import { useEffect, useState } from 'react';
import SectionShow from '../../components/ui/SectionShow';
import BlogCatalog from './components/BlogCatalog';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { SiteFooter } from '../../components/layout/SiteFooter';
import Loader from '../../components/feedback/loader/Loader';

const imageUrl = '/images/blog/ourBlogPage.png';

function BlogPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });

    const fetchArticals = async () => {
      try {
        const response = await fetch('/api/articles');

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setArticles(data);
      } catch (e:any) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchArticals();
  }, []);

  if (loading) {
    return <Loader/>;
  }
  if (error) return <div>Error: {error}</div>;

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
        <BlogCatalog articles={articles} />
      </div>
      <SiteFooter />
    </main>
  );
}

export default BlogPage;
