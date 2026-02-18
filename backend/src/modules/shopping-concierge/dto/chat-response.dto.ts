
export interface Product {
  id: string;
  title: string;
  price: string;
  discount?: string;
  image?: string;
  rating?: number;
  url?: string;
}

export interface ChatResponse {
  message: string;
  products?: Product[];
}