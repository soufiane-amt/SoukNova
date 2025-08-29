import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

function PoppingDots() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex space-x-2">
        <div className="w-[10px] h-[10px] bg-black rounded-full animate-bounce1"></div>
        <div className="w-[10px] h-[10px] bg-black rounded-full animate-bounce2"></div>
        <div className="w-[10px] h-[10px] bg-black rounded-full animate-bounce3"></div>
        <div className="w-[10px] h-[10px] bg-black rounded-full animate-bounce4"></div>
      </div>
      <style>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-bounce1 {
          animation: bounce 1s ease-in-out infinite;
        }

        .animate-bounce2 {
          animation: bounce 1s ease-in-out infinite 0.1s;
        }

        .animate-bounce3 {
          animation: bounce 1s ease-in-out infinite 0.2s;
        }
        .animate-bounce4 {
          animation: bounce 1s ease-in-out infinite 0.3s;
        }
      `}</style>
    </div>
  );
}
export default function CircularIndeterminate() {
  return (
    <Box sx={{ display: 'flex' }}>
      <PoppingDots/>
    </Box>
  );
}
