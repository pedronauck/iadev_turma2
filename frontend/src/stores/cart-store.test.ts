import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { useCartStore, useCartItemCount, useCartTotalPrice } from "./cart-store";
import type { CartItem } from "@/types/cart";

// Helper to reset store between tests
function resetStore() {
  useCartStore.setState({ items: [], isOpen: false });
}

describe("Cart Store", () => {
  beforeEach(() => {
    resetStore();
  });

  afterEach(() => {
    resetStore();
  });

  describe("Store Initialization", () => {
    it("should initialize with empty items and closed state", () => {
      // Arrange
      const state = useCartStore.getState();

      // Act & Assert
      expect(state.items).toEqual([]);
      expect(state.isOpen).toBe(false);
    });
  });

  describe("addItem action", () => {
    it("should add a new item to empty cart", () => {
      // Arrange
      const product: Omit<CartItem, "quantity"> = {
        productId: "1",
        name: "Test Product",
        price: 100,
        image: "test.jpg",
      };

      const store = useCartStore.getState();

      // Act
      store.addItem(product, 1);

      // Assert
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual({ ...product, quantity: 1 });
    });

    it("should add multiple items with different productIds", () => {
      // Arrange
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

      const store = useCartStore.getState();

      // Act
      store.addItem(product1, 1);
      store.addItem(product2, 1);

      // Assert
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(2);
      expect(state.items.map((i) => i.productId)).toEqual(["1", "2"]);
    });

    it("should increment quantity when adding existing item", () => {
      // Arrange
      const product: Omit<CartItem, "quantity"> = {
        productId: "1",
        name: "Test Product",
        price: 100,
        image: "test.jpg",
      };

      const store = useCartStore.getState();

      // Act
      store.addItem(product, 2);
      store.addItem(product, 3);

      // Assert
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(5);
    });

    it("should use default quantity of 1 when not specified", () => {
      // Arrange
      const product: Omit<CartItem, "quantity"> = {
        productId: "1",
        name: "Test Product",
        price: 100,
        image: "test.jpg",
      };

      const store = useCartStore.getState();

      // Act
      store.addItem(product);

      // Assert
      const state = useCartStore.getState();
      expect(state.items[0].quantity).toBe(1);
    });

    it("should not add item with zero quantity", () => {
      // Arrange
      const product: Omit<CartItem, "quantity"> = {
        productId: "1",
        name: "Test Product",
        price: 100,
        image: "test.jpg",
      };

      const store = useCartStore.getState();

      // Act
      store.addItem(product, 0);

      // Assert
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
    });

    it("should not add item with negative quantity", () => {
      // Arrange
      const product: Omit<CartItem, "quantity"> = {
        productId: "1",
        name: "Test Product",
        price: 100,
        image: "test.jpg",
      };

      const store = useCartStore.getState();

      // Act
      store.addItem(product, -5);

      // Assert
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
    });
  });

  describe("removeItem action", () => {
    it("should remove item by productId", () => {
      // Arrange
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

      const store = useCartStore.getState();
      store.addItem(product1, 1);
      store.addItem(product2, 1);

      // Act
      store.removeItem("1");

      // Assert
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].productId).toBe("2");
    });

    it("should handle removing non-existent item gracefully", () => {
      // Arrange
      const product: Omit<CartItem, "quantity"> = {
        productId: "1",
        name: "Product 1",
        price: 100,
        image: "p1.jpg",
      };

      const store = useCartStore.getState();
      store.addItem(product, 1);

      // Act
      store.removeItem("999");

      // Assert
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].productId).toBe("1");
    });

    it("should remove all items when all are removed individually", () => {
      // Arrange
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

      const store = useCartStore.getState();
      store.addItem(product1, 1);
      store.addItem(product2, 1);

      // Act
      store.removeItem("1");
      store.removeItem("2");

      // Assert
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
    });
  });

  describe("updateQuantity action", () => {
    it("should update item quantity to valid value", () => {
      // Arrange
      const product: Omit<CartItem, "quantity"> = {
        productId: "1",
        name: "Test Product",
        price: 100,
        image: "test.jpg",
      };

      const store = useCartStore.getState();
      store.addItem(product, 1);

      // Act
      store.updateQuantity("1", 5);

      // Assert
      const state = useCartStore.getState();
      expect(state.items[0].quantity).toBe(5);
    });

    it("should remove item when quantity set to zero", () => {
      // Arrange
      const product: Omit<CartItem, "quantity"> = {
        productId: "1",
        name: "Test Product",
        price: 100,
        image: "test.jpg",
      };

      const store = useCartStore.getState();
      store.addItem(product, 5);

      // Act
      store.updateQuantity("1", 0);

      // Assert
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
    });

    it("should remove item when quantity set to negative", () => {
      // Arrange
      const product: Omit<CartItem, "quantity"> = {
        productId: "1",
        name: "Test Product",
        price: 100,
        image: "test.jpg",
      };

      const store = useCartStore.getState();
      store.addItem(product, 5);

      // Act
      store.updateQuantity("1", -3);

      // Assert
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
    });

    it("should handle updating non-existent item gracefully", () => {
      // Arrange
      const product: Omit<CartItem, "quantity"> = {
        productId: "1",
        name: "Test Product",
        price: 100,
        image: "test.jpg",
      };

      const store = useCartStore.getState();
      store.addItem(product, 1);

      // Act
      store.updateQuantity("999", 5);

      // Assert
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(1);
    });
  });

  describe("clearCart action", () => {
    it("should clear all items from cart", () => {
      // Arrange
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

      const store = useCartStore.getState();
      store.addItem(product1, 2);
      store.addItem(product2, 3);

      // Act
      store.clearCart();

      // Assert
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
    });

    it("should clear cart even when empty", () => {
      // Arrange
      const store = useCartStore.getState();

      // Act & Assert
      expect(() => store.clearCart()).not.toThrow();
      expect(useCartStore.getState().items).toHaveLength(0);
    });
  });

  describe("openCart action", () => {
    it("should set isOpen to true", () => {
      // Arrange
      const store = useCartStore.getState();

      // Act
      store.openCart();

      // Assert
      expect(useCartStore.getState().isOpen).toBe(true);
    });
  });

  describe("closeCart action", () => {
    it("should set isOpen to false", () => {
      // Arrange
      const store = useCartStore.getState();
      store.openCart();

      // Act
      store.closeCart();

      // Assert
      expect(useCartStore.getState().isOpen).toBe(false);
    });
  });

  describe("Selectors", () => {
    describe("useCartItemCount selector", () => {
      it("should return 0 for empty cart", () => {
        // Arrange & Act
        const count = useCartItemCount();

        // Assert
        expect(count).toBe(0);
      });

      it("should return sum of all item quantities", () => {
        // Arrange
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

        const store = useCartStore.getState();
        store.addItem(product1, 3);
        store.addItem(product2, 5);

        // Act
        const count = useCartItemCount();

        // Assert
        expect(count).toBe(8);
      });

      it("should update when item quantity changes", () => {
        // Arrange
        const product: Omit<CartItem, "quantity"> = {
          productId: "1",
          name: "Test Product",
          price: 100,
          image: "test.jpg",
        };

        const store = useCartStore.getState();
        store.addItem(product, 2);

        let count = useCartItemCount();
        expect(count).toBe(2);

        // Act
        store.updateQuantity("1", 5);

        // Assert
        count = useCartItemCount();
        expect(count).toBe(5);
      });
    });

    describe("useCartTotalPrice selector", () => {
      it("should return 0 for empty cart", () => {
        // Arrange & Act
        const total = useCartTotalPrice();

        // Assert
        expect(total).toBe(0);
      });

      it("should calculate total price correctly", () => {
        // Arrange
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

        const store = useCartStore.getState();
        store.addItem(product1, 2); // 100 * 2 = 200
        store.addItem(product2, 3); // 50 * 3 = 150

        // Act
        const total = useCartTotalPrice();

        // Assert
        expect(total).toBe(350);
      });

      it("should update when quantity changes", () => {
        // Arrange
        const product: Omit<CartItem, "quantity"> = {
          productId: "1",
          name: "Test Product",
          price: 100,
          image: "test.jpg",
        };

        const store = useCartStore.getState();
        store.addItem(product, 1);

        let total = useCartTotalPrice();
        expect(total).toBe(100);

        // Act
        store.updateQuantity("1", 5);

        // Assert
        total = useCartTotalPrice();
        expect(total).toBe(500);
      });

      it("should update when item is removed", () => {
        // Arrange
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

        const store = useCartStore.getState();
        store.addItem(product1, 1);
        store.addItem(product2, 1);

        let total = useCartTotalPrice();
        expect(total).toBe(300);

        // Act
        store.removeItem("2");

        // Assert
        total = useCartTotalPrice();
        expect(total).toBe(100);
      });
    });
  });

  describe("Edge Cases and Integration", () => {
    it("should handle rapid successive additions of same item", () => {
      // Arrange
      const product: Omit<CartItem, "quantity"> = {
        productId: "1",
        name: "Test Product",
        price: 100,
        image: "test.jpg",
      };

      const store = useCartStore.getState();

      // Act
      for (let i = 0; i < 10; i++) {
        store.addItem(product, 1);
      }

      // Assert
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(10);
    });

    it("should maintain cart integrity after multiple operations", () => {
      // Arrange
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

      const store = useCartStore.getState();

      // Act
      store.addItem(product1, 2);
      store.addItem(product2, 3);
      store.updateQuantity("1", 5);
      store.removeItem("2");
      store.addItem(product2, 1);

      // Assert
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(2);
      expect(state.items[0]).toEqual({
        ...product1,
        quantity: 5,
      });
      expect(state.items[1]).toEqual({
        ...product2,
        quantity: 1,
      });
      expect(useCartTotalPrice()).toBe(500 + 200);
      expect(useCartItemCount()).toBe(6);
    });
  });
});
