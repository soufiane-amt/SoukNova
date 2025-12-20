export function isProductNew(productDateString: string | undefined) {
  if (!productDateString) return false;
  const today = new Date();
  const productDate = new Date(productDateString);
  const differenceInTime = today.getTime() - productDate.getTime();
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  const daysThreshold = 365;
  return differenceInDays <= daysThreshold;
}

export function getFirstTwoWords(title: string) {
  if (!title || typeof title !== 'string') return '';
  const words = title.split(' ');
  if (words.length >= 2) {
    return `${words[0]} ${words[1]}`;
  }
  return title;
}

export function getDiscountedPrice(price: number, discount: number): number {
  const discountedPrice = price - (price * discount) / 100;
  return parseFloat(discountedPrice.toFixed(2));
}

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const res = await fetch(url, options);

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/signin';
    }
    return;
  }

  return res;
}

export const getFormatInDate = (date: string | Date) => {
  const today = typeof date === 'string' ? new Date(date) : date;

  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  };

  return today.toLocaleDateString('en-US', options);
};
