import { Disclosure, DisclosureButton } from '@headlessui/react';
import { priceType } from '../../../types/types';
import { priceFilter } from './BasicDropdownPrice';
import CheckedElement from '../../../components/inputs/CheckedElement';

const subCategories = [
  { name: 'All Rooms' },
  { name: 'Living Room' },
  { name: 'Bedroom' },
  { name: 'Kitchen' },
  { name: 'Bathroom' },
  { name: 'Dining' },
  { name: 'Outdoor' },
];

interface SidebarFilterProps {
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  priceRange: priceType;
  setPriceRange: React.Dispatch<React.SetStateAction<priceType>>;
}

function SidebarFilter({
  selectedCategory,
  setSelectedCategory,
  setPriceRange,
  priceRange,
}: SidebarFilterProps) {
  return (
    <form className="hidden lg:block">
      <h2 className="mb-5 font-bold text-sm">CATEGORIES</h2>
      <ul
        role="list"
        className="space-y-3 pb-6 text-sm font-medium text-gray-900"
      >
        {subCategories.map((category) => (
          <li key={category.name}>
            <button
              type="button"
              className={`text-[var(--color-primary)] text-sm cursor-pointer ${
                selectedCategory === category.name
                  ? 'border-b-2 text-black font-bold'
                  : ''
              }`}
              onClick={() => setSelectedCategory(category.name)}
            >
              {category.name}
            </button>
          </li>
        ))}
      </ul>

      {
        <Disclosure key={priceFilter.id} as="div" className="py-6">
          <h2 className="-my-3 flow-root">
            <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
              <span className="font-bold text-gray-900 text-md">
                {priceFilter.name}
              </span>
            </DisclosureButton>
          </h2>
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
                    <div className="group grid size-5 grid-cols-1">
                      <input
                        id={`-${optionIdx}`}
                        name={`${priceFilter.id}[]`}
                        defaultChecked={
                          priceRange &&
                          option.value &&
                          priceRange[0] === option.value.minPrice &&
                          priceRange[1] === option.value.maxPrice
                        }
                        type="radio"
                        className="p-2 col-start-1 row-start-1 appearance-none rounded-sm border border-primary bg-white checked:border-black checked:bg-black indeterminate:border-black "
                        onClick={() =>
                          option.value &&
                          setPriceRange([
                            option.value.minPrice,
                            option.value.maxPrice,
                          ])
                        }
                      />
                      <CheckedElement />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Disclosure>
      }
    </form>
  );
}

export default SidebarFilter;
