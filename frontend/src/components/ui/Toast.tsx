import React, { useState, useEffect } from 'react';

const AUTO_HIDE_DURATION = 1500;

interface toastProps {
  mes: string;
}
const Toast = ({ mes }: toastProps) => {
  const [isVisible, setIsVisible] = useState(false);
  let timer;

  useEffect(() => {
    if (mes) {
      clearTimeout(timer);

      setIsVisible(true);

      timer = setTimeout(() => {
        setIsVisible(false);
      }, AUTO_HIDE_DURATION);
    } else {
      setIsVisible(false);
      clearTimeout(timer);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [mes]);
  const handleClose = () => {
    setIsVisible(false);
    clearTimeout(timer);
  };

  const toastClasses = `
    fixed top-0 left-1/2 transform 
    ${isVisible ? 'translate-y-0' : '-translate-y-full'} 
    -translate-x-1/2 
    transition-transform duration-200 ease-out 
    z-50 max-w-sm w-full sm:max-w-md
  `;

  const styleClasses = `
    flex items-center justify-between 
    bg-white text-gray-800 
    p-4 rounded-b-lg shadow-xl 
    border-l-4 border-green-500
  `;

  const SuccessIcon = () => (
    <svg
      className="w-6 h-6 text-green-500 mr-3 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5 13l4 4L19 7"
      ></path>
    </svg>
  );

  if (!mes) {
    return null;
  }

  return (
    <div className={toastClasses}>
      <div className={styleClasses} role="alert">
        <div className="flex items-center">
          <SuccessIcon />
          <span className="font-medium text-sm sm:text-base">{mes}</span>
        </div>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 ml-4 focus:outline-none transition-colors"
          aria-label="Close notification"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Toast;
