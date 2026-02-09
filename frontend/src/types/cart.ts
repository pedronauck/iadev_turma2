export interface CartItem {
  productId: string;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
}

export type AddToCartPayload = {
  productId: string;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
};
