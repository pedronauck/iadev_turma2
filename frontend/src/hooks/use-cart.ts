import { useCartStore } from "@/store/cart-store";
import { shallow } from "zustand/shallow";
import type { CartItem } from "@/types/cart";

/**
 * Returns cart mutation actions with stable function references.
 * Does not trigger re-renders on state changes - mutations only.
 */
export function useCartActions() {
  return useCartStore(
    (s) => ({
      addItem: s.addItem,
      removeItem: s.removeItem,
      updateQuantity: s.updateQuantity,
      clearCart: s.clearCart,
    }),
    shallow,
  );
}

/**
 * Returns a single cart item by productId or undefined if not found.
 * Subscribes only to the specific item.
 */
export function useCartItem(productId: string): CartItem | undefined {
  return useCartStore((s) => s.items.find((item) => item.productId === productId));
}

/**
 * Returns derived cart totals: total item count and total price.
 * Uses shallow equality to prevent re-renders when values are unchanged.
 */
export function useCartSummary() {
  return useCartStore(
    (s) => ({
      totalItems: s.items.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: s.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    shallow,
  );
}

/**
 * Returns drawer control state and actions.
 * Combines state (isOpen, items) with actions (open, close, toggle).
 */
export function useCartDrawer() {
  return useCartStore(
    (s) => ({
      isOpen: s.isDrawerOpen,
      items: s.items,
      open: s.openDrawer,
      close: s.closeDrawer,
      toggle: s.toggleDrawer,
    }),
    shallow,
  );
}
