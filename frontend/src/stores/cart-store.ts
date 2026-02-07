import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartStore, CartItem } from "@/types/cart";

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1) => {
        const existing = get().items.find((item) => item.productId === product.productId);

        if (existing) {
          set({
            items: get().items.map((item) =>
              item.productId === product.productId
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            ),
          });
        } else {
          const newItem: CartItem = {
            ...product,
            quantity,
          };
          set({ items: [...get().items, newItem] });
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.productId !== productId),
        });
      },

      updateQuantity: (productId, quantity) => {
        set({
          items: get().items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item,
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },
    }),
    {
      name: "cart-storage",
    },
  ),
);
