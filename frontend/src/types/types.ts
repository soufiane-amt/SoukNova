export interface Article {
  id: string;
  title: string;
  images: string[];
  date: string;
}

export type priceType = [number, number] | undefined;

export type ShippingOption = 'free' | 'express' | 'pickup';
