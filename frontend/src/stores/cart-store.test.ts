import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore } from "./cart-store";

describe("Cart Store", () => {
  beforeEach(() => {
    // Reset store state before each test
    useCartStore.setState({ items: [], isOpen: false });
    // Clear localStorage
    localStorage.clear();
  });

  describe("addItem", () => {
    it("should add a new product with default quantity of 1", () => {
      // Arrange
      const product = {
        productId: "1",
        name: "Test Product",
        price: 100,
        image: "test.jpg",
      };

      // Act
      useCartStore.getState().addItem(product);

      // Assert
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual({ ...product, quantity: 1 });
    });

    it("should add item with specified quantity", () => {
      // Arrange
      const product = {
        productId: "1",
        name: "Test Product",
        price: 100,
        image: "test.jpg",
      };

      // Act
      useCartStore.getState().addItem(product, 3);

      // Assert
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(3);
    });

    it("should detect duplicate productId and accumulate quantity", () => {
      // Arrange
      const product = {
        productId: "1",
        name: "Test Product",
        price: 100,
        image: "test.jpg",
      };
      useCartStore.getState().addItem(product, 2);

      // Act
      useCartStore.getState().addItem(product, 3);

      // Assert
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(5);
    });

    it("should accumulate quantity correctly when adding existing item multiple times", () => {
      // Arrange
      const product = {
        productId: "1",
        name: "Test Product",
        price: 100,
        image: "test.jpg",
      };

      // Act
      useCartStore.getState().addItem(product, 1);
      useCartStore.getState().addItem(product, 1);
      useCartStore.getState().addItem(product, 2);

      // Assert
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(4);
    });

    it("should add multiple different products", () => {
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

      // Act
      useCartStore.getState().addItem(product1);
      useCartStore.getState().addItem(product2);

      // Assert
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(2);
      expect(state.items[0]).toEqual({ ...product1, quantity: 1 });
      expect(state.items[1]).toEqual({ ...product2, quantity: 1 });
    });
  });

  describe("removeItem", () => {
    it("should remove item by productId", () => {
      // Arrange
      const product = {
        productId: "1",
        name: "Test Product",
        price: 100,
        image: "test.jpg",
      };
      useCartStore.getState().addItem(product);

      // Act
      useCartStore.getState().removeItem("1");

      // Assert
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
    });

    it("should leave cart unchanged when removing non-existent productId", () => {
      // Arrange
      const product = {
        productId: "1",
        name: "Test Product",
        price: 100,
        image: "test.jpg",
      };
      useCartStore.getState().addItem(product);

      // Act
      useCartStore.getState().removeItem("999");

      // Assert
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].productId).toBe("1");
    });

    it("should only remove specified item when multiple items exist", () => {
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
      useCartStore.getState().addItem(product1);
      useCartStore.getState().addItem(product2);

      // Act
      useCartStore.getState().removeItem("1");

      // Assert
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].productId).toBe("2");
    });
  });

  describe("updateQuantity", () => {
    it("should update quantity for existing product", () => {
      // Arrange
      const product = {
        productId: "1",
        name: "Test Product",
        price: 100,
        image: "test.jpg",
      };
      useCartStore.getState().addItem(product, 5);

      // Act
      useCartStore.getState().updateQuantity("1", 10);

      // Assert
      const state = useCartStore.getState();
      expect(state.items[0].quantity).toBe(10);
    });

    it("should remove item when quantity is set to zero", () => {
      // Arrange
      const product = {
        productId: "1",
        name: "Test Product",
        price: 100,
        image: "test.jpg",
      };
      useCartStore.getState().addItem(product, 5);

      // Act
      useCartStore.getState().updateQuantity("1", 0);

      // Assert
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
    });

    it("should remove item when quantity is set to negative", () => {
      // Arrange
      const product = {
        productId: "1",
        name: "Test Product",
        price: 100,
        image: "test.jpg",
      };
      useCartStore.getState().addItem(product, 5);

      // Act
      useCartStore.getState().updateQuantity("1", -1);

      // Assert
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
    });

    it("should not affect other items when updating quantity", () => {
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
      useCartStore.getState().updateQuantity("1", 5);

      // Assert
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(2);
      expect(state.items[0].quantity).toBe(5);
      expect(state.items[1].quantity).toBe(3);
    });
  });

  describe("clearCart", () => {
    it("should empty all items from cart", () => {
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
      useCartStore.getState().addItem(product1);
      useCartStore.getState().addItem(product2);

      // Act
      useCartStore.getState().clearCart();

      // Assert
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
    });

    it("should handle clearing an already empty cart", () => {
      // Act
      useCartStore.getState().clearCart();

      // Assert
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
    });
  });

  describe("openCart and closeCart", () => {
    it("should set isOpen to true when openCart is called", () => {
      // Act
      useCartStore.getState().openCart();

      // Assert
      const state = useCartStore.getState();
      expect(state.isOpen).toBe(true);
    });

    it("should set isOpen to false when closeCart is called", () => {
      // Arrange
      useCartStore.getState().openCart();

      // Act
      useCartStore.getState().closeCart();

      // Assert
      const state = useCartStore.getState();
      expect(state.isOpen).toBe(false);
    });

    it("should toggle isOpen state correctly", () => {
      // Act
      useCartStore.getState().openCart();
      expect(useCartStore.getState().isOpen).toBe(true);

      useCartStore.getState().closeCart();
      expect(useCartStore.getState().isOpen).toBe(false);

      useCartStore.getState().openCart();

      // Assert
      expect(useCartStore.getState().isOpen).toBe(true);
    });
  });

  describe("localStorage persistence", () => {
    it("should persist store state to localStorage with key 'cart-storage'", () => {
      // Arrange
      const product = {
        productId: "1",
        name: "Test Product",
        price: 100,
        image: "test.jpg",
      };

      // Act
      useCartStore.getState().addItem(product);
      useCartStore.getState().openCart();

      // Assert - check localStorage directly
      const stored = localStorage.getItem("cart-storage");
      expect(stored).toBeTruthy();

      if (stored) {
        const parsed = JSON.parse(stored);
        expect(parsed.state).toBeDefined();
        expect(parsed.state.items).toHaveLength(1);
        expect(parsed.state.isOpen).toBe(true);
      }
    });

    it("should persist and retrieve state from localStorage", () => {
      // Arrange
      const product = {
        productId: "test-123",
        name: "Persisted Product",
        price: 150,
        image: "persisted.jpg",
      };

      // Act
      useCartStore.getState().addItem(product, 3);
      useCartStore.getState().openCart();

      // Assert - verify localStorage contains the correct data
      const stored = localStorage.getItem("cart-storage");
      expect(stored).toBeTruthy();

      if (stored) {
        const parsed = JSON.parse(stored);
        expect(parsed.state).toBeDefined();
        expect(parsed.state.items).toHaveLength(1);
        expect(parsed.state.items[0].productId).toBe("test-123");
        expect(parsed.state.items[0].quantity).toBe(3);
        expect(parsed.state.isOpen).toBe(true);
      }
    });
  });

  describe("state immutability", () => {
    it("should not mutate state directly - addItem creates new array", () => {
      // Arrange
      const product = {
        productId: "1",
        name: "Test Product",
        price: 100,
        image: "test.jpg",
      };
      const initialItems = useCartStore.getState().items;

      // Act
      useCartStore.getState().addItem(product);

      // Assert - should be a new array reference
      const updatedItems = useCartStore.getState().items;
      expect(initialItems).not.toBe(updatedItems);
    });

    it("should not mutate state directly - removeItem creates new array", () => {
      // Arrange
      const product = {
        productId: "1",
        name: "Test Product",
        price: 100,
        image: "test.jpg",
      };
      useCartStore.getState().addItem(product);
      const beforeRemove = useCartStore.getState().items;

      // Act
      useCartStore.getState().removeItem("1");

      // Assert
      const afterRemove = useCartStore.getState().items;
      expect(beforeRemove).not.toBe(afterRemove);
    });

    it("should maintain immutability during updateQuantity", () => {
      // Arrange
      const product = {
        productId: "1",
        name: "Test Product",
        price: 100,
        image: "test.jpg",
      };
      useCartStore.getState().addItem(product, 5);
      const beforeUpdate = useCartStore.getState().items;

      // Act
      useCartStore.getState().updateQuantity("1", 10);

      // Assert
      const afterUpdate = useCartStore.getState().items;
      expect(beforeUpdate).not.toBe(afterUpdate);
      expect(beforeUpdate[0]).not.toBe(afterUpdate[0]);
    });
  });

  describe("edge cases and rapid operations", () => {
    it("should handle multiple rapid addItem calls maintaining correct totals", () => {
      // Arrange
      const product = {
        productId: "1",
        name: "Test Product",
        price: 100,
        image: "test.jpg",
      };

      // Act
      for (let i = 0; i < 10; i++) {
        useCartStore.getState().addItem(product, 1);
      }

      // Assert
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(10);
    });

    it("should handle mixed operations maintaining consistency", () => {
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

      // Act
      useCartStore.getState().addItem(product1, 2);
      useCartStore.getState().addItem(product2, 3);
      useCartStore.getState().addItem(product1, 1); // Accumulate
      useCartStore.getState().updateQuantity("2", 5);
      useCartStore.getState().removeItem("1");
      useCartStore.getState().openCart();

      // Assert
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual({ ...product2, quantity: 5 });
      expect(state.isOpen).toBe(true);
    });

    it("should handle empty cart operations without errors", () => {
      // Act
      expect(() => {
        useCartStore.getState().clearCart();
        useCartStore.getState().removeItem("nonexistent");
        useCartStore.getState().updateQuantity("nonexistent", 5);
        useCartStore.getState().closeCart();
      }).not.toThrow();

      // Assert
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
    });
  });
});
