import { poppins } from '@/layout';
import { Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

interface ArticleCardProps {
  id: string;
  title: string;
  image: string;
  date: string;
}

function ArticleCard({ id, title, image, date }: ArticleCardProps) {
  return (
    <Link
      href={`/blog/${id}`}
      className="group w-full max-w-[300px] cursor-pointer mb-5 block"
      title={title}
    >
      <article>
        <div className="relative w-full h-[250px] overflow-hidden rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="mt-3">
          <h3 className="mb-1">
            <p
              className={` ${poppins.className} !font-medium !text-md !leading-snug line-clamp-2 transition-colors duration-300 group-hover:text-gray-700`}
            >
              {title}
            </p>
          </h3>
          <div className="flex gap-4">
            <Typography
              component="span"
              className=" !font-inter !text-xs text-gray-400"
            >
              {date.slice(0, -5)}
            </Typography>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default ArticleCard;
