import { MenuItem } from '@mui/material';
import BasicDropdownPrice, { sortOptions } from './BasicDropdownPrice';
import BasicDropdownFilter from './BasicDropdownFilter';
import { priceType } from '../../../types/types';
import { Menu, MenuButton, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from 'lucide-react';
import { Squares3X3IconButton } from '../../../components/icons/squares/Squares3X3Icon';
import { Squares2X2IconButton } from '../../../components/icons/squares/Squares2X2Icon';

interface selectedCategoryProps {
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  selectedShape: number;
  setSelectedShape: React.Dispatch<React.SetStateAction<number>>;
  priceRange: priceType;
  setPriceRange: React.Dispatch<React.SetStateAction<priceType>>;
  setSelectedOrder: React.Dispatch<React.SetStateAction<string | null>>;
}
function ViewModeSelector({
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  setSelectedOrder,
  selectedShape,
  setSelectedShape,
}: selectedCategoryProps) {
  return (
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

      <div className="flex items-center justify-between">
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
        <div className="hidden lg:flex">
          <Squares3X3IconButton
            index={0}
            selectedShape={selectedShape}
            handleClick={() => setSelectedShape(0)}
          />
        </div>
        <div>
          <Squares2X2IconButton
            index={1}
            selectedShape={selectedShape}
            handleClick={() => setSelectedShape(1)}
          />
        </div>
      </div>
    </div>
  );
}

export default ViewModeSelector;
