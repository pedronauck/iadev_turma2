import { useCartStore } from "@/stores/cart-store";

export const useCart = () => {
  return {
    items: useCartStore((state) => state.items),
    isOpen: useCartStore((state) => state.isOpen),
    addItem: useCartStore((state) => state.addItem),
    removeItem: useCartStore((state) => state.removeItem),
    updateQuantity: useCartStore((state) => state.updateQuantity),
    clearCart: useCartStore((state) => state.clearCart),
    openCart: useCartStore((state) => state.openCart),
    closeCart: useCartStore((state) => state.closeCart),
  };
};

export const useCartItemCount = () => {
  return useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
};

export const useCartSubtotal = () => {
  return useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  );
};
