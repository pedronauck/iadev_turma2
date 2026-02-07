import { z } from "zod";

/**
 * Represents a single item in the shopping cart
 * Includes product information and quantity
 */
export const CartItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  name: z.string().min(1, "Product name is required"),
  price: z.number().positive("Price must be positive"),
  image: z.string().optional(),
  quantity: z.number().int().positive("Quantity must be at least 1"),
});

export type CartItem = z.infer<typeof CartItemSchema>;

/**
 * Represents the complete cart state
 * Contains all items and cart metadata
 */
export const CartStateSchema = z.object({
  items: z.array(CartItemSchema),
  isOpen: z.boolean().default(false),
});

export type CartState = z.infer<typeof CartStateSchema>;

/**
 * Actions available on the cart store
 */
export interface CartActions {
  addItem: (product: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

/**
 * Complete cart store interface combining state and actions
 */
export type CartStore = CartState & CartActions;
