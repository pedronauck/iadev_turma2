import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, CartState, CartStore } from "@/types/cart";

/**
 * Zustand store for managing shopping cart state
 * Includes persist middleware for localStorage persistence with key "cart-store"
 *
 * Features:
 * - Type-safe state management with TypeScript
 * - localStorage persistence across browser sessions
 * - Efficient state updates and subscriptions
 * - Selector hooks for optimized re-renders
 */
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // State
      items: [],
      isOpen: false,

      // Actions
      /**
       * Add a new item to the cart or increment quantity if item already exists
       * Handles duplicate items by incrementing quantity
       * @param product - Product information without quantity
       * @param quantity - Quantity to add (defaults to 1)
       */
      addItem: (product, quantity = 1) => {
        if (quantity <= 0) {
          return;
        }

        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.productId === product.productId);

        if (existingItem) {
          // Update quantity for existing item
          set({
            items: currentItems.map((item) =>
              item.productId === product.productId
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            ),
          });
        } else {
          // Add new item to cart
          set({
            items: [...currentItems, { ...product, quantity }],
          });
        }
      },

      /**
       * Remove an item from the cart by productId
       * @param productId - The product ID to remove
       */
      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.productId !== productId),
        });
      },

      /**
       * Update the quantity of a cart item
       * If quantity is 0 or negative, item is removed
       * @param productId - The product ID to update
       * @param quantity - New quantity value
       */
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item,
          ),
        });
      },

      /**
       * Clear all items from the cart
       */
      clearCart: () => {
        set({ items: [] });
      },

      /**
       * Open the cart sheet
       */
      openCart: () => {
        set({ isOpen: true });
      },

      /**
       * Close the cart sheet
       */
      closeCart: () => {
        set({ isOpen: false });
      },
    }),
    {
      name: "cart-store", // localStorage key
      version: 1, // Schema version for migrations
    },
  ),
);

/**
 * Selector hook to get total price of all items in cart
 */
export const useCartTotalPrice = () =>
  useCartStore((state) =>
    state.items.reduce((total, item) => total + item.price * item.quantity, 0),
  );

/**
 * Selector hook to get total item count (sum of quantities)
 */
export const useCartItemCount = () =>
  useCartStore((state) => state.items.reduce((total, item) => total + item.quantity, 0));

/**
 * Selector hook to get the number of unique items in cart
 */
export const useCartUniqueItemCount = () => useCartStore((state) => state.items.length);

/**
 * Selector hook to check if an item exists in the cart
 */
export const useHasCartItem = (productId: string) =>
  useCartStore((state) => state.items.some((item) => item.productId === productId));

/**
 * Selector hook to get a specific item from cart
 */
export const useCartItem = (productId: string) =>
  useCartStore((state) => state.items.find((item) => item.productId === productId));
