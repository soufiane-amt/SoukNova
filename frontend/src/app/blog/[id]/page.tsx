'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Traversal from '../../../components/ui/Traversal';
import { poppins } from '@/layout';
import Image from 'next/image';
import { ArticleCard } from '@/home/components/ArticleCard';
import CustomButton from '../../../components/ui/CustomButton';
import { SiteFooter } from '../../../components/layout/SiteFooter';
import { ARTICLES } from '../../../constants/articalList';
import Loader from '../../../components/ui/loader/Loader';
import ArticlMetaData from '../components/ArticlMetaData';

function articalPage() {
  const { id } = useParams();
  const [articalData, setArticalData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });

    if (!id) return;

    const fetchArtical = async () => {
      try {
        const response = await fetch(`/api/articles/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product data.');
        }

        const data = await response.json();
        if (data.length > 0) {
          setArticalData(data[0]);
        } else {
          setArticalData(null);
        }
      } catch (err) {
        setError('Product not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };

    fetchArtical();
  }, [id]);

  if (loading) {
    return <Loader />;
  }
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <main>
      <div className="mx-[160px] max-lg:mx-20 max-md:mx-10 max-sm:mx-8 mb-20 mt-4 max-xl:mx-20">
        <div data-aos="fade-down" data-aos-delay="200">
          <Traversal
            items={[
              { label: 'Home', href: '/' },
              { label: 'Blog', href: '/' },
              { label: articalData.title },
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
            {articalData.title}
          </p>
          <ArticlMetaData author={articalData.author} date={articalData.date} />
        </div>

        <div className="my-10">
          <div
            data-aos="fade-in"
            className="h-[647px] w-full overflow-hidden max-sm:h-[320px]"
          >
            <Image
              width={500}
              height={600}
              src={articalData.images[0]}
              alt={articalData.title}
              className="w-full max-sm:h-[320px] rounded-lg object-cover"
            />
          </div>

          <p data-aos="fade-up" className={`${poppins.className} my-5`}>
            {articalData.article_paragraphs[0]}
          </p>

          <div data-aos="fade-up" className="md:flex my-10 w-full gap-4">
            <div
              data-aos="fade-right"
              data-aos-delay="200"
              className="relative w-full md:w-1/2 h-[647px] max-sm:h-[320px] md:mb-0 mb-4"
            >
              <Image
                src={articalData.images[1]}
                alt={articalData.title}
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
                src={articalData.images[2]}
                alt={articalData.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>

          {articalData.article_paragraphs.slice(1, 3).map((para, index) => (
            <p
              data-aos="fade-up"
              key={index}
              className={`${poppins.className} mb-2`}
            >
              {para}
            </p>
          ))}

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
                src={articalData.images[3]}
                alt={articalData.title}
                fill
                className="object-cover"
              />
            </div>
            <div
              data-aos="fade-right"
              data-aos-delay="200"
              className="md:w-1/3 w-full flex items-center"
            >
              <p className={`${poppins.className}`}>
                {articalData.article_paragraphs[3]}
              </p>
            </div>
          </div>

          {articalData.article_paragraphs.slice(4, 10).map((para, index) => (
            <p
              data-aos="fade-up"
              key={index}
              className={`${poppins.className} mb-2`}
            >
              {para}
            </p>
          ))}
        </div>

        <div data-aos="fade-up" className="mt-20">
          <div className="flex justify-between w-full mb-5">
            <p
              data-aos="fade-right"
              data-aos-delay="200"
              className={`${poppins.className} font-semibold md:block hidden text-3xl`}
            >
              You might also like
            </p>
            <div data-aos="fade-left" data-aos-delay="200">
              <CustomButton label="More articles" href="/blog" />
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-start gap-x-5">
            {ARTICLES.slice(0, 3).map((item, index) => (
              <div
                key={item.id}
                data-aos="fade-up"
                data-aos-delay={index * 100} // Stagger effect
              >
                <ArticleCard
                  title={item.title}
                  image={item.image}
                  date={item.date}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}

export default articalPage;
