import { FormControl, MenuItem, Select } from '@mui/material';
import { priceType } from '../../../types/types';

export const sortOptions = [
  { label: 'Rate_asc', value: 'rate_asc' },
  { label: 'Rate_desc', value: 'rate_desc' },
  { label: 'Price_asc', value: 'price_asc' },
  { label: 'Price_desc', value: 'price_desc' },
  { label: 'Date_asc', value: 'date_asc' },
  { label: 'Date_desc', value: 'date_desc' },
];
export const priceFilter = {
  id: 'price',
  name: 'PRICE',
  options: [
    {
      value: undefined,
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
      setPriceRange(undefined);
    } else {
      setPriceRange([min, max]);
    }
  };

  return (
    <FormControl fullWidth>
      <div className="mb-1 text-md font-bold text-[var(--color-primary)]">
        <p>CATEGORY</p>
      </div>
      <Select
        labelId="price-select-label"
        value={priceRange ? priceRange.join(',') : "All Prices"}
        onChange={handlePriceChange}
        sx={{
          height: 45,
          borderRadius: 2,
          fontWeight: 'bold',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'black',
            borderWidth: '2px',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'black',
          },
        }}
      >
        {priceFilter.options.map((el, index) => (
          <MenuItem
            key={index}
            value={el.value ? `${el.value.minPrice},${el.value.maxPrice}` : "All Prices"}
          >
            {el.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default BasicDropdownPrice;
