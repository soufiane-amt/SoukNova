export interface Article {
  id: string;
  title: string;
  images: string[];
  date: string;
}

export type priceType = [number, number];

export type ShippingOption = 'free' | 'express' | 'pickup';
