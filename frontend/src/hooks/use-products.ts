import { useQuery } from '@tanstack/react-query';
import { productsSchema, type Product } from '@/types/product';

async function fetchProducts(): Promise<Product[]> {
  const response = await fetch('/api/products');

  if (!response.ok) {
    throw new Error('Falha ao buscar produtos');
  }

  const data = await response.json();
  return productsSchema.parse(data);
}

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 30_000,
    retry: 1,
  });
}
