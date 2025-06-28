import BenefitCard from '@/home/components/BenifitCard';
import Grid from '@mui/material/Grid'; // Import Material-UI Grid
import React from 'react';
import Box from '@mui/material/Box'; // For padding the whole section

function BenefitsDisplay() {
  const benefits = [
    {
      icon: 'shipping',
      title: 'Free Shipping',
      description: 'Order above $200',
    },
    {
      icon: 'money',
      title: 'Money-back',
      description: '30 days guarantee',
    },
    {
      icon: 'security',
      title: 'Secure Payments',
      description: 'Secured by Stripe',
    },
    {
      icon: 'support',
      title: '24/7 Support',
      description: 'Phone and Email support',
    },
  ];

  return ( 
    <Box>
      <Grid className="flex justify-between items-center" container spacing={2}>
        {benefits.map((benefit, index) => (
          <BenefitCard
            key={index}
            iconName={benefit.icon}
            title={benefit.title}
            description={benefit.description}
          />
        ))}
      </Grid>
    </Box>
  );
}

export default BenefitsDisplay;
