import { Typography } from '@mui/material';
import Image from 'next/image';

const imageUrl = '/images/shop/shopPage.png';

export default function ShopShow() {
  return (
    <div className="relative h-96 overflow-hidden">
      <Image
        className="w-full h-full object-cover"
        src={imageUrl}
        alt="Side visual"
        width={600}
        height={400}
        priority
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center">
        <div className="mb-5 ">
          <ol className="flex justify-center align-center ">
            <li>
              <a href="#home" className="text-sm font-medium text-gray-500">
                Home
              </a>
            </li>
            <li className="self-center">
              <span className="text-gray-400">
                <svg
                  className="h-5 w-5 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </li>

            <li>
              <a
                href="#"
                className="text-sm font-medium text-gray-700 hover:text-gray-700"
              >
                Shop
              </a>
            </li>
          </ol>
        </div>
        <div className="flex  justify-center text-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-medium mb-5">Shop Page</h1>
            <Typography>Let’s design the place you always imagined.</Typography>
          </div>
        </div>
      </div>
    </div>
  );
}
