import { poppins } from '@/layout';
import Image from 'next/image';
import Link from 'next/link';

interface ArticleCardProps {
  id: string;
  title: string;
  image: string;
  date: string;
}

function ArticleCard({ id, title, image, date }: ArticleCardProps) {
  const formattedDate = date.slice(0, -5);
  return (
    <Link
      href={`/blog/${id}`}
      className="group w-full max-w-[300px] cursor-pointer mb-5 block"
      title={title}
    >
      <article>
        <div className="relative w-full h-[250px] overflow-hidden rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300">
          <Image
            src={image ?? null}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="mt-3 ">
          <p
            className={` ${poppins.className} mb-1 !font-medium !text-md !leading-snug line-clamp-2 transition-colors duration-300 group-hover:text-gray-700`}
          >
            {title}
          </p>
          <div className="flex gap-4">
            <p className=" !font-inter !text-xs text-gray-400">
              {formattedDate}
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default ArticleCard;
