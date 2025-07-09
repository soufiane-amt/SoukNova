import Grid from '@mui/material/Grid';
import React from 'react';
import BenefitCard from './BenefitCard';
import { benefits } from '../../../constants/benefitList';

function BenefitsDisplay() {
  return (
    <section className='my-12'>
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
    </section>
  );
}

export default BenefitsDisplay;
