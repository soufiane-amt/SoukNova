'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

const sortOptions = [
  { name: 'Most Popular', href: '#', current: true },
  { name: 'Best Rating', href: '#', current: false },
  { name: 'Newest', href: '#', current: false },
  { name: 'Price: Low to High', href: '#', current: false },
  { name: 'Price: High to Low', href: '#', current: false },
];
const subCategories = [
  { name: 'Totes', href: '#' },
  { name: 'Backpacks', href: '#' },
  { name: 'Travel Bags', href: '#' },
  { name: 'Hip Bags', href: '#' },
  { name: 'Laptop Sleeves', href: '#' },
];
const filters = [
  {
    id: 'color',
    name: 'Color',
    options: [
      { value: 'white', label: 'White', checked: false },
      { value: 'beige', label: 'Beige', checked: false },
      { value: 'blue', label: 'Blue', checked: true },
      { value: 'brown', label: 'Brown', checked: false },
      { value: 'green', label: 'Green', checked: false },
      { value: 'purple', label: 'Purple', checked: false },
    ],
  },
  {
    id: 'category',
    name: 'Category',
    options: [
      { value: 'new-arrivals', label: 'New Arrivals', checked: false },
      { value: 'sale', label: 'Sale', checked: false },
      { value: 'travel', label: 'Travel', checked: true },
      { value: 'organization', label: 'Organization', checked: false },
      { value: 'accessories', label: 'Accessories', checked: false },
    ],
  },
  {
    id: 'size',
    name: 'Size',
    options: [
      { value: '2l', label: '2L', checked: false },
      { value: '6l', label: '6L', checked: false },
      { value: '12l', label: '12L', checked: false },
      { value: '18l', label: '18L', checked: false },
      { value: '20l', label: '20L', checked: false },
      { value: '40l', label: '40L', checked: true },
    ],
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

function Squares1X1IconVertical(props: any) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5.75 10C6.34674 10 6.91903 10.2371 7.34099 10.659C7.76295 11.081 8 11.6533 8 12.25V15.75C8 16.3467 7.76295 16.919 7.34099 17.341C6.91903 17.7629 6.34674 18 5.75 18H2.25C1.65326 18 1.08097 17.7629 0.65901 17.341C0.237053 16.919 0 16.3467 0 15.75V12.25C0 11.6533 0.237053 11.081 0.65901 10.659C1.08097 10.2371 1.65326 10 2.25 10H5.75ZM15.75 10C16.3467 10 16.919 10.2371 17.341 10.659C17.7629 11.081 18 11.6533 18 12.25V15.75C18 16.3467 17.7629 16.919 17.341 17.341C16.919 17.7629 16.3467 18 15.75 18H12.25C11.6533 18 11.081 17.7629 10.659 17.341C10.2371 16.919 10 16.3467 10 15.75V12.25C10 11.6533 10.2371 11.081 10.659 10.659C11.081 10.2371 11.6533 10 12.25 10H15.75ZM5.75 0C6.34674 0 6.91903 0.237053 7.34099 0.65901C7.76295 1.08097 8 1.65326 8 2.25V5.75C8 6.34674 7.76295 6.91903 7.34099 7.34099C6.91903 7.76295 6.34674 8 5.75 8H2.25C1.65326 8 1.08097 7.76295 0.65901 7.34099C0.237053 6.91903 0 6.34674 0 5.75V2.25C0 1.65326 0.237053 1.08097 0.65901 0.65901C1.08097 0.237053 1.65326 0 2.25 0H5.75ZM15.75 0C16.3467 0 16.919 0.237053 17.341 0.65901C17.7629 1.08097 18 1.65326 18 2.25V5.75C18 6.34674 17.7629 6.91903 17.341 7.34099C16.919 7.76295 16.3467 8 15.75 8H12.25C11.6533 8 11.081 7.76295 10.659 7.34099C10.2371 6.91903 10 6.34674 10 5.75V2.25C10 1.65326 10.2371 1.08097 10.659 0.65901C11.081 0.237053 11.6533 0 12.25 0H15.75Z"
        fill="currentColor"
      />
      <path d="M0 3H7.99805V15H0V3Z" fill="currentColor" />
      <path d="M10.002 3H18V15H10.002V3Z" fill="currentColor" />
    </svg>
  );
}
function Squares1X1IconHorizontal(props: any) {
  return (
    <svg
      width="18"
      height="19"
      viewBox="0 0 18 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9.99994 12.75C9.99994 12.1533 10.237 11.581 10.659 11.159C11.0809 10.7371 11.6532 10.5 12.2499 10.5L15.7499 10.5C16.3467 10.5 16.919 10.7371 17.3409 11.159C17.7629 11.581 17.9999 12.1533 17.9999 12.75L17.9999 16.25C17.9999 16.8467 17.7629 17.419 17.3409 17.841C16.919 18.2629 16.3467 18.5 15.7499 18.5L12.2499 18.5C11.6532 18.5 11.0809 18.2629 10.659 17.841C10.237 17.419 9.99994 16.8467 9.99994 16.25L9.99994 12.75ZM9.99994 2.75C9.99994 2.15326 10.237 1.58097 10.6589 1.15901C11.0809 0.737053 11.6532 0.5 12.2499 0.5L15.7499 0.5C16.3467 0.5 16.919 0.737053 17.3409 1.15901C17.7629 1.58097 17.9999 2.15326 17.9999 2.75L17.9999 6.25C17.9999 6.84674 17.7629 7.41903 17.3409 7.84099C16.919 8.26295 16.3467 8.5 15.7499 8.5L12.2499 8.5C11.6532 8.5 11.0809 8.26295 10.6589 7.84099C10.237 7.41903 9.99994 6.84674 9.99994 6.25L9.99994 2.75ZM-6.0598e-05 12.75C-6.06241e-05 12.1533 0.236992 11.581 0.658949 11.159C1.08091 10.7371 1.6532 10.5 2.24994 10.5L5.74994 10.5C6.34668 10.5 6.91897 10.7371 7.34093 11.159C7.76289 11.581 7.99994 12.1533 7.99994 12.75L7.99994 16.25C7.99994 16.8467 7.76289 17.419 7.34093 17.841C6.91897 18.2629 6.34668 18.5 5.74994 18.5L2.24994 18.5C1.6532 18.5 1.08091 18.2629 0.658949 17.841C0.236993 17.419 -6.0419e-05 16.8467 -6.04451e-05 16.25L-6.0598e-05 12.75ZM-6.10352e-05 2.75C-6.10612e-05 2.15326 0.236992 1.58097 0.658949 1.15901C1.08091 0.737053 1.6532 0.500001 2.24994 0.500001L5.74994 0.5C6.34668 0.5 6.91897 0.737053 7.34093 1.15901C7.76289 1.58097 7.99994 2.15326 7.99994 2.75L7.99994 6.25C7.99994 6.84674 7.76289 7.41903 7.34093 7.84099C6.91897 8.26295 6.34668 8.5 5.74994 8.5L2.24994 8.5C1.6532 8.5 1.08091 8.26295 0.658949 7.84099C0.236992 7.41903 -6.08561e-05 6.84674 -6.08822e-05 6.25L-6.10352e-05 2.75Z"
        fill="currentColor"
      />
      <path
        d="M2.99994 18.5L2.99994 10.502L14.9999 10.502L14.9999 18.5L2.99994 18.5Z"
        fill="currentColor"
      />
      <path
        d="M2.99994 8.49805L2.99994 0.500001L14.9999 0.5L14.9999 8.49805L2.99994 8.49805Z"
        fill="currentColor"
      />
    </svg>
  );
}

