import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useCartStore } from "./cart-store";
import type { CartItem } from "@/types/cart";

describe("cart-store", () => {
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

  describe("initial state", () => {
    it("should initialize with empty items array and isOpen false", () => {
      const state = useCartStore.getState();
      expect(state.items).toEqual([]);
      expect(state.isOpen).toBe(false);
    });
  });

  describe("addItem", () => {
    it("should create new item with quantity 1 when product does not exist", () => {
      // Arrange
      const product = {
        productId: "prod-1",
        name: "Product 1",
        price: 10.0,
        image: "image-1.jpg",
      };

      // Act
      useCartStore.getState().addItem(product);

      // Assert
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual({
        productId: "prod-1",
        name: "Product 1",
        price: 10.0,
        image: "image-1.jpg",
        quantity: 1,
      });
    });

    it("should create new item with custom quantity when product does not exist", () => {
      // Arrange
      const product = {
        productId: "prod-1",
        name: "Product 1",
        price: 10.0,
        image: "image-1.jpg",
      };

      // Act
      useCartStore.getState().addItem(product, 5);

      // Assert
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(5);
    });

    it("should increment quantity when same productId already exists", () => {
      // Arrange
      const product = {
        productId: "prod-1",
        name: "Product 1",
        price: 10.0,
        image: "image-1.jpg",
      };
      useCartStore.getState().addItem(product, 2);

      // Act
      useCartStore.getState().addItem(product, 3);

      // Assert
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(5);
    });

    it("should preserve other items when adding duplicate", () => {
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
      useCartStore.getState().addItem(product1, 1);
      useCartStore.getState().addItem(product2, 1);

      // Act
      useCartStore.getState().addItem(product1, 1);

      // Assert
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(2);
      expect(state.items[0].quantity).toBe(2);
      expect(state.items[1].quantity).toBe(1);
    });
  });

  describe("removeItem", () => {
    it("should remove item by productId", () => {
      // Arrange
      const product = {
        productId: "prod-1",
        name: "Product 1",
        price: 10.0,
        image: "image-1.jpg",
      };
      useCartStore.getState().addItem(product);

      // Act
      useCartStore.getState().removeItem("prod-1");

      // Assert
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
    });

    it("should handle removal of non-existent productId gracefully", () => {
      // Arrange
      const product = {
        productId: "prod-1",
        name: "Product 1",
        price: 10.0,
        image: "image-1.jpg",
      };
      useCartStore.getState().addItem(product);

      // Act
      useCartStore.getState().removeItem("non-existent");

      // Assert
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].productId).toBe("prod-1");
    });

    it("should preserve other items when removing specific item", () => {
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
      useCartStore.getState().addItem(product1);
      useCartStore.getState().addItem(product2);

      // Act
      useCartStore.getState().removeItem("prod-1");

      // Assert
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].productId).toBe("prod-2");
    });
  });

  describe("updateQuantity", () => {
    it("should update quantity for existing item", () => {
      // Arrange
      const product = {
        productId: "prod-1",
        name: "Product 1",
        price: 10.0,
        image: "image-1.jpg",
      };
      useCartStore.getState().addItem(product, 2);

      // Act
      useCartStore.getState().updateQuantity("prod-1", 5);

      // Assert
      const state = useCartStore.getState();
      expect(state.items[0].quantity).toBe(5);
    });

    it("should preserve other items when updating specific item", () => {
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
      useCartStore.getState().updateQuantity("prod-1", 7);

      // Assert
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(2);
      expect(state.items[0].quantity).toBe(7);
      expect(state.items[1].quantity).toBe(3);
    });

    it("should handle updating quantity to zero", () => {
      // Arrange
      const product = {
        productId: "prod-1",
        name: "Product 1",
        price: 10.0,
        image: "image-1.jpg",
      };
      useCartStore.getState().addItem(product, 2);

      // Act
      useCartStore.getState().updateQuantity("prod-1", 0);

      // Assert
      const state = useCartStore.getState();
      expect(state.items[0].quantity).toBe(0);
    });

    it("should handle updating quantity for non-existent item gracefully", () => {
      // Arrange
      const product = {
        productId: "prod-1",
        name: "Product 1",
        price: 10.0,
        image: "image-1.jpg",
      };
      useCartStore.getState().addItem(product);

      // Act
      useCartStore.getState().updateQuantity("non-existent", 5);

      // Assert
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(1);
    });
  });

  describe("clearCart", () => {
    it("should empty items array completely", () => {
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
      useCartStore.getState().addItem(product1);
      useCartStore.getState().addItem(product2);

      // Act
      useCartStore.getState().clearCart();

      // Assert
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
    });
  });

  describe("openCart and closeCart", () => {
    it("should set isOpen to true when calling openCart", () => {
      // Act
      useCartStore.getState().openCart();

      // Assert
      const state = useCartStore.getState();
      expect(state.isOpen).toBe(true);
    });

    it("should set isOpen to false when calling closeCart", () => {
      // Arrange
      useCartStore.getState().openCart();

      // Act
      useCartStore.getState().closeCart();

      // Assert
      const state = useCartStore.getState();
      expect(state.isOpen).toBe(false);
    });
  });

  describe("multiple operations", () => {
    it("should handle complex sequence of operations", () => {
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

      // Act
      useCartStore.getState().addItem(product1, 2);
      useCartStore.getState().addItem(product2, 1);
      useCartStore.getState().updateQuantity("prod-1", 3);
      useCartStore.getState().removeItem("prod-2");
      useCartStore.getState().openCart();

      // Assert
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].productId).toBe("prod-1");
      expect(state.items[0].quantity).toBe(3);
      expect(state.isOpen).toBe(true);
    });
  });
});
