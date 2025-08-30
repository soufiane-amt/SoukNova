'use client';
import * as React from 'react';

import { useState } from 'react';
import {
  Disclosure,
  DisclosureButton,
  Menu,
  MenuButton,
  MenuItems,
} from '@headlessui/react';
import { ChevronDownIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { Squares2X2IconButton } from '../../../components/ui/squares/Squares2X2Icon';
import { Squares3X3IconButton } from '../../../components/ui/squares/Squares3X3Icon';
import { ProductCard } from '../../../components/ui/ProductCard';
import { Grid } from '@mui/material';
import { FormControl, MenuItem, Select } from '@mui/material';
import Link from 'next/link';

const sortOptions = [
  { label: 'Rate_desc', value: 'Rate.desc' },
  { label: 'Price_asc', value: 'Price.asc' },
  { label: 'Price_desc', value: 'Price.desc' },
  { label: 'Date_asc', value: 'Date.asc' },
  { label: 'Date_desc', value: 'Date.desc' },
];
const priceFilter = {
  id: 'price',
  name: 'PRICE',
  options: [
    {
      value: { minPrice: 0, maxPrice: Infinity },
      label: 'All Price',
    },
    {
      value: { minPrice: 0, maxPrice: 99.99 },
      label: '$0.00 - 99.99',
    },
    {
      value: { minPrice: 100, maxPrice: 199.99 },
      label: '$100.00 - 199.99',
    },
    {
      value: { minPrice: 200, maxPrice: 299.99 },
      label: '$200.00 - 299.99',
    },
    {
      value: { minPrice: 300, maxPrice: 399.99 },
      label: '$300.00 - 399.99',
    },
    {
      value: { minPrice: 400, maxPrice: Infinity },
      label: '$400.00+',
    },
  ],
};

const subCategories = [
  { name: 'All Rooms', href: '#' },
  { name: 'Living Room', href: '#' },
  { name: 'Bedroom', href: '#' },
  { name: 'Kitchen', href: '#' },
  { name: 'Bathroom', href: '#' },
  { name: 'Dinning', href: '#' },
  { name: 'Outdoor', href: '#' },
];

function CheckComp() {
  return (
    <svg
      fill="none"
      viewBox="0 0 14 14"
      className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
    >
      <path
        d="M3 8L6 11L11 3.5"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-0 group-has-checked:opacity-100"
      />
      <path
        d="M3 7H11"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-0 group-has-indeterminate:opacity-100"
      />
    </svg>
  );
}
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface BasicDropdownFilterProps {
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
}

function BasicDropdownFilter({
  selectedCategory,
  setSelectedCategory,
}: BasicDropdownFilterProps) {
  console.log('selectedCategory : ', selectedCategory);
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <FormControl fullWidth>
      <Select
        labelId="category-select-label"
        value={selectedCategory}
        onChange={handleCategoryChange}
        sx={{ height: 45, borderRadius: 2, fontWeight: 'bold' }}
      >
        {subCategories.map((el) => (
          <MenuItem key={el.name} value={el.name}>
            {el.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

interface BasicDropdownPriceProps {
  priceRange: priceType;
  setPriceRange: React.Dispatch<React.SetStateAction<priceType>>;
}
function BasicDropdownPrice({
  priceRange,
  setPriceRange,
}: BasicDropdownPriceProps) {
  const handlePriceChange = (event: any) => {
    const [min, max] = event.target.value.split(',').map(Number);

    if (isNaN(min) || isNaN(max)) {
      setPriceRange(null);
    } else {
      setPriceRange([min, max]);
    }
  };

  return (
    <FormControl fullWidth>
      <Select
        labelId="price-select-label"
        value={priceRange ? priceRange.join(',') : '0,Infinity'} // default = All Price
        onChange={handlePriceChange}
        sx={{ height: 45, borderRadius: 2, fontWeight: 'bold' }}
      >
        {priceFilter.options.map((el, index) => (
          <MenuItem
            key={index}
            value={`${el.value.minPrice},${el.value.maxPrice}`}
          >
            {el.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

type priceType = [number, number] | null;

interface CategoryFilterProps {
  products: [];
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  priceRange: priceType;
  setPriceRange: React.Dispatch<React.SetStateAction<priceType>>;
  setSelectedOrder: React.Dispatch<React.SetStateAction<string>>;
}

export default function CategoryFilter({
  products,
  setSelectedCategory,
  selectedCategory,
  setPriceRange,
  priceRange,
  setSelectedOrder,
}: CategoryFilterProps) {
  const [selectedShape, setSelectedShape] = useState(0);
  const [showCount, setShowCount] = useState(9);

  const handleSelectShape = (index: number) => {
    setSelectedShape(index);
  };
  const handleShowMore = () => {
    const newShowCount = Math.min(showCount + 9, products.length);
    setShowCount(newShowCount);
  };

  return (
    <div>
      <main className="mx-auto max-6xl p6-4 sm:px-6 lg:px-8">
        <div className="md:flex w-full items-baseline justify-between  pt-24 pb-6">
          {selectedShape === 1 ? (
            <div className="flex flex-col md:flex-row w-full md:justify-between gap-4 md:w-1/3 gap-5 mb-5 md:mb-0">
              <BasicDropdownFilter
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
              <BasicDropdownPrice
                priceRange={priceRange}
                setPriceRange={setPriceRange}
              />
            </div>
          ) : (
            <div className="flex items-center space-x-2 ">
              <svg
                width="15"
                height="13"
                viewBox="0 0 20 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 4H4M4 4C4 5.65685 5.34315 7 7 7C8.65685 7 10 5.65685 10 4C10 2.34315 8.65685 1 7 1C5.34315 1 4 2.34315 4 4ZM1 14H7M16 14H19M16 14C16 15.6569 14.6569 17 13 17C11.3431 17 10 15.6569 10 14C10 12.3431 11.3431 11 13 11C14.6569 11 16 12.3431 16 14ZM13 4H19"
                  stroke="#141718"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <h2 className="font-bold text-center">Filter</h2>
            </div>
          )}

          <div className="flex items-center justify-center">
            <Menu as="div" className="relative inline-block text-left mr-10">
              <div>
                <MenuButton className="group inline-flex justify-center text-sm font-bold text-gray-700 hover:text-gray-900">
                  Sort by
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="-mr-1 ml-1 size-5 shrink-0  text-black"
                  />
                </MenuButton>
              </div>

              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                <div className="py-1">
                  {sortOptions.map((option) => (
                    <MenuItem key={option.label}>
                      <button onClick={() => setSelectedOrder(option.value)}>
                        {option.label}
                      </button>
                    </MenuItem>
                  ))}
                </div>
              </MenuItems>
            </Menu>
            <div className='hidden lg:flex'>
              <Squares3X3IconButton
                index={0}
                selectedShape={selectedShape}
                handleClick={handleSelectShape}
              />
            </div>
            <div>
              <Squares2X2IconButton
                index={1}
                selectedShape={selectedShape}
                handleClick={handleSelectShape}
              />
            </div>
          </div>
        </div>

        <section aria-labelledby="products-heading" className="pt-6 pb-24">
          <h2 id="products-heading" className="sr-only">
            Products
          </h2>
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
            {selectedShape === 0 && (
              <form className="hidden lg:block">
                <h2 className="mb-5 font-bold text-md">CATEGORIES</h2>
                <ul
                  role="list"
                  className="space-y-4 pb-6 text-sm font-medium text-gray-900"
                >
                  {subCategories.map((category) => (
                    <li key={category.name}>
                      <a
                        className={`text-[#807E7E] text-sm ${
                          selectedCategory == category.name
                            ? 'border-b text-black font-bold'
                            : ''
                        }`}
                        href={category.href}
                        onClick={() => setSelectedCategory(category.name)}
                      >
                        {category.name}
                      </a>
                    </li>
                  ))}
                </ul>

                {
                  <Disclosure key={priceFilter.id} as="div" className="py-6">
                    <h3 className="-my-3 flow-root">
                      <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                        <span className="font-bold text-gray-900">
                          {priceFilter.name}
                        </span>
                      </DisclosureButton>
                    </h3>
                    <div className="pt-6">
                      <div className="space-y-4">
                        {priceFilter.options.map((option, optionIdx) => (
                          <div key={optionIdx} className="flex justify-between">
                            <label
                              htmlFor={`filter-${priceFilter.id}-${optionIdx}`}
                              className={`text-[#807E7E] text-sm font-medium`}
                            >
                              {option.label}
                            </label>

                            <div className="flex h-5 shrink-0 items-center">
                              <div className="group grid size-4 grid-cols-1">
                                <input
                                  id={`-${optionIdx}`}
                                  name={`${priceFilter.id}[]`}
                                  type="radio"
                                  className="p-2 col-start-1 row-start-1 appearance-none rounded-sm border border-primary bg-white checked:border-black checked:bg-black indeterminate:border-black "
                                  onClick={() =>
                                    setPriceRange([
                                      option.value.minPrice,
                                      option.value.maxPrice,
                                    ])
                                  }
                                />
                                <CheckComp />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Disclosure>
                }
              </form>
            )}

            <div
              className={`${
                selectedShape === 0 ? 'lg:col-span-3' : 'lg:col-span-4'
              }`}
            >
              <Grid
                container
                spacing={2}
                sx={{ width: '100%' }}
                justifyContent={{ xs: 'center', md: 'space-between' }}
              >
                {products.slice(0, showCount).map((item, index) => (
                  <div
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                    key={index}
                  >
                    <Link href={`/product/${item.id}`}>
                      <ProductCard
                        productName={item.title}
                        currentPrice={item.Price}
                        originalPrice={item.originalPrice}
                        discountPercentage={item.discount}
                        rating={item.Rate}
                        image={item.primary_image}
                        date={item.Date}
                      />
                    </Link>
                  </div>
                ))}
              </Grid>
              {showCount < products.length && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={handleShowMore}
                    className="cursor-pointer px-8 py-2 text-sm md:text-base font-medium text-black bg-white border rounded-full"
                  >
                    Show More
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
