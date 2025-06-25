import { Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

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
        fontFamily: 'Inter',
        height: "15px"
      }}
      endIcon={<ArrowForwardIcon sx={{ width: 18 }} />}
    >
      {label}
    </Button>
  );
}
