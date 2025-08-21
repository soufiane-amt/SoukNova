'use client';

import { useEffect, useState } from 'react';
import SectionShow from '../../components/ui/SectionShow';
import BlogCatalog from './components/BlogCatalog';
import CircularIndeterminate from '../../components/ui/CircularIndeterminate';

const imageUrl = '/images/blog/ourBlogPage.png';

const API_URL =
  'https://oowcjcmdcfitnnsqfohw.supabase.co/rest/v1/new%20articles?select=*';
const API_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vd2NqY21kY2ZpdG5uc3Fmb2h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA4MTI3MTksImV4cCI6MjA0NjM4ODcxOX0.bx4a1dNx8g-BZX2KWceWBuRlPwAqgxhZ80i7L4K8M7Y';

const headers = {
  apikey: API_KEY,
  Authorization: `Bearer ${API_KEY}`,
  Accept: 'application/json', // Supabase will return JSON by default, but it's good practice to specify
  'Accept-Profile': 'public',
};

function BlogPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticals = async () => {
      try {
        const response = await fetch(API_URL, {
          method: 'GET',
          headers: headers,
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setArticles(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticals();
  }, []);


  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <CircularIndeterminate />
      </div>
    );
  }
  if (error) return <div>Error: {error}</div>;


  return (
    <div className="mx-10 md:mx-20">
      <SectionShow
        imageUrl={imageUrl}
        head="Blog"
        desc="Home ideas and design inspiration"
      />
      <BlogCatalog articles={articles}/>
    </div>
  );
}

export default BlogPage;