function Squares2X2Icon(props: any) {
  return (
    <svg
      width="18"
      height="19"
      viewBox="0 0 18 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5.75 10.5C6.34674 10.5 6.91903 10.7371 7.34099 11.159C7.76295 11.581 8 12.1533 8 12.75V16.25C8 16.8467 7.76295 17.419 7.34099 17.841C6.91903 18.2629 6.34674 18.5 5.75 18.5H2.25C1.65326 18.5 1.08097 18.2629 0.65901 17.841C0.237053 17.419 0 16.8467 0 16.25V12.75C0 12.1533 0.237053 11.581 0.65901 11.159C1.08097 10.7371 1.65326 10.5 2.25 10.5H5.75ZM15.75 10.5C16.3467 10.5 16.919 10.7371 17.341 11.159C17.7629 11.581 18 12.1533 18 12.75V16.25C18 16.8467 17.7629 17.419 17.341 17.841C16.919 18.2629 16.3467 18.5 15.75 18.5H12.25C11.6533 18.5 11.081 18.2629 10.659 17.841C10.2371 17.419 10 16.8467 10 16.25V12.75C10 12.1533 10.2371 11.581 10.659 11.159C11.081 10.7371 11.6533 10.5 12.25 10.5H15.75ZM5.75 0.5C6.34674 0.5 6.91903 0.737053 7.34099 1.15901C7.76295 1.58097 8 2.15326 8 2.75V6.25C8 6.84674 7.76295 7.41903 7.34099 7.84099C6.91903 8.26295 6.34674 8.5 5.75 8.5H2.25C1.65326 8.5 1.08097 8.26295 0.65901 7.84099C0.237053 7.41903 0 6.84674 0 6.25V2.75C0 2.15326 0.237053 1.58097 0.65901 1.15901C1.08097 0.737053 1.65326 0.5 2.25 0.5H5.75ZM15.75 0.5C16.3467 0.5 16.919 0.737053 17.341 1.15901C17.7629 1.58097 18 2.15326 18 2.75V6.25C18 6.84674 17.7629 7.41903 17.341 7.84099C16.919 8.26295 16.3467 8.5 15.75 8.5H12.25C11.6533 8.5 11.081 8.26295 10.659 7.84099C10.2371 7.41903 10 6.84674 10 6.25V2.75C10 2.15326 10.2371 1.58097 10.659 1.15901C11.081 0.737053 11.6533 0.5 12.25 0.5H15.75Z"
        fill="currentColor"
      />
    </svg>
  );
}

