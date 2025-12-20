'use client';
import { ArticleCard } from './ArticleCard';
import CustomButton from '../../../components/buttons/CustomButton';
import { poppins } from '@/layout';
import { useEffect, useState } from 'react';

interface ArticleSectionProps {
  articleId?: string;
}
export function ArticleSection({ articleId = "1" }: ArticleSectionProps) {
  const [articles, setArticles] = useState([]);
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/article/random/${articleId}`,
        );
        if (!response.ok) throw new Error('Network response was not ok');
        setArticles(await response.json());
      } catch (e) {
        console.error(e);
      }
    };
    fetchArticles();
  }, [articleId]);
  return (
    <section className="flex flex-col justify-center px-4 md:px-12 lg:px-25 max-w-screen-2xl mx-auto my-12">
      <div className="flex justify-between w-full items-center mb-7">
        <p className={`text-3xl font-medium ${poppins.className}`}>Articles</p>
        <CustomButton label="More articles" href="/blog" />
      </div>

      <div className=" flex flex-col xl:flex-row items-center justify-between gap-x-5">
        {articles.map((item: any, index: number) => (
          <div key={item.id} data-aos="fade-up" data-aos-delay={index * 150}>
            <ArticleCard id={item.id} title={item.title} image={item.image} />
          </div>
        ))}
      </div>
    </section>
  );
}
