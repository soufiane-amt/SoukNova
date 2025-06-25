import CustomButton from '@/components/CustomButton';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { Button } from '@mui/material';

export default function NewProduct() {
  return (
    <div className='flex justify-between mb-8'>
      <div className='w-20'>
        <h1 className='text-3xl bold-font'>New Arrivals</h1>
      </div>
      <div className="flex justify-end mt-8">
        <CustomButton label='More products'/>
      </div>
    </div>
  );
}
