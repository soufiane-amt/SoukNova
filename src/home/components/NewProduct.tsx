import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { Button } from '@mui/material';

export default function NewProduct() {
  return (
    <div className='flex justify-between mb-8'>
      <div className='w-20'>
        <h1 className='text-3xl bold-font'>New Arrivals</h1>
      </div>
      <div className="flex justify-end">
        <Button
          variant="outlined"
          disableElevation
          disableRipple
          disableFocusRipple
          sx={{
            all: 'unset',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            color: 'inherit',
            textDecoration: 'underline',
            paddingBlock: '10px',
            justifyItems: 'center',
          }}
          endIcon={<ArrowForwardIcon sx={{ width: 18 }} />}
        >
          More products
        </Button>
      </div>
    </div>
  );
}
