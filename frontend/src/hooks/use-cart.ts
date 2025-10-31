import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useCartStore, useCartActions } from '@/stores/cart-store';
import type { Cart, CartSummary, AddToCartInput } from '@/types/cart';

const API_BASE = '/api/cart';

// Helper to get session ID from store
function getSessionHeaders(): HeadersInit {
  const sessionId = useCartStore.getState().sessionId;
  return sessionId ? { 'X-Session-Id': sessionId } : {};
}

// Helper to handle session ID in response
function handleSessionHeader(response: Response) {
  const sessionId = response.headers.get('X-Session-Id');
  if (sessionId) {
    useCartStore.getState().actions.setSessionId(sessionId);
  }
}

// Fetch full cart
export function useCart() {
  const sessionId = useCartStore((state) => state.sessionId);
  return useQuery({
    queryKey: ['cart', sessionId],
    queryFn: async (): Promise<Cart | null> => {
      if (!sessionId) return null;
      const response = await fetch(API_BASE, {
        headers: getSessionHeaders(),
      });
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to fetch cart');
      }
      return response.json();
    },
    enabled: !!sessionId,
  });
}

// Fetch cart summary (for header badge)
export function useCartSummary() {
  const sessionId = useCartStore((state) => state.sessionId);
  const { updateSummary } = useCartActions();
  return useQuery({
    queryKey: ['cart', 'summary', sessionId],
    queryFn: async (): Promise<CartSummary> => {
      const response = await fetch(`${API_BASE}/summary`, {
        headers: getSessionHeaders(),
      });
      if (!response.ok) {
        return { itemCount: 0, totalAmount: 0 };
      }
      const data = await response.json();
      updateSummary(data.itemCount, data.totalAmount);
      return data;
    },
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  });
}

// Add item to cart
export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: AddToCartInput) => {
      const response = await fetch(`${API_BASE}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getSessionHeaders(),
        },
        body: JSON.stringify(input),
      });
      handleSessionHeader(response);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add item to cart');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Produto adicionado ao carrinho!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao adicionar produto');
    },
  });
}

// Update cart item quantity
export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      const response = await fetch(`${API_BASE}/items/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getSessionHeaders(),
        },
        body: JSON.stringify({ quantity }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update item');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar quantidade');
    },
  });
}

// Remove cart item
export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_BASE}/items/${id}`, {
        method: 'DELETE',
        headers: getSessionHeaders(),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to remove item');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Produto removido do carrinho');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao remover produto');
    },
  });
}

// Clear cart
export function useClearCart() {
  const queryClient = useQueryClient();
  const { clearCart } = useCartActions();
  return useMutation({
    mutationFn: async () => {
      const response = await fetch(API_BASE, {
        method: 'DELETE',
        headers: getSessionHeaders(),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to clear cart');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      clearCart();
      toast.success('Carrinho limpo');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao limpar carrinho');
    },
  });
}
