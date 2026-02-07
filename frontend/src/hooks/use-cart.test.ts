import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import {
  useCart,
  useCartItems,
  useCartTotals,
  useCartSummary,
  useHasItem,
  useGetCartItem,
  useAddToCart,
  useRemoveFromCart,
  useUpdateCartQuantity,
  useClearCart,
  useCartOpen,
} from "./use-cart";
import { useCartStore } from "@/stores/cart-store";
import type { CartItem } from "@/types/cart";

// Helper to reset store between tests
function resetStore() {
  useCartStore.setState({ items: [], isOpen: false });
}

describe("Cart Hooks", () => {
  beforeEach(() => {
    resetStore();
  });

  afterEach(() => {
    resetStore();
  });

  describe("useCart hook", () => {
    it("should provide all cart methods and state", () => {
      // Arrange & Act
      const { result } = renderHook(() => useCart());

      // Assert
      expect(result.current).toHaveProperty("items");
      expect(result.current).toHaveProperty("isOpen");
      expect(result.current).toHaveProperty("addItem");
      expect(result.current).toHaveProperty("removeItem");
      expect(result.current).toHaveProperty("updateQuantity");
      expect(result.current).toHaveProperty("clearCart");
      expect(result.current).toHaveProperty("openCart");
      expect(result.current).toHaveProperty("closeCart");
    });

    it("should start with empty cart and closed state", () => {
      // Arrange & Act
      const { result } = renderHook(() => useCart());

      // Assert
      expect(result.current.items).toEqual([]);
      expect(result.current.isOpen).toBe(false);
    });

    it("should add item to cart", () => {
      // Arrange
      const { result } = renderHook(() => useCart());
      const product: Omit<CartItem, "quantity"> = {
        productId: "1",
        name: "Test Product",
        price: 100,
        image: "test.jpg",
      };

      // Act
      act(() => {
        result.current.addItem(product, 1);
      });

      // Assert
      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0]).toEqual({ ...product, quantity: 1 });
    });

    it("should remove item from cart", () => {
      // Arrange
      const { result } = renderHook(() => useCart());
      const product: Omit<CartItem, "quantity"> = {
        productId: "1",
        name: "Test Product",
        price: 100,
        image: "test.jpg",
      };

      act(() => {
        result.current.addItem(product, 1);
      });

      // Act
      act(() => {
        result.current.removeItem("1");
      });

      // Assert
      expect(result.current.items).toHaveLength(0);
    });

    it("should update item quantity", () => {
      // Arrange
      const { result } = renderHook(() => useCart());
      const product: Omit<CartItem, "quantity"> = {
        productId: "1",
        name: "Test Product",
        price: 100,
        image: "test.jpg",
      };

      act(() => {
        result.current.addItem(product, 1);
      });

      // Act
      act(() => {
        result.current.updateQuantity("1", 5);
      });

      // Assert
      expect(result.current.items[0].quantity).toBe(5);
    });

    it("should clear cart", () => {
      // Arrange
      const { result } = renderHook(() => useCart());
      const product: Omit<CartItem, "quantity"> = {
        productId: "1",
        name: "Test Product",
        price: 100,
        image: "test.jpg",
      };

      act(() => {
        result.current.addItem(product, 1);
      });

      // Act
      act(() => {
        result.current.clearCart();
      });

      // Assert
      expect(result.current.items).toHaveLength(0);
    });

    it("should open and close cart", () => {
      // Arrange
      const { result } = renderHook(() => useCart());

      // Act
      act(() => {
        result.current.openCart();
      });

      // Assert
      expect(result.current.isOpen).toBe(true);

      // Act
      act(() => {
        result.current.closeCart();
      });

      // Assert
      expect(result.current.isOpen).toBe(false);
    });
  });

  describe("useCartItems hook", () => {
    it("should return items array", () => {
      // Arrange & Act
      const { result } = renderHook(() => useCartItems());

      // Assert
      expect(Array.isArray(result.current)).toBe(true);
      expect(result.current).toEqual([]);
    });

    it("should return updated items after adding item", () => {
      // Arrange
      const { result } = renderHook(() => useCartItems());
      const product: Omit<CartItem, "quantity"> = {
        productId: "1",
        name: "Test Product",
        price: 100,
        image: "test.jpg",
      };

      // Act
      act(() => {
        useCartStore.getState().addItem(product, 1);
      });

      // Assert
      expect(result.current).toHaveLength(1);
    });
  });

  describe("useCartTotals hook", () => {
    it("should return totals object with totalPrice and itemCount", () => {
      // Arrange & Act
      const { result } = renderHook(() => useCartTotals());

      // Assert
      expect(result.current).toHaveProperty("totalPrice");
      expect(result.current).toHaveProperty("itemCount");
    });

    it("should return zero values for empty cart", () => {
      // Arrange & Act
      const { result } = renderHook(() => useCartTotals());

      // Assert
      expect(result.current.totalPrice).toBe(0);
      expect(result.current.itemCount).toBe(0);
    });

    it("should calculate correct totals", () => {
      // Arrange
      const { result } = renderHook(() => useCartTotals());
      const product1: Omit<CartItem, "quantity"> = {
        productId: "1",
        name: "Product 1",
        price: 100,
        image: "p1.jpg",
      };
      const product2: Omit<CartItem, "quantity"> = {
        productId: "2",
        name: "Product 2",
        price: 50,
        image: "p2.jpg",
      };

      // Act
      act(() => {
        useCartStore.getState().addItem(product1, 2);
        useCartStore.getState().addItem(product2, 3);
      });

      // Assert
      expect(result.current.totalPrice).toBe(350); // (100 * 2) + (50 * 3)
      expect(result.current.itemCount).toBe(5); // 2 + 3
    });
  });

  describe("useCartSummary hook", () => {
    it("should return all summary data at once", () => {
      // Arrange & Act
      const { result } = renderHook(() => useCartSummary());

      // Assert
      expect(result.current).toHaveProperty("items");
      expect(result.current).toHaveProperty("itemCount");
      expect(result.current).toHaveProperty("uniqueItemCount");
      expect(result.current).toHaveProperty("totalPrice");
      expect(result.current).toHaveProperty("isOpen");
    });

    it("should include all required values", () => {
      // Arrange
      const product: Omit<CartItem, "quantity"> = {
        productId: "1",
        name: "Test Product",
        price: 100,
        image: "test.jpg",
      };

      const { result } = renderHook(() => useCartSummary());

      // Act
      act(() => {
        useCartStore.getState().addItem(product, 2);
        useCartStore.getState().openCart();
      });

      // Assert
      expect(result.current.items).toHaveLength(1);
      expect(result.current.itemCount).toBe(2);
      expect(result.current.uniqueItemCount).toBe(1);
      expect(result.current.totalPrice).toBe(200);
      expect(result.current.isOpen).toBe(true);
    });
  });

  describe("useHasItem hook", () => {
    it("should return false when item is not in cart", () => {
      // Arrange & Act
      const { result } = renderHook(() => useHasItem("999"));

      // Assert
      expect(result.current).toBe(false);
    });

    it("should return true when item exists in cart", () => {
      // Arrange
      const product: Omit<CartItem, "quantity"> = {
        productId: "1",
        name: "Test Product",
        price: 100,
        image: "test.jpg",
      };

      act(() => {
        useCartStore.getState().addItem(product, 1);
      });

      // Act
      const { result } = renderHook(() => useHasItem("1"));

      // Assert
      expect(result.current).toBe(true);
    });
  });

  describe("useGetCartItem hook", () => {
    it("should return undefined when item is not in cart", () => {
      // Arrange & Act
      const { result } = renderHook(() => useGetCartItem("999"));

      // Assert
      expect(result.current).toBeUndefined();
    });

    it("should return item when it exists in cart", () => {
      // Arrange
      const product: Omit<CartItem, "quantity"> = {
        productId: "1",
        name: "Test Product",
        price: 100,
        image: "test.jpg",
      };

      act(() => {
        useCartStore.getState().addItem(product, 5);
      });

      // Act
      const { result } = renderHook(() => useGetCartItem("1"));

      // Assert
      expect(result.current).toEqual({ ...product, quantity: 5 });
    });
  });

  describe("useAddToCart hook", () => {
    it("should return a function", () => {
      // Arrange & Act
      const { result } = renderHook(() => useAddToCart());

      // Assert
      expect(typeof result.current).toBe("function");
    });

    it("should add item and open cart", () => {
      // Arrange
      const { result } = renderHook(() => useAddToCart());
      const product: Omit<CartItem, "quantity"> = {
        productId: "1",
        name: "Test Product",
        price: 100,
        image: "test.jpg",
      };

      // Act
      act(() => {
        result.current(product, 1);
      });

      // Assert
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.isOpen).toBe(true);
    });

    it("should use default quantity of 1", () => {
      // Arrange
      const { result } = renderHook(() => useAddToCart());
      const product: Omit<CartItem, "quantity"> = {
        productId: "1",
        name: "Test Product",
        price: 100,
        image: "test.jpg",
      };

      // Act
      act(() => {
        result.current(product);
      });

      // Assert
      expect(useCartStore.getState().items[0].quantity).toBe(1);
    });
  });

  describe("useRemoveFromCart hook", () => {
    it("should return a function", () => {
      // Arrange & Act
      const { result } = renderHook(() => useRemoveFromCart());

      // Assert
      expect(typeof result.current).toBe("function");
    });

    it("should remove item from cart", () => {
      // Arrange
      const product: Omit<CartItem, "quantity"> = {
        productId: "1",
        name: "Test Product",
        price: 100,
        image: "test.jpg",
      };

      act(() => {
        useCartStore.getState().addItem(product, 1);
      });

      const { result } = renderHook(() => useRemoveFromCart());

      // Act
      act(() => {
        result.current("1");
      });

      // Assert
      expect(useCartStore.getState().items).toHaveLength(0);
    });
  });

  describe("useUpdateCartQuantity hook", () => {
    it("should return a function", () => {
      // Arrange & Act
      const { result } = renderHook(() => useUpdateCartQuantity());

      // Assert
      expect(typeof result.current).toBe("function");
    });

    it("should update item quantity", () => {
      // Arrange
      const product: Omit<CartItem, "quantity"> = {
        productId: "1",
        name: "Test Product",
        price: 100,
        image: "test.jpg",
      };

      act(() => {
        useCartStore.getState().addItem(product, 1);
      });

      const { result } = renderHook(() => useUpdateCartQuantity());

      // Act
      act(() => {
        result.current("1", 5);
      });

      // Assert
      expect(useCartStore.getState().items[0].quantity).toBe(5);
    });
  });

  describe("useClearCart hook", () => {
    it("should return a function", () => {
      // Arrange & Act
      const { result } = renderHook(() => useClearCart());

      // Assert
      expect(typeof result.current).toBe("function");
    });

    it("should clear all items from cart", () => {
      // Arrange
      const product: Omit<CartItem, "quantity"> = {
        productId: "1",
        name: "Test Product",
        price: 100,
        image: "test.jpg",
      };

      act(() => {
        useCartStore.getState().addItem(product, 1);
      });

      const { result } = renderHook(() => useClearCart());

      // Act
      act(() => {
        result.current();
      });

      // Assert
      expect(useCartStore.getState().items).toHaveLength(0);
    });
  });

  describe("useCartOpen hook", () => {
    it("should return isOpen state and action functions", () => {
      // Arrange & Act
      const { result } = renderHook(() => useCartOpen());

      // Assert
      expect(result.current).toHaveProperty("isOpen");
      expect(result.current).toHaveProperty("openCart");
      expect(result.current).toHaveProperty("closeCart");
    });

    it("should start with closed state", () => {
      // Arrange & Act
      const { result } = renderHook(() => useCartOpen());

      // Assert
      expect(result.current.isOpen).toBe(false);
    });

    it("should open and close cart", () => {
      // Arrange
      const { result } = renderHook(() => useCartOpen());

      // Act
      act(() => {
        result.current.openCart();
      });

      // Assert
      expect(result.current.isOpen).toBe(true);

      // Act
      act(() => {
        result.current.closeCart();
      });

      // Assert
      expect(result.current.isOpen).toBe(false);
    });
  });

  describe("Hook Integration and Optimization", () => {
    it("should allow multiple hooks to share the same store state", () => {
      // Arrange
      const { result: cartResult } = renderHook(() => useCart());
      const { result: totalsResult } = renderHook(() => useCartTotals());
      const product: Omit<CartItem, "quantity"> = {
        productId: "1",
        name: "Test Product",
        price: 100,
        image: "test.jpg",
      };

      // Act
      act(() => {
        cartResult.current.addItem(product, 2);
      });

      // Assert
      expect(cartResult.current.items).toHaveLength(1);
      expect(totalsResult.current.itemCount).toBe(2);
      expect(totalsResult.current.totalPrice).toBe(200);
    });

    it("should support complex workflows", () => {
      // Arrange
      const { result: cartResult } = renderHook(() => useCart());
      const { result: summaryResult } = renderHook(() => useCartSummary());
      const product1: Omit<CartItem, "quantity"> = {
        productId: "1",
        name: "Product 1",
        price: 100,
        image: "p1.jpg",
      };
      const product2: Omit<CartItem, "quantity"> = {
        productId: "2",
        name: "Product 2",
        price: 200,
        image: "p2.jpg",
      };

      // Act
      act(() => {
        cartResult.current.addItem(product1, 2);
        cartResult.current.addItem(product2, 1);
        cartResult.current.openCart();
      });

      // Assert
      expect(summaryResult.current.itemCount).toBe(3);
      expect(summaryResult.current.uniqueItemCount).toBe(2);
      expect(summaryResult.current.totalPrice).toBe(400);
      expect(summaryResult.current.isOpen).toBe(true);

      // Act - Update quantity
      act(() => {
        cartResult.current.updateQuantity("1", 5);
      });

      // Assert
      expect(summaryResult.current.itemCount).toBe(6);
      expect(summaryResult.current.totalPrice).toBe(700);

      // Act - Remove item
      act(() => {
        cartResult.current.removeItem("2");
      });

      // Assert
      expect(summaryResult.current.uniqueItemCount).toBe(1);
      expect(summaryResult.current.totalPrice).toBe(500);
    });
  });
});
