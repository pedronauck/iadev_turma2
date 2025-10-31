import { z } from 'zod';

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  sku: z.string(),
  createdAt: z.string(),
});

export const productsSchema = z.array(productSchema);

export const createProductSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  price: z.number().positive('Preço deve ser positivo'),
  sku: z.string().min(1, 'SKU é obrigatório'),
});

export const productImageSchema = z.object({
  id: z.string(),
  url: z.string(),
  position: z.number(),
  createdAt: z.string(),
});

export const productImagesSchema = z.array(productImageSchema);

export type Product = z.infer<typeof productSchema>;
export type CreateProduct = z.infer<typeof createProductSchema>;
export type ProductImage = z.infer<typeof productImageSchema>;
