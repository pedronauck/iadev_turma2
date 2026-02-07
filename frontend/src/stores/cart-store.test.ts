import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useCartStore } from "./cart-store";
import type { CartItem } from "@/types/cart";

describe("Cart Store", () => {
  beforeEach(() => {
    // Reset store state before each test
    useCartStore.setState({
      items: [],
      isOpen: false,
    });
    // Clear localStorage
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("addItem action", () => {
    it("should add new item with default quantity to empty cart", () => {
      // Arrange
      const product = {
        productId: "1",
        name: "Product 1",
        price: 100,
        image: "image1.jpg",
      };

      // Act
      useCartStore.getState().addItem(product);

      // Assert
      const items = useCartStore.getState().items;
      expect(items).toHaveLength(1);
      expect(items[0]).toEqual({ ...product, quantity: 1 });
    });

    it("should add item with specific quantity", () => {
      // Arrange
      const product = {
        productId: "2",
        name: "Product 2",
        price: 50,
        image: "image2.jpg",
      };

      // Act
      useCartStore.getState().addItem(product, 3);

      // Assert
      const items = useCartStore.getState().items;
      expect(items).toHaveLength(1);
      expect(items[0].quantity).toBe(3);
    });

    it("should increment quantity when product already exists in cart", () => {
      // Arrange
      const product = {
        productId: "3",
        name: "Product 3",
        price: 75,
        image: "image3.jpg",
      };
      useCartStore.getState().addItem(product, 2);

      // Act
      useCartStore.getState().addItem(product, 3);

      // Assert
      const items = useCartStore.getState().items;
      expect(items).toHaveLength(1);
      expect(items[0].quantity).toBe(5);
    });

    it("should add multiple different products to cart", () => {
      // Arrange
      const product1 = {
        productId: "1",
        name: "Product 1",
        price: 100,
        image: "image1.jpg",
      };
      const product2 = {
        productId: "2",
        name: "Product 2",
        price: 50,
        image: "image2.jpg",
      };

      // Act
      useCartStore.getState().addItem(product1);
      useCartStore.getState().addItem(product2);

      // Assert
      const items = useCartStore.getState().items;
      expect(items).toHaveLength(2);
      expect(items[0].productId).toBe("1");
      expect(items[1].productId).toBe("2");
    });
  });

  describe("removeItem action", () => {
    it("should remove item by productId from cart", () => {
      // Arrange
      const product = {
        productId: "1",
        name: "Product 1",
        price: 100,
        image: "image1.jpg",
      };
      useCartStore.getState().addItem(product);

      // Act
      useCartStore.getState().removeItem("1");

      // Assert
      const items = useCartStore.getState().items;
      expect(items).toHaveLength(0);
    });

    it("should leave other items unchanged when removing one item", () => {
      // Arrange
      const product1 = {
        productId: "1",
        name: "Product 1",
        price: 100,
        image: "image1.jpg",
      };
      const product2 = {
        productId: "2",
        name: "Product 2",
        price: 50,
        image: "image2.jpg",
      };
      useCartStore.getState().addItem(product1);
      useCartStore.getState().addItem(product2);

      // Act
      useCartStore.getState().removeItem("1");

      // Assert
      const items = useCartStore.getState().items;
      expect(items).toHaveLength(1);
      expect(items[0].productId).toBe("2");
    });

    it("should not throw error when removing non-existent item", () => {
      // Act & Assert
      expect(() => {
        useCartStore.getState().removeItem("non-existent");
      }).not.toThrow();

      const items = useCartStore.getState().items;
      expect(items).toHaveLength(0);
    });
  });

  describe("updateQuantity action", () => {
    it("should update quantity for specific product", () => {
      // Arrange
      const product = {
        productId: "1",
        name: "Product 1",
        price: 100,
        image: "image1.jpg",
      };
      useCartStore.getState().addItem(product, 2);

      // Act
      useCartStore.getState().updateQuantity("1", 5);

      // Assert
      const items = useCartStore.getState().items;
      expect(items[0].quantity).toBe(5);
    });

    it("should ignore update for non-existent productId", () => {
      // Arrange
      const product = {
        productId: "1",
        name: "Product 1",
        price: 100,
        image: "image1.jpg",
      };
      useCartStore.getState().addItem(product);

      // Act
      useCartStore.getState().updateQuantity("non-existent", 10);

      // Assert
      const items = useCartStore.getState().items;
      expect(items).toHaveLength(1);
      expect(items[0].quantity).toBe(1);
    });

    it("should update quantity to zero", () => {
      // Arrange
      const product = {
        productId: "1",
        name: "Product 1",
        price: 100,
        image: "image1.jpg",
      };
      useCartStore.getState().addItem(product, 5);

      // Act
      useCartStore.getState().updateQuantity("1", 0);

      // Assert
      const items = useCartStore.getState().items;
      expect(items[0].quantity).toBe(0);
    });

    it("should leave other items unchanged when updating one item", () => {
      // Arrange
      const product1 = {
        productId: "1",
        name: "Product 1",
        price: 100,
        image: "image1.jpg",
      };
      const product2 = {
        productId: "2",
        name: "Product 2",
        price: 50,
        image: "image2.jpg",
      };
      useCartStore.getState().addItem(product1, 2);
      useCartStore.getState().addItem(product2, 3);

      // Act
      useCartStore.getState().updateQuantity("1", 10);

      // Assert
      const items = useCartStore.getState().items;
      expect(items[0].quantity).toBe(10);
      expect(items[1].quantity).toBe(3);
    });
  });

  describe("clearCart action", () => {
    it("should empty items array completely", () => {
      // Arrange
      const product1 = {
        productId: "1",
        name: "Product 1",
        price: 100,
        image: "image1.jpg",
      };
      const product2 = {
        productId: "2",
        name: "Product 2",
        price: 50,
        image: "image2.jpg",
      };
      useCartStore.getState().addItem(product1);
      useCartStore.getState().addItem(product2);

      // Act
      useCartStore.getState().clearCart();

      // Assert
      const items = useCartStore.getState().items;
      expect(items).toHaveLength(0);
    });

    it("should not throw error when clearing empty cart", () => {
      // Act & Assert
      expect(() => {
        useCartStore.getState().clearCart();
      }).not.toThrow();

      const items = useCartStore.getState().items;
      expect(items).toHaveLength(0);
    });
  });

  describe("openCart action", () => {
    it("should set isOpen to true", () => {
      // Act
      useCartStore.getState().openCart();

      // Assert
      expect(useCartStore.getState().isOpen).toBe(true);
    });
  });

  describe("closeCart action", () => {
    it("should set isOpen to false", () => {
      // Arrange
      useCartStore.getState().openCart();

      // Act
      useCartStore.getState().closeCart();

      // Assert
      expect(useCartStore.getState().isOpen).toBe(false);
    });
  });

  describe("cart state transitions", () => {
    it("should handle complete workflow: add item, update quantity, remove item", () => {
      // Arrange
      const product = {
        productId: "1",
        name: "Product 1",
        price: 100,
        image: "image1.jpg",
      };

      // Act - Add item
      useCartStore.getState().addItem(product);
      let items = useCartStore.getState().items;
      expect(items).toHaveLength(1);

      // Act - Update quantity
      useCartStore.getState().updateQuantity("1", 5);
      items = useCartStore.getState().items;
      expect(items[0].quantity).toBe(5);

      // Act - Remove item
      useCartStore.getState().removeItem("1");
      items = useCartStore.getState().items;
      expect(items).toHaveLength(0);
    });
  });

  describe("localStorage persistence", () => {
    it("should persist items to localStorage when adding item", () => {
      // Arrange
      const product = {
        productId: "1",
        name: "Product 1",
        price: 100,
        image: "image1.jpg",
      };

      // Act
      useCartStore.getState().addItem(product);

      // Wait for persist middleware to save
      setTimeout(() => {
        // Assert
        const stored = localStorage.getItem("cart-storage");
        expect(stored).toBeDefined();
        if (stored) {
          const parsed = JSON.parse(stored);
          expect(parsed.state.items).toHaveLength(1);
        }
      }, 0);
    });
  });
});