function Squares3X3Icon(props: any) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M0.5 2C0.5 1.60218 0.658035 1.22064 0.93934 0.93934C1.22064 0.658035 1.60218 0.5 2 0.5H5C5.39782 0.5 5.77936 0.658035 6.06066 0.93934C6.34196 1.22064 6.5 1.60218 6.5 2V5C6.5 5.39782 6.34196 5.77936 6.06066 6.06066C5.77936 6.34196 5.39782 6.5 5 6.5H2C1.60218 6.5 1.22064 6.34196 0.93934 6.06066C0.658035 5.77936 0.5 5.39782 0.5 5V2ZM8 2C8 1.60218 8.15804 1.22064 8.43934 0.93934C8.72064 0.658035 9.10218 0.5 9.5 0.5H12.5C12.8978 0.5 13.2794 0.658035 13.5607 0.93934C13.842 1.22064 14 1.60218 14 2V5C14 5.39782 13.842 5.77936 13.5607 6.06066C13.2794 6.34196 12.8978 6.5 12.5 6.5H9.5C9.10218 6.5 8.72064 6.34196 8.43934 6.06066C8.15804 5.77936 8 5.39782 8 5V2ZM15.5 2C15.5 1.60218 15.658 1.22064 15.9393 0.93934C16.2206 0.658035 16.6022 0.5 17 0.5H20C20.3978 0.5 20.7794 0.658035 21.0607 0.93934C21.342 1.22064 21.5 1.60218 21.5 2V5C21.5 5.39782 21.342 5.77936 21.0607 6.06066C20.7794 6.34196 20.3978 6.5 20 6.5H17C16.6022 6.5 16.2206 6.34196 15.9393 6.06066C15.658 5.77936 15.5 5.39782 15.5 5V2ZM0.5 9.5C0.5 9.10218 0.658035 8.72064 0.93934 8.43934C1.22064 8.15804 1.60218 8 2 8H5C5.39782 8 5.77936 8.15804 6.06066 8.43934C6.34196 8.72064 6.5 9.10218 6.5 9.5V12.5C6.5 12.8978 6.34196 13.2794 6.06066 13.5607C5.77936 13.842 5.39782 14 5 14H2C1.60218 14 1.22064 13.842 0.93934 13.5607C0.658035 13.2794 0.5 12.8978 0.5 12.5V9.5ZM8 9.5C8 9.10218 8.15804 8.72064 8.43934 8.43934C8.72064 8.15804 9.10218 8 9.5 8H12.5C12.8978 8 13.2794 8.15804 13.5607 8.43934C13.842 8.72064 14 9.10218 14 9.5V12.5C14 12.8978 13.842 13.2794 13.5607 13.5607C13.2794 13.842 12.8978 14 12.5 14H9.5C9.10218 14 8.72064 13.842 8.43934 13.5607C8.15804 13.2794 8 12.8978 8 12.5V9.5ZM15.5 9.5C15.5 9.10218 15.658 8.72064 15.9393 8.43934C16.2206 8.15804 16.6022 8 17 8H20C20.3978 8 20.7794 8.15804 21.0607 8.43934C21.342 8.72064 21.5 9.10218 21.5 9.5V12.5C21.5 12.8978 21.342 13.2794 21.0607 13.5607C20.7794 13.842 20.3978 14 20 14H17C16.6022 14 16.2206 13.842 15.9393 13.5607C15.658 13.2794 15.5 12.8978 15.5 12.5V9.5ZM0.5 17C0.5 16.6022 0.658035 16.2206 0.93934 15.9393C1.22064 15.658 1.60218 15.5 2 15.5H5C5.39782 15.5 5.77936 15.658 6.06066 15.9393C6.34196 16.2206 6.5 16.6022 6.5 17V20C6.5 20.3978 6.34196 20.7794 6.06066 21.0607C5.77936 21.342 5.39782 21.5 5 21.5H2C1.60218 21.5 1.22064 21.342 0.93934 21.0607C0.658035 20.7794 0.5 20.3978 0.5 20V17ZM8 17C8 16.6022 8.15804 16.2206 8.43934 15.9393C8.72064 15.658 9.10218 15.5 9.5 15.5H12.5C12.8978 15.5 13.2794 15.658 13.5607 15.9393C13.842 16.2206 14 16.6022 14 17V20C14 20.3978 13.842 20.7794 13.5607 21.0607C13.2794 21.342 12.8978 21.5 12.5 21.5H9.5C9.10218 21.5 8.72064 21.342 8.43934 21.0607C8.15804 20.7794 8 20.3978 8 20V17ZM15.5 17C15.5 16.6022 15.658 16.2206 15.9393 15.9393C16.2206 15.658 16.6022 15.5 17 15.5H20C20.3978 15.5 20.7794 15.658 21.0607 15.9393C21.342 16.2206 21.5 16.6022 21.5 17V20C21.5 20.3978 21.342 20.7794 21.0607 21.0607C20.7794 21.342 20.3978 21.5 20 21.5H17C16.6022 21.5 16.2206 21.342 15.9393 21.0607C15.658 20.7794 15.5 20.3978 15.5 20V17Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function CategoryFilter() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  return (
    <div className="bg-white">
      <div>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-gray-200 pt-24 pb-6">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              New Arrivals
            </h1>

            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sort by
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="-mr-1 ml-1 size-5 shrink-0 text-gray-400 group-hover:text-gray-500"
                    />
                  </MenuButton>
                </div>

                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                >
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <MenuItem key={option.name}>
                        <a
                          href={option.href}
                          className={classNames(
                            option.current
                              ? 'font-medium text-gray-900'
                              : 'text-gray-500',
                            'block px-4 py-2 text-sm data-focus:bg-gray-100 data-focus:outline-hidden',
                          )}
                        >
                          {option.name}
                        </a>
                      </MenuItem>
                    ))}
                  </div>
                </MenuItems>
              </Menu>

              <button
                type="button"
                className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7 cursor-pointer"
              >
                <span className="sr-only">View grid</span>
                <Squares2X2Icon className="w-6 h-6 text-gray-700" />
              </button>
              <button
                type="button"
                className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7 cursor-pointer"
              >
                <span className="sr-only">View grid</span>
                <Squares3X3Icon className="w-6 h-6 text-gray-700" />
              </button>
              <button
                type="button"
                className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7 cursor-pointer"
              >
                <span className="sr-only">View grid</span>
                <Squares1X1IconVertical className="w-6 h-6 text-gray-700" />
              </button>
              <button
                type="button"
                className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7 cursor-pointer"
              >
                <span className="sr-only">View grid</span>
                <Squares1X1IconHorizontal className="w-6 h-6 text-gray-700" />
              </button>

              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon aria-hidden="true" className="size-5" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pt-6 pb-24">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Filters */}
              <form className="hidden lg:block">
                <h3 className="sr-only">Categories</h3>
                <ul
                  role="list"
                  className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900"
                >
                  {subCategories.map((category) => (
                    <li key={category.name}>
                      <a href={category.href}>{category.name}</a>
                    </li>
                  ))}
                </ul>

                {filters.map((section) => (
                  <Disclosure
                    key={section.id}
                    as="div"
                    className="border-b border-gray-200 py-6"
                  >
                    <h3 className="-my-3 flow-root">
                      <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                        <span className="font-medium text-gray-900">
                          {section.name}
                        </span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon
                            aria-hidden="true"
                            className="size-5 group-data-open:hidden"
                          />
                          <MinusIcon
                            aria-hidden="true"
                            className="size-5 group-not-data-open:hidden"
                          />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-6">
                      <div className="space-y-4">
                        {section.options.map((option, optionIdx) => (
                          <div key={option.value} className="flex gap-3">
                            <div className="flex h-5 shrink-0 items-center">
                              <div className="group grid size-4 grid-cols-1">
                                <input
                                  defaultValue={option.value}
                                  defaultChecked={option.checked}
                                  id={`filter-${section.id}-${optionIdx}`}
                                  name={`${section.id}[]`}
                                  type="checkbox"
                                  className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                />
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
                              </div>
                            </div>
                            <label
                              htmlFor={`filter-${section.id}-${optionIdx}`}
                              className="text-sm text-gray-600"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                ))}
              </form>

              {/* Product grid */}
              <div className="lg:col-span-3">{/* Your content */}</div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}





        // <Dialog
        //   open={mobileFiltersOpen}
        //   onClose={setMobileFiltersOpen}
        //   className="relative z-40 lg:hidden"
        // >
        //   <DialogBackdrop
        //     transition
        //     className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
        //   />

        //   <div className="fixed inset-0 z-40 flex">
        //     <DialogPanel
        //       transition
        //       className="relative ml-auto flex size-full max-w-xs transform flex-col overflow-y-auto bg-white pt-4 pb-6 shadow-xl transition duration-300 ease-in-out data-closed:translate-x-full"
        //     >
        //       <div className="flex items-center justify-between px-4">
        //         <h2 className="text-lg font-medium text-gray-900">Filters</h2>
        //         <button
        //           type="button"
        //           onClick={() => setMobileFiltersOpen(false)}
        //           className="relative -mr-2 flex size-10 items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
        //         >
        //           <span className="absolute -inset-0.5" />
        //           <span className="sr-only">Close menu</span>
        //           <XMarkIcon aria-hidden="true" className="size-6" />
        //         </button>
        //       </div>

        //       {/* Filters */}
        //       <form className="mt-4 border-t border-gray-200">
        //         <h3 className="sr-only">Categories</h3>
        //         <ul role="list" className="px-2 py-3 font-medium text-gray-900">
        //           {subCategories.map((category) => (
        //             <li key={category.name}>
        //               <a href={category.href} className="block px-2 py-3">
        //                 {category.name}
        //               </a>
        //             </li>
        //           ))}
        //         </ul>

        //         {filters.map((section) => (
        //           <Disclosure
        //             key={section.id}
        //             as="div"
        //             className="border-t border-gray-200 px-4 py-6"
        //           >
        //             <h3 className="-mx-2 -my-3 flow-root">
        //               <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
        //                 <span className="font-medium text-gray-900">
        //                   {section.name}
        //                 </span>
        //                 <span className="ml-6 flex items-center">
        //                   <PlusIcon
        //                     aria-hidden="true"
        //                     className="size-5 group-data-open:hidden"
        //                   />
        //                   <MinusIcon
        //                     aria-hidden="true"
        //                     className="size-5 group-not-data-open:hidden"
        //                   />
        //                 </span>
        //               </DisclosureButton>
        //             </h3>
        //             <DisclosurePanel className="pt-6">
        //               <div className="space-y-6">
        //                 {section.options.map((option, optionIdx) => (
        //                   <div key={option.value} className="flex gap-3">
        //                     <div className="flex h-5 shrink-0 items-center">
        //                       <div className="group grid size-4 grid-cols-1">
        //                         <input
        //                           defaultValue={option.value}
        //                           id={`filter-mobile-${section.id}-${optionIdx}`}
        //                           name={`${section.id}[]`}
        //                           type="checkbox"
        //                           className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
        //                         />
        //                         <svg
        //                           fill="none"
        //                           viewBox="0 0 14 14"
        //                           className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
        //                         >
        //                           <path
        //                             d="M3 8L6 11L11 3.5"
        //                             strokeWidth={2}
        //                             strokeLinecap="round"
        //                             strokeLinejoin="round"
        //                             className="opacity-0 group-has-checked:opacity-100"
        //                           />
        //                           <path
        //                             d="M3 7H11"
        //                             strokeWidth={2}
        //                             strokeLinecap="round"
        //                             strokeLinejoin="round"
        //                             className="opacity-0 group-has-indeterminate:opacity-100"
        //                           />
        //                         </svg>
        //                       </div>
        //                     </div>
        //                     <label
        //                       htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
        //                       className="min-w-0 flex-1 text-gray-500"
        //                     >
        //                       {option.label}
        //                     </label>
        //                   </div>
        //                 ))}
        //               </div>
        //             </DisclosurePanel>
        //           </Disclosure>
        //         ))}
        //       </form>
        //     </DialogPanel>
        //   </div>
        // </Dialog>
