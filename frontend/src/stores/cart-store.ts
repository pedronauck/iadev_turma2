import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, CartState, CartActions } from "@/types/cart";

type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product: Omit<CartItem, "quantity">, quantity: number = 1) => {
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
            items: [...get().items, { ...product, quantity }],
          });
        }
      },

      removeItem: (productId: string) => {
        set({
          items: get().items.filter((item) => item.productId !== productId),
        });
      },

      updateQuantity: (productId: string, quantity: number) => {
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
