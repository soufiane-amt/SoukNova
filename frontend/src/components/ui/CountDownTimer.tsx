'use client';

import { poppins } from '@/layout';
import React, { useState, useEffect } from 'react';

const targetDate = new Date();
targetDate.setDate(targetDate.getDate() + 3);

function calculateTimeLeft() {
  const difference = +targetDate - +new Date();
  let timeLeft = {};

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      mins: Math.floor((difference / 1000 / 60) % 60),
      secs: Math.floor((difference / 1000) % 60),
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

  const timeUnits = [
    { key: 'days', value: (timeLeft as any).days ?? 0 },
    { key: 'hours', value: (timeLeft as any).hours ?? 0 },
    { key: 'mins', value: (timeLeft as any).mins ?? 0 },
    { key: 'secs', value: (timeLeft as any).secs ?? 0 },
  ];

  return (
    <div className={`${poppins.className}`}>
      {isOfferExpired ? (
        <div className="flex items-center gap-2 text-red-500">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm font-semibold">Offer Expired!</span>
        </div>
      ) : (
        <div className="flex items-center gap-3 sm:gap-4">
          {timeUnits.map((unit, index) => (
            <React.Fragment key={unit.key}>
              {/* Time Unit Block */}
              <div className="flex flex-col items-center">
                <div className="relative bg-white rounded-xl shadow-sm border border-gray-100 px-3 py-2 sm:px-4 sm:py-3 min-w-[52px] sm:min-w-[64px]">
                  <span className="text-xl sm:text-2xl md:text-3xl font-bold text-[#141718] tabular-nums">
                    {String(unit.value).padStart(2, '0')}
                  </span>
                  {/* Decorative line */}
                  <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-gray-100 -translate-y-1/2 pointer-events-none" />
                </div>
                <span className="text-[10px] sm:text-xs text-[#6C7275] uppercase tracking-wider mt-1.5 font-medium">
                  {unit.key}
                </span>
              </div>

              {/* Separator (except for last item) */}
              {index < timeUnits.length - 1 && (
                <div className="flex flex-col gap-1.5 pb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#141718]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#141718]" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default CountdownTimer;
