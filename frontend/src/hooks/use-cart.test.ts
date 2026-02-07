import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useCartStore } from "@/stores/cart-store";
import { useCartItemCount, useCartSubtotal } from "./use-cart";

describe("use-cart hooks", () => {
  beforeEach(() => {
    // Clear store state before each test
    useCartStore.setState({
      items: [],
      isOpen: false,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("useCartItemCount", () => {
    it("should return 0 for empty cart", () => {
      // Act
      const { result } = renderHook(() => useCartItemCount());

      // Assert
      expect(result.current).toBe(0);
    });

    it("should return correct sum of quantities for single item", () => {
      // Arrange
      const product = {
        productId: "prod-1",
        name: "Product 1",
        price: 10.0,
        image: "image-1.jpg",
      };
      useCartStore.getState().addItem(product, 3);

      // Act
      const { result } = renderHook(() => useCartItemCount());

      // Assert
      expect(result.current).toBe(3);
    });

    it("should return correct sum of quantities for multiple items", () => {
      // Arrange
      const product1 = {
        productId: "prod-1",
        name: "Product 1",
        price: 10.0,
        image: "image-1.jpg",
      };
      const product2 = {
        productId: "prod-2",
        name: "Product 2",
        price: 20.0,
        image: "image-2.jpg",
      };
      const product3 = {
        productId: "prod-3",
        name: "Product 3",
        price: 30.0,
        image: "image-3.jpg",
      };
      useCartStore.getState().addItem(product1, 2);
      useCartStore.getState().addItem(product2, 3);
      useCartStore.getState().addItem(product3, 1);

      // Act
      const { result } = renderHook(() => useCartItemCount());

      // Assert
      expect(result.current).toBe(6);
    });

    it("should update when store state changes", () => {
      // Arrange
      const product = {
        productId: "prod-1",
        name: "Product 1",
        price: 10.0,
        image: "image-1.jpg",
      };
      useCartStore.getState().addItem(product, 2);

      // Act
      const { result, rerender } = renderHook(() => useCartItemCount());
      expect(result.current).toBe(2);

      useCartStore.getState().addItem(product, 1);
      rerender();

      // Assert
      expect(result.current).toBe(3);
    });

    it("should recalculate when item is removed", () => {
      // Arrange
      const product1 = {
        productId: "prod-1",
        name: "Product 1",
        price: 10.0,
        image: "image-1.jpg",
      };
      const product2 = {
        productId: "prod-2",
        name: "Product 2",
        price: 20.0,
        image: "image-2.jpg",
      };
      useCartStore.getState().addItem(product1, 2);
      useCartStore.getState().addItem(product2, 3);

      // Act
      const { result, rerender } = renderHook(() => useCartItemCount());
      expect(result.current).toBe(5);

      useCartStore.getState().removeItem("prod-1");
      rerender();

      // Assert
      expect(result.current).toBe(3);
    });

    it("should handle quantity updates correctly", () => {
      // Arrange
      const product = {
        productId: "prod-1",
        name: "Product 1",
        price: 10.0,
        image: "image-1.jpg",
      };
      useCartStore.getState().addItem(product, 2);

      // Act
      const { result, rerender } = renderHook(() => useCartItemCount());
      expect(result.current).toBe(2);

      useCartStore.getState().updateQuantity("prod-1", 5);
      rerender();

      // Assert
      expect(result.current).toBe(5);
    });
  });

  describe("useCartSubtotal", () => {
    it("should return 0 for empty cart", () => {
      // Act
      const { result } = renderHook(() => useCartSubtotal());

      // Assert
      expect(result.current).toBe(0);
    });

    it("should calculate correct subtotal for single item", () => {
      // Arrange
      const product = {
        productId: "prod-1",
        name: "Product 1",
        price: 10.0,
        image: "image-1.jpg",
      };
      useCartStore.getState().addItem(product, 3);

      // Act
      const { result } = renderHook(() => useCartSubtotal());

      // Assert
      expect(result.current).toBe(30.0);
    });

    it("should calculate correct subtotal for multiple items", () => {
      // Arrange
      const product1 = {
        productId: "prod-1",
        name: "Product 1",
        price: 10.0,
        image: "image-1.jpg",
      };
      const product2 = {
        productId: "prod-2",
        name: "Product 2",
        price: 20.0,
        image: "image-2.jpg",
      };
      useCartStore.getState().addItem(product1, 2);
      useCartStore.getState().addItem(product2, 3);

      // Act
      const { result } = renderHook(() => useCartSubtotal());

      // Assert
      expect(result.current).toBe(80.0);
    });

    it("should handle decimal prices correctly", () => {
      // Arrange
      const product1 = {
        productId: "prod-1",
        name: "Product 1",
        price: 10.99,
        image: "image-1.jpg",
      };
      const product2 = {
        productId: "prod-2",
        name: "Product 2",
        price: 20.5,
        image: "image-2.jpg",
      };
      useCartStore.getState().addItem(product1, 2);
      useCartStore.getState().addItem(product2, 1);

      // Act
      const { result } = renderHook(() => useCartSubtotal());

      // Assert
      expect(result.current).toBeCloseTo(42.48, 2);
    });

    it("should recalculate when item is removed", () => {
      // Arrange
      const product1 = {
        productId: "prod-1",
        name: "Product 1",
        price: 10.0,
        image: "image-1.jpg",
      };
      const product2 = {
        productId: "prod-2",
        name: "Product 2",
        price: 20.0,
        image: "image-2.jpg",
      };
      useCartStore.getState().addItem(product1, 2);
      useCartStore.getState().addItem(product2, 3);

      // Act
      const { result, rerender } = renderHook(() => useCartSubtotal());
      expect(result.current).toBe(80.0);

      useCartStore.getState().removeItem("prod-1");
      rerender();

      // Assert
      expect(result.current).toBe(60.0);
    });

    it("should handle quantity updates correctly", () => {
      // Arrange
      const product = {
        productId: "prod-1",
        name: "Product 1",
        price: 10.0,
        image: "image-1.jpg",
      };
      useCartStore.getState().addItem(product, 2);

      // Act
      const { result, rerender } = renderHook(() => useCartSubtotal());
      expect(result.current).toBe(20.0);

      useCartStore.getState().updateQuantity("prod-1", 5);
      rerender();

      // Assert
      expect(result.current).toBe(50.0);
    });

    it("should recalculate correctly with complex state changes", () => {
      // Arrange
      const product1 = {
        productId: "prod-1",
        name: "Product 1",
        price: 15.0,
        image: "image-1.jpg",
      };
      const product2 = {
        productId: "prod-2",
        name: "Product 2",
        price: 25.0,
        image: "image-2.jpg",
      };
      const product3 = {
        productId: "prod-3",
        name: "Product 3",
        price: 35.0,
        image: "image-3.jpg",
      };

      // Act
      useCartStore.getState().addItem(product1, 1);
      const { result, rerender } = renderHook(() => useCartSubtotal());
      expect(result.current).toBe(15.0);

      useCartStore.getState().addItem(product2, 2);
      rerender();
      expect(result.current).toBe(65.0);

      useCartStore.getState().addItem(product3, 1);
      rerender();
      expect(result.current).toBe(100.0);

      useCartStore.getState().updateQuantity("prod-2", 1);
      rerender();
      expect(result.current).toBe(75.0);

      // Assert
      useCartStore.getState().removeItem("prod-3");
      rerender();
      expect(result.current).toBe(40.0);
    });

    it("should handle clearing cart", () => {
      // Arrange
      const product1 = {
        productId: "prod-1",
        name: "Product 1",
        price: 10.0,
        image: "image-1.jpg",
      };
      const product2 = {
        productId: "prod-2",
        name: "Product 2",
        price: 20.0,
        image: "image-2.jpg",
      };
      useCartStore.getState().addItem(product1, 2);
      useCartStore.getState().addItem(product2, 3);

      // Act
      const { result, rerender } = renderHook(() => useCartSubtotal());
      expect(result.current).toBe(80.0);

      useCartStore.getState().clearCart();
      rerender();

      // Assert
      expect(result.current).toBe(0);
    });
  });
});
