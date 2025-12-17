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
  discount: number;

  rate?: number;
  comments?: ProductReview[];
  package_dimensions?: string;
  originalPrice?: number;
  primary_image?: string;
  categoriesText?: string;
  item_model_number?: string;
  about_item?: string;
  images?: string[];
  date?: string;
}
