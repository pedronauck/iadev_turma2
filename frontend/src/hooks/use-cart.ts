import { useCartStore } from "@/stores/cart-store";

export const useCart = () => {
  return useCartStore();
};

export const useCartItemCount = () => {
  return useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
};

export const useCartSubtotal = () => {
  return useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  );
};
