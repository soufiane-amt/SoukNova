'use client';

import React, { useState } from 'react';
import { Typography, CircularProgress } from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { poppins } from '@/layout';
import { NEWSLETTER_BACKGROUND_IMAGE } from '../../constants/assets';

export function NewsLetterSub() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (value: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(value.toLowerCase());
  };

  const handleSignup = async () => {
    setError('');
    setSuccess(false);
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 1000));
      setSuccess(true);
      setEmail('');
    } catch (e) {
      setError('Something went wrong. Please try again : ' + e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      style={{ backgroundImage: `url(${NEWSLETTER_BACKGROUND_IMAGE})` }}
      className={`w-full h-[360px] bg-cover bg-center bg-no-repeat flex items-center justify-center px-6 `}
    >
      <div
        className={`flex flex-col items-center text-center md:w-1/4 sm:w-1/3 ${poppins.className}`}
      >
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

        {success ? (
          <Typography variant="h6" sx={{ color: 'green' }}>
            Thanks! Check your inbox for confirmation.
          </Typography>
        ) : (
          <div className="text-xs text-primary  border-b w-full flex justify-between items-center gap-3">
            <div className="flex items-center flex-1">
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent outline-none flex-1 py-2"
                disabled={loading}
              />
            </div>
            <button
              onClick={handleSignup}
              disabled={loading}
              aria-disabled={loading}
              className="cursor-pointer"
            >
              {loading ? (
                <CircularProgress size={18} sx={{ color: 'white' }} />
              ) : (
                'Signup'
              )}
            </button>
          </div>
        )}

        {error && (
          <Typography variant="caption" sx={{ color: 'red', mt: 1 }}>
            {error}
          </Typography>
        )}
      </div>
    </section>
  );
}
