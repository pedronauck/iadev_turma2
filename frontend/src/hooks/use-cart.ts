import { useCallback } from "react";
import {
  useCartStore,
  useCartTotalPrice,
  useCartItemCount,
  useCartUniqueItemCount,
  useHasCartItem,
  useCartItem,
} from "@/stores/cart-store";
import type { CartItem } from "@/types/cart";

/**
 * Main hook for accessing the complete cart store
 * Provides all cart methods and state for managing the shopping cart
 *
 * @example
 * ```tsx
 * const { items, addItem, removeItem } = useCart();
 * ```
 */
export function useCart() {
  const items = useCartStore((state) => state.items);
  const isOpen = useCartStore((state) => state.isOpen);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const openCart = useCartStore((state) => state.openCart);
  const closeCart = useCartStore((state) => state.closeCart);

  return {
    items,
    isOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
  };
}

/**
 * Hook to access cart items array
 * Optimized with selector for minimal re-renders
 *
 * @example
 * ```tsx
 * const items = useCartItems();
 * ```
 */
export function useCartItems() {
  return useCartStore((state) => state.items);
}

/**
 * Hook to access cart totals and counts
 * Returns total price and item count
 *
 * @example
 * ```tsx
 * const { totalPrice, itemCount } = useCartTotals();
 * ```
 */
export function useCartTotals() {
  const totalPrice = useCartTotalPrice();
  const itemCount = useCartItemCount();

  return { totalPrice, itemCount };
}

/**
 * Convenience hook returning commonly used selectors together
 * For cases where you need multiple values at once
 */
export function useCartSummary() {
  const items = useCartItems();
  const itemCount = useCartItemCount();
  const uniqueItemCount = useCartUniqueItemCount();
  const totalPrice = useCartTotalPrice();
  const isOpen = useCartStore((state) => state.isOpen);

  return {
    items,
    itemCount,
    uniqueItemCount,
    totalPrice,
    isOpen,
  };
}

/**
 * Hook to check if a specific item exists in the cart
 *
 * @param productId - The product ID to check
 * @example
 * ```tsx
 * const hasItem = useHasItem("product-123");
 * ```
 */
export function useHasItem(productId: string) {
  return useHasCartItem(productId);
}

/**
 * Hook to get a specific cart item
 *
 * @param productId - The product ID to retrieve
 * @example
 * ```tsx
 * const item = useGetCartItem("product-123");
 * ```
 */
export function useGetCartItem(productId: string) {
  return useCartItem(productId);
}

/**
 * Hook with memoized add to cart function
 * Useful for event handlers that shouldn't change reference between renders
 */
export function useAddToCart() {
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  return useCallback(
    (product: Omit<CartItem, "quantity">, quantity?: number) => {
      addItem(product, quantity);
      openCart(); // Auto-open cart when item is added
    },
    [addItem, openCart],
  );
}

/**
 * Hook with memoized remove from cart function
 */
export function useRemoveFromCart() {
  const removeItem = useCartStore((state) => state.removeItem);

  return useCallback(
    (productId: string) => {
      removeItem(productId);
    },
    [removeItem],
  );
}

/**
 * Hook with memoized update quantity function
 */
export function useUpdateCartQuantity() {
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  return useCallback(
    (productId: string, quantity: number) => {
      updateQuantity(productId, quantity);
    },
    [updateQuantity],
  );
}

/**
 * Hook with memoized clear cart function
 */
export function useClearCart() {
  const clearCart = useCartStore((state) => state.clearCart);

  return useCallback(() => {
    clearCart();
  }, [clearCart]);
}

/**
 * Hook to manage cart open/close state
 */
export function useCartOpen() {
  const isOpen = useCartStore((state) => state.isOpen);
  const openCart = useCartStore((state) => state.openCart);
  const closeCart = useCartStore((state) => state.closeCart);

  return { isOpen, openCart, closeCart };
}
