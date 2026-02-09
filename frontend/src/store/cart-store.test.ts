import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore } from "./cart-store";
import type { AddToCartPayload } from "@/types/cart";

describe("cart-store", () => {
  beforeEach(() => {
    // Reset store state before each test
    useCartStore.setState({ items: [], isDrawerOpen: false });
    // Clear localStorage mock
    localStorage.clear();
  });

  describe("addItem", () => {
    it("should add new item to empty cart", () => {
      // Arrange
      const payload: AddToCartPayload = {
        productId: "prod-1",
        name: "Test Product",
        price: 29.9,
        imageUrl: "/test.jpg",
        quantity: 1,
      };

      // Act
      useCartStore.getState().addItem(payload);

      // Assert
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual(payload);
    });

    it("should increment quantity when adding existing product", () => {
      // Arrange
      const payload: AddToCartPayload = {
        productId: "prod-1",
        name: "Test Product",
        price: 29.9,
        imageUrl: "/test.jpg",
        quantity: 2,
      };
      useCartStore.getState().addItem(payload);

      // Act
      useCartStore.getState().addItem({ ...payload, quantity: 3 });

      // Assert
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(5);
    });

    it("should cap quantity at 99 when adding new item", () => {
      // Arrange
      const payload: AddToCartPayload = {
        productId: "prod-1",
        name: "Test Product",
        price: 29.9,
        imageUrl: null,
        quantity: 150,
      };

      // Act
      useCartStore.getState().addItem(payload);

      // Assert
      const state = useCartStore.getState();
      expect(state.items[0].quantity).toBe(99);
    });

    it("should cap quantity at 99 when incrementing existing item", () => {
      // Arrange
      const payload: AddToCartPayload = {
        productId: "prod-1",
        name: "Test Product",
        price: 29.9,
        imageUrl: null,
        quantity: 98,
      };
      useCartStore.getState().addItem(payload);

      // Act
      useCartStore.getState().addItem({ ...payload, quantity: 5 });

      // Assert
      const state = useCartStore.getState();
      expect(state.items[0].quantity).toBe(99);
    });
  });

  describe("removeItem", () => {
    it("should remove item with valid productId", () => {
      // Arrange
      useCartStore.setState({
        items: [
          {
            productId: "prod-1",
            name: "Product 1",
            price: 10,
            imageUrl: null,
            quantity: 1,
          },
          {
            productId: "prod-2",
            name: "Product 2",
            price: 20,
            imageUrl: null,
            quantity: 2,
          },
        ],
        isDrawerOpen: false,
      });

      // Act
      useCartStore.getState().removeItem("prod-1");

      // Assert
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].productId).toBe("prod-2");
    });

    it("should do nothing when removing non-existent productId", () => {
      // Arrange
      const initialItems = [
        {
          productId: "prod-1",
          name: "Product 1",
          price: 10,
          imageUrl: null,
          quantity: 1,
        },
      ];
      useCartStore.setState({ items: initialItems, isDrawerOpen: false });

      // Act
      useCartStore.getState().removeItem("non-existent");

      // Assert
      const state = useCartStore.getState();
      expect(state.items).toEqual(initialItems);
    });
  });

  describe("updateQuantity", () => {
    beforeEach(() => {
      useCartStore.setState({
        items: [
          {
            productId: "prod-1",
            name: "Product 1",
            price: 10,
            imageUrl: null,
            quantity: 5,
          },
        ],
        isDrawerOpen: false,
      });
    });

    it("should update quantity to valid value", () => {
      // Act
      useCartStore.getState().updateQuantity("prod-1", 10);

      // Assert
      const state = useCartStore.getState();
      expect(state.items[0].quantity).toBe(10);
    });

    it("should remove item when quantity is 0", () => {
      // Act
      useCartStore.getState().updateQuantity("prod-1", 0);

      // Assert
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
    });

    it("should cap quantity at 99", () => {
      // Act
      useCartStore.getState().updateQuantity("prod-1", 150);

      // Assert
      const state = useCartStore.getState();
      expect(state.items[0].quantity).toBe(99);
    });

    it("should clamp negative quantity to 1", () => {
      // Act
      useCartStore.getState().updateQuantity("prod-1", -5);

      // Assert
      const state = useCartStore.getState();
      expect(state.items[0].quantity).toBe(1);
    });

    it("should do nothing when updating non-existent productId", () => {
      // Arrange
      const initialQuantity = useCartStore.getState().items[0].quantity;

      // Act
      useCartStore.getState().updateQuantity("non-existent", 10);

      // Assert
      const state = useCartStore.getState();
      expect(state.items[0].quantity).toBe(initialQuantity);
    });
  });

  describe("clearCart", () => {
    it("should empty items array", () => {
      // Arrange
      useCartStore.setState({
        items: [
          {
            productId: "prod-1",
            name: "Product 1",
            price: 10,
            imageUrl: null,
            quantity: 1,
          },
          {
            productId: "prod-2",
            name: "Product 2",
            price: 20,
            imageUrl: null,
            quantity: 2,
          },
        ],
        isDrawerOpen: false,
      });

      // Act
      useCartStore.getState().clearCart();

      // Assert
      const state = useCartStore.getState();
      expect(state.items).toEqual([]);
    });
  });

  describe("drawer controls", () => {
    it("should open drawer", () => {
      // Act
      useCartStore.getState().openDrawer();

      // Assert
      expect(useCartStore.getState().isDrawerOpen).toBe(true);
    });

    it("should close drawer", () => {
      // Arrange
      useCartStore.setState({ items: [], isDrawerOpen: true });

      // Act
      useCartStore.getState().closeDrawer();

      // Assert
      expect(useCartStore.getState().isDrawerOpen).toBe(false);
    });

    it("should toggle drawer from closed to open", () => {
      // Arrange
      useCartStore.setState({ items: [], isDrawerOpen: false });

      // Act
      useCartStore.getState().toggleDrawer();

      // Assert
      expect(useCartStore.getState().isDrawerOpen).toBe(true);
    });

    it("should toggle drawer from open to closed", () => {
      // Arrange
      useCartStore.setState({ items: [], isDrawerOpen: true });

      // Act
      useCartStore.getState().toggleDrawer();

      // Assert
      expect(useCartStore.getState().isDrawerOpen).toBe(false);
    });
  });
});
