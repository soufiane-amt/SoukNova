import Grid from '@mui/material/Grid';
import React from 'react';
import Box from '@mui/material/Box';
import BenefitCard from './BenefitCard';

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
      <Grid
        container
        spacing={2}
        justifyContent={{ xs: 'center', md: 'space-between' }}
      >
        {benefits.map((benefit, index) => (
          <div data-aos="fade-up" data-aos-delay={index * 100} key={index}>
            <BenefitCard
              key={index}
              iconName={benefit.icon}
              title={benefit.title}
              description={benefit.description}
            />
          </div>
        ))}
      </Grid>
    </Box>
  );
}

export default BenefitsDisplay;
