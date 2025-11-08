import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

interface SearchedItemsListProps {
  items: { id: string; title: string; image: string }[];
  toggleSearch: () => void;
  isDesktop: boolean;
  toggleDrawer?: (state: boolean) => () => void;
}

function SearchedItemsList({
  items,
  toggleSearch,
  isDesktop,
  toggleDrawer,
}: SearchedItemsListProps) {
  if (!items || items.length === 0) return null;

  const handleResetUI = () => {
    if (toggleDrawer) toggleDrawer(false)();
    else toggleSearch();
  };
  return (
    <div
      className={`${
        isDesktop ? 'top-23 right-0' : 'z-50'
      } absolute   w-[280px] max-h-[500px] bg-white shadow-lg rounded-lg border border-gray-200 `}
    >
      <ul>
        {items.slice(0, 15).map((item: any) => (
          <Link key={item.title} href={`/product/${item.id}`}>
            <li
              onClick={handleResetUI}
              className="py-4 hover:bg-gray-100 rounded-lg cursor-pointer  text-gray-800"
            >
              <div className="flex h-8 p-3 items-center space-x-4">
                <Image
                  width={50}
                  height={50}
                  src={item.primary_image}
                  alt={item.title}
                  className="w-10 h-10"
                />
                <p className="font-semibold truncate">{item.title}</p>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}

interface SearchContainerProps {
  products: any;
  toggleSearch: () => void;
  isDesktop: boolean;
  toggleDrawer?: (state: boolean) => () => void;
}
export default function SearchContainer({
  products,
  toggleSearch,
  isDesktop,
  toggleDrawer,
}: SearchContainerProps) {
  const [searchText, setSearchText] = useState('');
  const containerRef = useRef<any>(null);

  const handleSearchTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const filteredItems = products.filter(
    (item: any) =>
      searchText && item.title.toLowerCase().includes(searchText.toLowerCase()),
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        toggleSearch();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [toggleSearch]);

  return (
    <div ref={containerRef}>
      <input
        className={`${
          isDesktop ? 'absolute top-10 right-0' : ''
        }  bg-white border border-gray-400 rounded text-gray-900 p-2 w-70`}
        placeholder="Search"
        value={searchText}
        onChange={handleSearchTyping}
      />
      <SearchedItemsList
        items={filteredItems}
        toggleSearch={toggleSearch}
        isDesktop={isDesktop}
        toggleDrawer={toggleDrawer}
      />
    </div>
  );
}
