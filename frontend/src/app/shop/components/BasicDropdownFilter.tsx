import { FormControl, MenuItem, Select } from '@mui/material';

const subCategories = [
  { name: 'All Rooms' },
  { name: 'Living Room' },
  { name: 'Bedroom' },
  { name: 'Kitchen' },
  { name: 'Bathroom' },
  { name: 'Dinning' },
  { name: 'Outdoor' },
];

interface BasicDropdownFilterProps {
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
}

function BasicDropdownFilter({
  selectedCategory,
  setSelectedCategory,
}: BasicDropdownFilterProps) {
  const handleCategoryChange = (event: any) => {
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

export default BasicDropdownFilter;
