'use client';

import { poppins } from '@/layout';
import { Typography } from '@mui/material';
import React, { useState, useEffect, JSX } from 'react';



const targetDate = new Date();
targetDate.setDate(targetDate.getDate() + 3);

function calculateTimeLeft() {
  const difference = +targetDate - +new Date();
  let timeLeft = {};

  if (difference > 0) {
    timeLeft = {
      d: Math.floor(difference / (1000 * 60 * 60 * 24)),
      h: Math.floor((difference / (1000 * 60 * 60)) % 24),
      m: Math.floor((difference / 1000 / 60) % 60),
      s: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
}

const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [isOfferExpired, setIsOfferExpired] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      if (Object.keys(newTimeLeft).length === 0) {
        setIsOfferExpired(true);
      }
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents: JSX.Element[] = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (timeLeft[interval as keyof typeof timeLeft]) {
      timerComponents.push(
        <div
          key={interval}
          className="flex flex-col items-center justify-center  "
        >
          <span className="text-3xl font-medium bg-gray-100 md:p-5 p-3">
            {timeLeft[interval as keyof typeof timeLeft]}
          </span>
          <span className="text-md text-black">{interval}</span>
        </div>,
      );
    }
  });

  return (
    <div className={`${poppins.className}`}>
      {isOfferExpired ? (
        <span className={`text-sm font-semibold `}>
          Offer Expired!
        </span>
      ) : (
        <div>
          <Typography
            variant="h6"
            color="#343839"
            sx={{ fontWeight: 'thin', fontSize:17 ,color: "text-red-500"}}
          >
            Offer expires in:
          </Typography>
          <div className="flex items-center gap-2 mt-1">
            {timerComponents.length ? (
              timerComponents
            ) : (
              <span className="text-sm font-semibold">00:00:00</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountdownTimer;
