import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsSchema, productSchema, productImagesSchema, type Product, type ProductImage } from '@/types/product';

async function fetchProducts(): Promise<Product[]> {
  const response = await fetch('/api/products');
  if (!response.ok) {
    throw new Error('Falha ao buscar produtos');
  }
  const data = await response.json();
  return productsSchema.parse(data);
}

async function fetchProductById(id: string): Promise<Product> {
  const response = await fetch(`/api/products/${id}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Produto não encontrado');
    }
    throw new Error('Erro ao buscar produto');
  }
  const data = await response.json();
  return productSchema.parse(data);
}

async function fetchProductImages(id: string): Promise<ProductImage[]> {
  const response = await fetch(`/api/products/${id}/images`);
  if (!response.ok) {
    if (response.status === 404) {
      return [];
    }
    throw new Error('Erro ao buscar imagens do produto');
  }
  const data = await response.json();
  return productImagesSchema.parse(data);
}

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 30_000,
    retry: 1,
  });
}

export function useProductById(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
    staleTime: 30_000,
    retry: 1,
  });
}

export function useProductImages(id: string) {
  return useQuery({
    queryKey: ['product-images', id],
    queryFn: () => fetchProductImages(id),
    enabled: !!id,
    staleTime: 30_000,
    retry: 1,
  });
}

async function uploadProductImages(productId: string, files: File[]): Promise<ProductImage[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append('images', file));
  const response = await fetch(`/api/products/${productId}/images`, { method: 'POST', body: formData });
  if (!response.ok) {
    if (response.status === 413) throw new Error('Arquivo muito grande (máximo 5MB por arquivo)');
    if (response.status === 415) throw new Error('Formato não suportado. Use JPEG, PNG ou WEBP');
    throw new Error('Erro ao fazer upload das imagens');
  }
  const data = await response.json();
  return productImagesSchema.parse(data);
}

export function useUploadProductImages() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, files }: { productId: string; files: File[] }) => uploadProductImages(productId, files),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: ['product-images', productId] });
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
    },
  });
}
