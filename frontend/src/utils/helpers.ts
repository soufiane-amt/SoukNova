
export function isProductNew(productDateString: string) {
  const today = new Date();
  const productDate = new Date(productDateString);
  const differenceInTime = today.getTime() - productDate.getTime();
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  const daysThreshold = 365;
  return differenceInDays <= daysThreshold;
}

export function getFirstTwoWords(title: string) {
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
