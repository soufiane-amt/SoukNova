export interface ProductReview {
  id: string;
  name: string;
  avatar: string;
  rate: number;
  content: string;
  createdAt?: string;
}

export interface ProductType {
  id: string;
  title: string;
  price: number;
  discount: string;

  rate?: number;
  availability? :'In Stock' | 'Low Stock' | 'Out of Stock';
  comments?: ProductReview[];
  package_dimensions?: string;
  originalPrice?: number;
  primary_image?: string;
  categories?: string[];
  item_model_number?: string;
  description?: string;
  images?: string[];
  date?: string;
  status?: string;
  about_item?: string;
}
