import { Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { poppins } from '@/layout';

interface CustomButtonProps {
  label: string;
}

export default function CustomButton({ label }: CustomButtonProps) {
  return (
    <Button
      variant="text"
      disableElevation
      disableRipple
      disableFocusRipple
      sx={{
        all: 'unset',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        color: 'inherit',
        justifyItems: 'center',
        borderBottom: '1px solid currentColor',
        fontFamily: poppins.className,
        height: "15px",
        paddingBlock: 0.8
      }}
      endIcon={<ArrowForwardIcon sx={{ width: 18 }} />}
    >
      {label}
    </Button>
  );
}
