import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import type { CartItem, AddToCartPayload } from "@/types/cart";

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
}

interface CartActions {
  addItem: (payload: AddToCartPayload) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}

type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>()(
  persist(
    immer((set) => ({
      // State
      items: [],
      isDrawerOpen: false,

      // Actions
      addItem: (payload: AddToCartPayload) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.productId === payload.productId);

          if (existingItem) {
            // Increment quantity, cap at 99
            existingItem.quantity = Math.min(existingItem.quantity + payload.quantity, 99);
          } else {
            // Add new item, cap quantity at 99
            state.items.push({
              ...payload,
              quantity: Math.min(payload.quantity, 99),
            });
          }
        });
      },

      removeItem: (productId: string) => {
        set((state) => {
          state.items = state.items.filter((item) => item.productId !== productId);
        });
      },

      updateQuantity: (productId: string, quantity: number) => {
        set((state) => {
          if (quantity === 0) {
            // Remove item if quantity is 0
            state.items = state.items.filter((item) => item.productId !== productId);
          } else {
            const item = state.items.find((i) => i.productId === productId);
            if (item) {
              // Clamp quantity to [1, 99]
              item.quantity = Math.min(Math.max(quantity, 1), 99);
            }
          }
        });
      },

      clearCart: () => {
        set((state) => {
          state.items = [];
        });
      },

      openDrawer: () => {
        set((state) => {
          state.isDrawerOpen = true;
        });
      },

      closeDrawer: () => {
        set((state) => {
          state.isDrawerOpen = false;
        });
      },

      toggleDrawer: () => {
        set((state) => {
          state.isDrawerOpen = !state.isDrawerOpen;
        });
      },
    })),
    {
      name: "minha-loja-cart",
      version: 0,
      partialize: (state) => ({ items: state.items }),
      migrate: (persistedState) => {
        // Future migrations here
        return persistedState as CartStore;
      },
    },
  ),
);
