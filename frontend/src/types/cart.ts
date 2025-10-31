import { z } from 'zod';

// Schemas Zod
export const cartItemSchema = z.object({
  id: z.string(),
  cartId: z.string(),
  productId: z.string(),
  quantity: z.number().int().positive(),
  createdAt: z.string(),
  updatedAt: z.string(),
  product: z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    sku: z.string(),
  }),
});

export const cartSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  items: z.array(cartItemSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const cartSummarySchema = z.object({
  itemCount: z.number().int().nonnegative(),
  totalAmount: z.number().nonnegative(),
});

export const addToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID é obrigatório'),
  quantity: z.number().int().positive().default(1),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().positive('Quantidade deve ser positiva'),
});

// Types
export type CartItem = z.infer<typeof cartItemSchema>;
export type Cart = z.infer<typeof cartSchema>;
export type CartSummary = z.infer<typeof cartSummarySchema>;
export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
