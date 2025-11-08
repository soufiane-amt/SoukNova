import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material';
import { inter } from '@/layout';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type IconComponentType = OverridableComponent<SvgIconTypeMap<{}, 'svg'>>;

const iconMap: { [key: string]: IconComponentType } = {
  shipping: LocalShippingOutlinedIcon,
  money: AttachMoneyOutlinedIcon,
  security: LockOutlinedIcon,
  support: CallOutlinedIcon,
};

interface BenefitCardProps {
  iconName: keyof typeof iconMap;
  title: string;
  description: string;
}
const BenefitCard = ({ iconName, title, description }: BenefitCardProps) => {
  const IconComponent = iconMap[iconName];

  if (!IconComponent) {
    console.warn(`Icon "${iconName}" not found in iconMap.`);
    return null;
  }

  return (
    <Card
      sx={{
        width: 300,
        minHeight: 220,
        display: 'flex',
        flexDirection: 'column',
        m: 1,
        boxShadow: 0,
        backgroundColor: '#F3F5F7',
      }}
    >
      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'start',
          marginLeft: '10px',
        }}
      >
        {IconComponent && <IconComponent sx={{ fontSize: 60, mb: 2 }} />}
        <Typography
          variant="h6"
          component="div"
          sx={{ fontFamily: "'Poppins', sans-serif" }}
          gutterBottom
        >
          {title}
        </Typography>
        <p  className={`${inter.className} text-[var(--color-primary)]`}>
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

export default BenefitCard;
