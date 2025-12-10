'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Traversal from '../../../components/ui/Traversal';
import { poppins } from '@/layout';
import Image from 'next/image';
import { SiteFooter } from '../../../components/layout/SiteFooter';
import ArticlMetaData from '../components/ArticlMetaData';
import Loader from '../../../components/feedback/loader/Loader';
import { ArticleSection } from '@/home/components/ArticleSection';

function ArticlePage() {
  const { id } = useParams();
  const [articleData, setArticleData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });

    if (!id) return;

    const fetchArticle = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/article/${id}`,
        );
        if (!response.ok) {
          throw new Error('Failed to fetch product data.');
        }

        const data = await response.json();

        setArticleData(data);
      } catch (err) {
        console.error(err);
        setError('Product not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return <Loader />;
  }
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <main>
      <div className="mx-[160px] max-lg:mx-20 max-md:mx-10 max-sm:mx-8 mb-20 mt-10  max-xl:mx-20">
        <div data-aos="fade-down" data-aos-delay="200">
          <Traversal
            items={[
              { label: 'Home', href: '/' },
              { label: 'Blog', href: '/' },
              { label: articleData.title },
            ]}
          />
        </div>

        <div data-aos="fade-up" data-aos-delay="400">
          <div className="my-5">
            <p className="text-xs font-semibold">ARTICLE</p>
          </div>
          <p
            data-aos="fade-up"
            data-aos-delay="500"
            className={`${poppins.className} text-[54px] font-medium leading-[58px] tracking-[-1px] max-sm:text-[26px] max-sm:leading-[34px]`}
          >
            {articleData.title}
          </p>
          <ArticlMetaData author={articleData.author} date={articleData.date} />
        </div>

        <div className="my-10">
          <div
            data-aos="fade-in"
            className="h-[647px] w-full overflow-hidden max-sm:h-[320px]"
          >
            <Image
              width={500}
              height={600}
              src={articleData.images[0]}
              alt={articleData.title}
              className="w-full max-sm:h-[320px] rounded-lg object-cover"
            />
          </div>


          <p data-aos="fade-up" className={`${poppins.className} my-5`}>
            {articleData.article_paragraphs[0]}
          </p>

          <div data-aos="fade-up" className="md:flex my-10 w-full gap-4">
            <div
              data-aos="fade-right"
              data-aos-delay="200"
              className="relative w-full md:w-1/2 h-[647px] max-sm:h-[320px] md:mb-0 mb-4"
            >
              <Image
                src={articleData.images[1]}
                alt={articleData.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div
              data-aos="fade-left"
              data-aos-delay="200"
              className="relative w-full md:w-1/2 h-[647px] max-sm:h-[320px]"
            >
              <Image
                src={articleData.images[2]}
                alt={articleData.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>

          <div data-aos="fade-up" className={`${poppins.className} mb-2`}>
            <p>{articleData.article_paragraphs[1]}</p>
          </div>

          <div
            data-aos="fade-up"
            className="flex flex-col items-start md:flex-row my-10 w-full h-[647px] overflow-hidden max-sm:h-[320px] gap-4"
          >
            <div
              data-aos="zoom-in"
              data-aos-delay="200"
              className="relative md:w-2/3 w-full h-full rounded-lg overflow-hidden"
            >
              <Image
                src={articleData.images[3]}
                alt={articleData.title}
                fill
                className="object-cover"
              />
            </div>
            <div
              data-aos="fade-right"
              data-aos-delay="200"
              className={`md:w-1/3 w-full flex items-center ${poppins.className}`}
            >
              <p>{articleData.article_paragraphs[2]}</p>
            </div>
          </div>

          <div data-aos="fade-up" className={`${poppins.className} mb-2`}>
            <p>{articleData.article_paragraphs[3]}</p>
          </div>
        </div>
      </div>
      <ArticleSection articleId={id?.toString()}/>

      <SiteFooter />
    </main>
  );
}

export default ArticlePage;
