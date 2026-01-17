'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import 'aos/dist/aos.css';
import Traversal from '../../../components/ui/Traversal';
import { poppins } from '@/layout';
import Image from 'next/image';
import { SiteFooter } from '../../../components/layout/SiteFooter';
import ArticlMetaData from '../components/ArticlMetaData';
import { ArticleSection } from '@/home/components/ArticleSection';
import { ArticleType } from '../../../types/article.dt';
import { Skeleton } from '@mui/material';
import { Link } from 'lucide-react';

// Skeleton loader for the article page
function ArticlePageSkeleton() {
  return (
    <div className="px-4 sm:px-6 md:px-12 lg:px-20 xl:px-40 max-w-screen-2xl mx-auto py-8">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2 mb-8">
        <Skeleton variant="text" width={50} height={20} />
        <Skeleton variant="text" width={20} height={20} />
        <Skeleton variant="text" width={40} height={20} />
        <Skeleton variant="text" width={20} height={20} />
        <Skeleton variant="text" width={150} height={20} />
      </div>

      {/* Article badge */}
      <Skeleton
        variant="rounded"
        width={80}
        height={28}
        sx={{ borderRadius: '9999px', mb: 3 }}
      />

      {/* Title */}
      <Skeleton variant="text" width="90%" height={60} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="70%" height={60} sx={{ mb: 3 }} />

      {/* Meta */}
      <div className="flex items-center gap-4 mb-8">
        <Skeleton variant="circular" width={48} height={48} />
        <div>
          <Skeleton variant="text" width={120} height={20} />
          <Skeleton variant="text" width={100} height={16} />
        </div>
      </div>

      {/* Hero image */}
      <Skeleton
        variant="rectangular"
        sx={{ width: '100%', height: 500, borderRadius: '1rem', mb: 6 }}
      />

      {/* Content */}
      <Skeleton variant="text" width="100%" height={24} />
      <Skeleton variant="text" width="100%" height={24} />
      <Skeleton variant="text" width="95%" height={24} />
      <Skeleton variant="text" width="80%" height={24} sx={{ mb: 4 }} />

      {/* Image grid */}
      <div className="grid grid-cols-2 gap-4 my-8">
        <Skeleton
          variant="rectangular"
          sx={{ width: '100%', height: 300, borderRadius: '0.75rem' }}
        />
        <Skeleton
          variant="rectangular"
          sx={{ width: '100%', height: 300, borderRadius: '0.75rem' }}
        />
      </div>
    </div>
  );
}

// Error state component
function ErrorState({ message }: { message: string }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2
          className={`text-2xl font-semibold text-[#141718] mb-2 ${poppins.className}`}
        >
          Article not found
        </h2>
        <p className="text-[#6C7275] mb-6">{message}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#141718] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#2d3033] transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Home
        </Link>
      </div>
    </div>
  );
}

