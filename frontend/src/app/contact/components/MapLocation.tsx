import Image from 'next/image';
const imageMap = '/images/contact/map.png';

function MapLocation() {
  return (
    <div
      className="relative md:w-2/5"
      data-aos="fade-left"
      data-aos-delay="200"
    >
      <Image
        src={imageMap}
        alt="Company location"
        width={500}
        height={500}
        className="max-h-[422.4px] min-h-[422.4px] w-[548px] max-2xl:w-full max-sm:h-[326.5px]"
      />
      <svg
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        width="65"
        height="64"
        viewBox="0 0 65 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M32.5 58.6654C41.5 58.6654 56.5 42.1269 56.5 29.0357C56.5 15.9445 45.7548 5.33203 32.5 5.33203C19.2452 5.33203 8.5 15.9445 8.5 29.0357C8.5 42.1269 23.5 58.6654 32.5 58.6654ZM32.5 37.332C36.9183 37.332 40.5 33.7503 40.5 29.332C40.5 24.9138 36.9183 21.332 32.5 21.332C28.0817 21.332 24.5 24.9138 24.5 29.332C24.5 33.7503 28.0817 37.332 32.5 37.332Z"
          fill="#141718"
        />
        <circle cx="32.5" cy="29.6523" r="20" fill="#141718" />
        <path
          d="M40.5 29.6523V35.6523C40.5 37.8615 38.7091 39.6523 36.5 39.6523H28.5C26.2909 39.6523 24.5 37.8615 24.5 35.6523V29.6523"
          stroke="#FEFEFE"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M37.2688 19.6523H27.7313C25.9139 19.6523 24.2797 20.8971 23.6047 22.7954L22.8467 24.9272C22.6173 25.5725 22.4587 26.2631 22.626 26.9272C23.0224 28.5001 24.3083 29.6523 25.8334 29.6523C27.6743 29.6523 29.1667 27.9734 29.1667 25.9023C29.1667 27.9734 30.6591 29.6523 32.5 29.6523C34.341 29.6523 35.8334 27.9734 35.8334 25.9023C35.8334 27.9734 37.3257 29.6523 39.1667 29.6523C40.6918 29.6523 41.9777 28.5001 42.374 26.9272C42.5414 26.2631 42.3828 25.5725 42.1533 24.9272L41.3953 22.7954C40.7204 20.8971 39.0861 19.6523 37.2688 19.6523Z"
          stroke="#FEFEFE"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M29.5 36.6523C29.5 34.9955 30.8431 33.6523 32.5 33.6523C34.1569 33.6523 35.5 34.9955 35.5 36.6523V39.6523H29.5V36.6523Z"
          stroke="#FEFEFE"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default MapLocation;
