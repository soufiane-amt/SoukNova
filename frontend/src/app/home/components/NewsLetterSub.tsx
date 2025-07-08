'use client';

import React from 'react';
import { Typography } from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';

export function NewsLetterSub() {
  return (
    <div className="w-full h-[360px] bg-[url('/images/home/newsLetterBack.png')] bg-cover bg-center bg-no-repeat flex items-center justify-center px-6">
      <div className="flex flex-col items-center text-center md:w-1/4 sm:w-1/3">
        <div className="mb-8">
          <Typography variant="h4" sx={{ fontWeight: 'medium-bold' }}>
            Join Our Newsletter
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontSize: '15px', minHeight: '24px' }}
          >
            Sign up for deals, new products and promotions
          </Typography>
        </div>
        <div className="text-xs text-color-primary border-b border-b-[#6C7275] w-full flex justify-between">
          <div className="flex items-center">
            <EmailOutlinedIcon
              sx={{ fontSize: 24, color: '#6C7275', paddingRight: '5px' }}
            />
            <input
              placeholder="Email address"
              type="email"
              className="border-bottom"
            />
          </div>
          <button>Signup</button>
        </div>
      </div>
    </div>
  );
}
