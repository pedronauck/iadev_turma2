import { useCartStore } from "@/stores/use-cart-store";

export const useCartItems = () => useCartStore((state) => state.items);

export const useCartIsOpen = () => useCartStore((state) => state.isOpen);

export const useCartItemCount = () =>
  useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));

export const useCartSubtotal = () =>
  useCartStore((state) => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0));

export const useCartActions = () =>
  useCartStore((state) => ({
    addItem: state.addItem,
    removeItem: state.removeItem,
    updateQuantity: state.updateQuantity,
    clearCart: state.clearCart,
    openCart: state.openCart,
    closeCart: state.closeCart,
    toggleCart: state.toggleCart,
  }));

export const useCart = () =>
  useCartStore((state) => ({
    items: state.items,
    isOpen: state.isOpen,
    addItem: state.addItem,
    removeItem: state.removeItem,
    updateQuantity: state.updateQuantity,
    clearCart: state.clearCart,
    openCart: state.openCart,
    closeCart: state.closeCart,
    toggleCart: state.toggleCart,
    getTotalItems: state.getTotalItems,
    getTotalPrice: state.getTotalPrice,
    getTotalQuantity: state.getTotalQuantity,
  }));
