import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, UseCartStore } from "@/types/cart";

export const useCartStore = create<UseCartStore>()(
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
          set({
            items: [...get().items, { ...product, quantity } as CartItem],
          });
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.productId !== productId),
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
        } else {
          set({
            items: get().items.map((item) =>
              item.productId === productId ? { ...item, quantity } : item,
            ),
          });
        }
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
