import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface CartState {
  sessionId: string | null;
  itemCount: number;
  totalAmount: number;
}

interface CartActions {
  setSessionId: (id: string) => void;
  updateSummary: (itemCount: number, totalAmount: number) => void;
  clearCart: () => void;
}

type CartStore = CartState & { actions: CartActions };

export const useCartStore = create<CartStore>()(
  devtools(
    persist(
      immer((set) => ({
        sessionId: null,
        itemCount: 0,
        totalAmount: 0,
        actions: {
          setSessionId: (id: string) =>
            set((state) => {
              state.sessionId = id;
            }),
          updateSummary: (itemCount: number, totalAmount: number) =>
            set((state) => {
              state.itemCount = itemCount;
              state.totalAmount = totalAmount;
            }),
          clearCart: () =>
            set((state) => {
              state.itemCount = 0;
              state.totalAmount = 0;
            }),
        },
      })),
      {
        name: 'cart-storage',
        partialize: (state) => ({
          sessionId: state.sessionId,
        }),
      }
    ),
    { name: 'cart-store' }
  )
);

// Selector hooks for performance
export const useSessionId = () => useCartStore((state) => state.sessionId);
export const useCartItemCount = () => useCartStore((state) => state.itemCount);
export const useCartTotalAmount = () =>
  useCartStore((state) => state.totalAmount);
export const useCartActions = () => useCartStore((state) => state.actions);