function ArticlePage() {
  const { id } = useParams();
  const [articleData, setArticleData] = useState<ArticleType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchArticle = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/article/${id}`,
        );
        if (!response.ok) {
          throw new Error('Failed to fetch article data.');
        }

        const data = await response.json();
        setArticleData(data);
      } catch (err) {
        console.error(err);
        setError('Article not found or failed to load.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  // Share logic
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = articleData?.title || 'Check out this article!';

  const handleShare = (platform: 'twitter' | 'facebook' | 'linkedin') => {
    let url = '';
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(shareTitle);
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`;
        break;
    }
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=500');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      setCopySuccess(false);
      console.error('Failed to copy link: ', err);
    }
  };

  if (isLoading) {
    return (
      <main className="bg-white min-h-screen">
        <ArticlePageSkeleton />
        <SiteFooter />
      </main>
    );
  }

  if (error || !articleData) {
    return (
      <main className="bg-white min-h-screen">
        <ErrorState message={error || 'Article not found'} />
        <SiteFooter />
      </main>
    );
  }

  return (
    <main className="bg-white min-h-screen">
      {/* Article Content */}
      <article className="px-4 sm:px-6 md:px-12 lg:px-20 xl:px-40 max-w-screen-2xl mx-auto py-8">
        {/* Breadcrumb */}
        <div data-aos="fade-down" data-aos-delay="100">
          <Traversal
            items={[
              { label: 'Home', href: '/' },
              { label: 'Blog', href: '/' },
              { label: articleData.title },
            ]}
          />
        </div>

        {/* Article Header */}
        <header className="mt-8 mb-10" data-aos="fade-up" data-aos-delay="200">
          {/* Category Badge */}
          <span className="inline-flex items-center px-4 py-1.5 bg-[#141718] text-white text-xs font-semibold rounded-full uppercase tracking-wider mb-6">
            Article
          </span>

          {/* Title */}
          <h1
            className={`${poppins.className} text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-semibold leading-tight lg:leading-[1.1] tracking-tight text-[#141718] mb-6`}
          >
            {articleData.title}
          </h1>

          {/* Author & Date */}
          <ArticlMetaData author={articleData.author} date={articleData.date} />
        </header>

        {/* Hero Image */}
        <div
          data-aos="fade-up"
          data-aos-delay="300"
          className="relative w-full aspect-[16/9] md:aspect-[2/1] rounded-2xl overflow-hidden mb-10"
        >
          {articleData.images?.[0] && (
            <Image
              src={articleData.images[0]}
              alt={articleData.title}
              fill
              priority
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          )}
        </div>

        {/* First Paragraph */}
        {articleData.article_paragraphs?.[0] && (
          <div
            data-aos="fade-up"
            data-aos-delay="400"
            className={`${poppins.className} prose prose-lg max-w-none mb-12`}
          >
            <p className="text-[#343839] text-base md:text-lg leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:text-[#141718] first-letter:mr-2 first-letter:float-left">
              {articleData.article_paragraphs[0]}
            </p>
          </div>
        )}

        {/* Image Grid - Two Images */}
        {(articleData.images?.[1] || articleData.images?.[2]) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 my-12">
            {articleData.images?.[1] && (
              <div
                data-aos="fade-right"
                data-aos-delay="200"
                className="relative aspect-[4/5] rounded-2xl overflow-hidden group"
              >
                <Image
                  src={articleData.images[1]}
                  alt={`${articleData.title} - Image 2`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            )}
            {articleData.images?.[2] && (
              <div
                data-aos="fade-left"
                data-aos-delay="300"
                className="relative aspect-[4/5] rounded-2xl overflow-hidden group"
              >
                <Image
                  src={articleData.images[2]}
                  alt={`${articleData.title} - Image 3`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            )}
          </div>
        )}

        {/* Second Paragraph */}
        {articleData.article_paragraphs?.[1] && (
          <div
            data-aos="fade-up"
            className={`${poppins.className} prose prose-lg max-w-none mb-12`}
          >
            <p className="text-[#343839] text-base md:text-lg leading-relaxed">
              {articleData.article_paragraphs[1]}
            </p>
          </div>
        )}

        {/* Featured Image with Text */}
        {(articleData.images?.[3] || articleData.article_paragraphs?.[2]) && (
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 my-12 items-center"
            data-aos="fade-up"
          >
            {articleData.images?.[3] && (
              <div
                data-aos="zoom-in"
                data-aos-delay="200"
                className="md:col-span-2 relative aspect-[4/3] rounded-2xl overflow-hidden group"
              >
                <Image
                  src={articleData.images[3]}
                  alt={`${articleData.title} - Featured`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            )}
            {articleData.article_paragraphs?.[2] && (
              <div
                data-aos="fade-left"
                data-aos-delay="300"
                className={`${poppins.className} md:col-span-1`}
              >
                <div className="bg-[#F9F9F9] rounded-2xl p-6 md:p-8">
                  <svg
                    className="w-8 h-8 text-[#141718] mb-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-[#343839] text-base leading-relaxed italic">
                    {articleData.article_paragraphs[2]}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Final Paragraph */}
        {articleData.article_paragraphs?.[3] && (
          <div
            data-aos="fade-up"
            className={`${poppins.className} prose prose-lg max-w-none mb-12`}
          >
            <p className="text-[#343839] text-base md:text-lg leading-relaxed">
              {articleData.article_paragraphs[3]}
            </p>
          </div>
        )}

        {/* Share Section */}
        <div
          data-aos="fade-up"
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-8 border-t border-gray-100 mt-12"
        >
          <p
            className={`${poppins.className} text-sm text-[#6C7275] font-medium`}
          >
            Share this article
          </p>
          <div className="flex items-center gap-3">
            <button
              aria-label="Share on Twitter"
              onClick={() => handleShare('twitter')}
              className="w-10 h-10 rounded-full bg-[#F5F5F5] hover:bg-[#141718] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </button>
            <button
              aria-label="Share on Facebook"
              onClick={() => handleShare('facebook')}
              className="w-10 h-10 rounded-full bg-[#F5F5F5] hover:bg-[#141718] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </button>
            <button
              aria-label="Share on LinkedIn"
              onClick={() => handleShare('linkedin')}
              className="w-10 h-10 rounded-full bg-[#F5F5F5] hover:bg-[#141718] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </button>
            <button
              aria-label="Copy link"
              onClick={handleCopyLink}
              className={`w-10 h-10 rounded-full bg-[#F5F5F5] hover:bg-[#141718] hover:text-white flex items-center justify-center transition-colors cursor-pointer relative`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              {copySuccess && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#141718] text-white text-xs rounded px-2 py-1 shadow-lg animate-fade-in-out z-10 whitespace-nowrap">
                  Link copied!
                </span>
              )}
            </button>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      <section>
        <ArticleSection articleId={id?.toString()} />
      </section>

      <SiteFooter />
    </main>
  );
}

export default ArticlePage;
