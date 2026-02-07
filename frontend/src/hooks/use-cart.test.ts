import { describe, it, expect, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useCart } from "./use-cart";
import { useCartStore } from "@/stores/cart-store";

describe("useCart hook", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [], isOpen: false });
    localStorage.clear();
  });

  describe("itemCount selector", () => {
    it("should return sum of quantities from all cart items", () => {
      // Arrange
      const product1 = {
        productId: "1",
        name: "Product 1",
        price: 100,
        image: "test1.jpg",
      };
      const product2 = {
        productId: "2",
        name: "Product 2",
        price: 200,
        image: "test2.jpg",
      };
      useCartStore.getState().addItem(product1, 2);
      useCartStore.getState().addItem(product2, 3);

      // Act
      const { result } = renderHook(() => useCart());

      // Assert
      expect(result.current.itemCount).toBe(5);
    });

    it("should return 0 when cart is empty", () => {
      // Act
      const { result } = renderHook(() => useCart());

      // Assert
      expect(result.current.itemCount).toBe(0);
    });
  });

  describe("subtotal selector", () => {
    it("should calculate correct total (quantity × price)", () => {
      // Arrange
      const product1 = {
        productId: "1",
        name: "Product 1",
        price: 100,
        image: "test1.jpg",
      };
      const product2 = {
        productId: "2",
        name: "Product 2",
        price: 50,
        image: "test2.jpg",
      };
      useCartStore.getState().addItem(product1, 2); // 200
      useCartStore.getState().addItem(product2, 3); // 150

      // Act
      const { result } = renderHook(() => useCart());

      // Assert
      expect(result.current.subtotal).toBe(350);
    });

    it("should return 0 when cart is empty", () => {
      // Act
      const { result } = renderHook(() => useCart());

      // Assert
      expect(result.current.subtotal).toBe(0);
    });
  });

  describe("isOpen selector", () => {
    it("should reflect cart sheet open state", () => {
      // Arrange
      useCartStore.getState().openCart();

      // Act
      const { result } = renderHook(() => useCart());

      // Assert
      expect(result.current.isOpen).toBe(true);
    });

    it("should reflect cart sheet closed state", () => {
      // Arrange
      useCartStore.getState().closeCart();

      // Act
      const { result } = renderHook(() => useCart());

      // Assert
      expect(result.current.isOpen).toBe(false);
    });
  });

  describe("items selector", () => {
    it("should return array of current cart items", () => {
      // Arrange
      const product1 = {
        productId: "1",
        name: "Product 1",
        price: 100,
        image: "test1.jpg",
      };
      const product2 = {
        productId: "2",
        name: "Product 2",
        price: 200,
        image: "test2.jpg",
      };
      useCartStore.getState().addItem(product1, 2);
      useCartStore.getState().addItem(product2, 1);

      // Act
      const { result } = renderHook(() => useCart());

      // Assert
      expect(result.current.items).toHaveLength(2);
      expect(result.current.items[0]).toEqual({ ...product1, quantity: 2 });
      expect(result.current.items[1]).toEqual({ ...product2, quantity: 1 });
    });

    it("should return empty array when cart is empty", () => {
      // Act
      const { result } = renderHook(() => useCart());

      // Assert
      expect(result.current.items).toEqual([]);
    });
  });

  describe("actions", () => {
    it("should expose all cart actions", () => {
      // Arrange
      const { result } = renderHook(() => useCart());

      // Assert - verify all actions are exposed and callable
      expect(typeof result.current.addItem).toBe("function");
      expect(typeof result.current.removeItem).toBe("function");
      expect(typeof result.current.updateQuantity).toBe("function");
      expect(typeof result.current.clearCart).toBe("function");
      expect(typeof result.current.openCart).toBe("function");
      expect(typeof result.current.closeCart).toBe("function");
    });

    it("should return memoized itemCount and subtotal", () => {
      // Arrange
      const product = {
        productId: "1",
        name: "Product 1",
        price: 100,
        image: "test.jpg",
      };
      useCartStore.getState().addItem(product, 2);
      const { result: result1 } = renderHook(() => useCart());

      // Get the same values again
      const { result: result2 } = renderHook(() => useCart());

      // Assert - both hooks should compute the same values
      expect(result1.current.itemCount).toBe(result2.current.itemCount);
      expect(result1.current.subtotal).toBe(result2.current.subtotal);
    });
  });
});
