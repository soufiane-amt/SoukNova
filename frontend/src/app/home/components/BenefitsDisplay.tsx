import Grid from '@mui/material/Grid';
import React from 'react';
import BenefitCard from './BenefitCard';
import { benefits } from '../../../constants/benefitList';

function BenefitsDisplay() {
  return (
    <section className="my-12">
      <Grid container justifyContent={{ xs: 'center', md: 'space-between' }}>
        {benefits.map((benefit, index) => (
          <Grid
            item
            key={index}
            xs={12}
            sm={6}
            md={3}
            data-aos="fade-up"
            data-aos-delay={index * 100}
          >
            <BenefitCard
              iconName={benefit.icon}
              title={benefit.title}
              description={benefit.description}
            />
          </Grid>
        ))}
      </Grid>
    </section>
  );
}

export default BenefitsDisplay;
