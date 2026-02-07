import { z } from "zod";

export const cartItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  price: z.number(),
  image: z.string(),
  quantity: z.number().int().positive(),
});

export const cartStateSchema = z.object({
  items: z.array(cartItemSchema),
  isOpen: z.boolean(),
});

export const cartActionsSchema = z.object({
  addItem: z.function(),
  removeItem: z.function(),
  updateQuantity: z.function(),
  clearCart: z.function(),
  openCart: z.function(),
  closeCart: z.function(),
});

export type CartItem = z.infer<typeof cartItemSchema>;
export type CartState = z.infer<typeof cartStateSchema>;
export type CartActions = z.infer<typeof cartActionsSchema>;
