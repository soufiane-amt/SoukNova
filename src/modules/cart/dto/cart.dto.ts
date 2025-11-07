export interface CartItemProps {
  productName: string;
  image: string;
  price: number;
  discount?: number;
}
export interface CartItemFullProps {
  productId: string;
  productName: string;
  image: string;
  price: number;
  quantity: number;
  discount?: number;
}
