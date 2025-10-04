export const getFormatInDate = (date: string | Date) => {
  const today = typeof date === 'string' ? new Date(date) : date;

  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  };

  return today.toLocaleDateString('en-US', options);
};
