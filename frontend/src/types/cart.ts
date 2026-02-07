import { z } from "zod";

export const cartItemSchema = z.object({
  productId: z.string().min(1, "Product ID must be a non-empty string"),
  name: z.string().min(1, "Product name is required"),
  price: z.number().positive("Price must be a positive number"),
  image: z.string().url("Image must be a valid URL"),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
});

export type CartItem = z.infer<typeof cartItemSchema>;

export const cartStateSchema = z.object({
  items: z.array(cartItemSchema),
  isOpen: z.boolean(),
});

export type CartState = z.infer<typeof cartStateSchema>;

export interface CartActions {
  addItem: (product: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getTotalQuantity: () => number;
}

export type CartStore = CartState & CartActions;
