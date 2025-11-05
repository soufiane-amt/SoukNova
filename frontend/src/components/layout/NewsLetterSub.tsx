'use client';

import React from 'react';
import { Typography } from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { poppins } from '@/layout';

export function NewsLetterSub() {
  return (
    <section
      className="w-full h-[360px] bg-[url('/images/home/newsLetterBack.png')] bg-cover bg-center bg-no-repeat flex items-center justify-center px-6 "
    >
      <div className={`flex flex-col items-center text-center md:w-1/4 sm:w-1/3 ${poppins.className}`}>
        <div className="mb-8">
          <Typography variant="h4" sx={{ fontWeight: '500' }}>
            Join Our Newsletter
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontSize: '15px', minHeight: '24px' }}
          >
            Sign up for deals, new products and promotions
          </Typography>
        </div>
        <div className="text-xs text-primary  border-b w-full flex justify-between">
          <div className="flex items-center">
            <EmailOutlinedIcon
              sx={{
                fontSize: 24,
                color: 'var(--color-primary)',
                paddingRight: '5px',
              }}
            />
            <input
              placeholder="Email address"
              type="email"
              aria-label="Email address"
            />
          </div>
          <button>Signup</button>
        </div>
      </div>
    </section>
  );
}
