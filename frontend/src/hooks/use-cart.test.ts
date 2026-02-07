import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useCart, useCartItemCount, useCartSubtotal } from "./use-cart";
import { useCartStore } from "@/stores/cart-store";

describe("useCart hook", () => {
  beforeEach(() => {
    useCartStore.setState({
      items: [],
      isOpen: false,
    });
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return all store state and actions", () => {
    // Act
    const cart = useCart();

    // Assert
    expect(cart).toHaveProperty("items");
    expect(cart).toHaveProperty("isOpen");
    expect(cart).toHaveProperty("addItem");
    expect(cart).toHaveProperty("removeItem");
    expect(cart).toHaveProperty("updateQuantity");
    expect(cart).toHaveProperty("clearCart");
    expect(cart).toHaveProperty("openCart");
    expect(cart).toHaveProperty("closeCart");
  });

  it("should return correct initial state", () => {
    // Act
    const cart = useCart();

    // Assert
    expect(cart.items).toEqual([]);
    expect(cart.isOpen).toBe(false);
  });

  it("should return items array", () => {
    // Arrange
    const product = {
      productId: "1",
      name: "Product 1",
      price: 100,
      image: "image1.jpg",
    };
    useCartStore.getState().addItem(product);

    // Act
    const cart = useCart();

    // Assert
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].productId).toBe("1");
  });

  it("should return updated isOpen state", () => {
    // Act
    useCartStore.getState().openCart();
    const cart = useCart();

    // Assert
    expect(cart.isOpen).toBe(true);
  });

  it("should provide working addItem action", () => {
    // Arrange
    const cart = useCart();
    const product = {
      productId: "1",
      name: "Product 1",
      price: 100,
      image: "image1.jpg",
    };

    // Act
    cart.addItem(product);

    // Assert
    const updatedCart = useCart();
    expect(updatedCart.items).toHaveLength(1);
  });

  it("should provide working removeItem action", () => {
    // Arrange
    const product = {
      productId: "1",
      name: "Product 1",
      price: 100,
      image: "image1.jpg",
    };
    const cart = useCart();
    cart.addItem(product);

    // Act
    cart.removeItem("1");

    // Assert
    const updatedCart = useCart();
    expect(updatedCart.items).toHaveLength(0);
  });
});

describe("useCartItemCount hook", () => {
  beforeEach(() => {
    useCartStore.setState({
      items: [],
      isOpen: false,
    });
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return 0 for empty cart", () => {
    // Act
    const count = useCartItemCount();

    // Assert
    expect(count).toBe(0);
  });

  it("should return correct count for single item", () => {
    // Arrange
    const product = {
      productId: "1",
      name: "Product 1",
      price: 100,
      image: "image1.jpg",
    };
    useCartStore.getState().addItem(product, 3);

    // Act
    const count = useCartItemCount();

    // Assert
    expect(count).toBe(3);
  });

  it("should calculate correct sum for multiple items", () => {
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
    const product3 = {
      productId: "3",
      name: "Product 3",
      price: 75,
      image: "image3.jpg",
    };
    useCartStore.getState().addItem(product1, 2);
    useCartStore.getState().addItem(product2, 3);
    useCartStore.getState().addItem(product3, 1);

    // Act
    const count = useCartItemCount();

    // Assert
    expect(count).toBe(6); // 2 + 3 + 1
  });

  it("should update when items change", () => {
    // Arrange
    const product = {
      productId: "1",
      name: "Product 1",
      price: 100,
      image: "image1.jpg",
    };

    // Act & Assert - Add item
    useCartStore.getState().addItem(product, 2);
    let count = useCartItemCount();
    expect(count).toBe(2);

    // Act & Assert - Update quantity
    useCartStore.getState().updateQuantity("1", 5);
    count = useCartItemCount();
    expect(count).toBe(5);

    // Act & Assert - Remove item
    useCartStore.getState().removeItem("1");
    count = useCartItemCount();
    expect(count).toBe(0);
  });
});

describe("useCartSubtotal hook", () => {
  beforeEach(() => {
    useCartStore.setState({
      items: [],
      isOpen: false,
    });
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return 0 for empty cart", () => {
    // Act
    const subtotal = useCartSubtotal();

    // Assert
    expect(subtotal).toBe(0);
  });

  it("should calculate correct total for single item", () => {
    // Arrange
    const product = {
      productId: "1",
      name: "Product 1",
      price: 100,
      image: "image1.jpg",
    };
    useCartStore.getState().addItem(product, 3);

    // Act
    const subtotal = useCartSubtotal();

    // Assert
    expect(subtotal).toBe(300); // 100 * 3
  });

  it("should calculate correct total (price * quantity sum)", () => {
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
    const product3 = {
      productId: "3",
      name: "Product 3",
      price: 75,
      image: "image3.jpg",
    };
    useCartStore.getState().addItem(product1, 2);
    useCartStore.getState().addItem(product2, 3);
    useCartStore.getState().addItem(product3, 1);

    // Act
    const subtotal = useCartSubtotal();

    // Assert
    expect(subtotal).toBe(425); // (100 * 2) + (50 * 3) + (75 * 1) = 200 + 150 + 75
  });

  it("should update when quantities change", () => {
    // Arrange
    const product = {
      productId: "1",
      name: "Product 1",
      price: 100,
      image: "image1.jpg",
    };

    // Act & Assert - Add item
    useCartStore.getState().addItem(product, 2);
    let subtotal = useCartSubtotal();
    expect(subtotal).toBe(200); // 100 * 2

    // Act & Assert - Update quantity
    useCartStore.getState().updateQuantity("1", 5);
    subtotal = useCartSubtotal();
    expect(subtotal).toBe(500); // 100 * 5

    // Act & Assert - Remove item
    useCartStore.getState().removeItem("1");
    subtotal = useCartSubtotal();
    expect(subtotal).toBe(0);
  });

  it("should handle decimal prices correctly", () => {
    // Arrange
    const product1 = {
      productId: "1",
      name: "Product 1",
      price: 19.99,
      image: "image1.jpg",
    };
    const product2 = {
      productId: "2",
      name: "Product 2",
      price: 29.99,
      image: "image2.jpg",
    };
    useCartStore.getState().addItem(product1, 2);
    useCartStore.getState().addItem(product2, 1);

    // Act
    const subtotal = useCartSubtotal();

    // Assert
    expect(subtotal).toBeCloseTo(69.97, 2); // (19.99 * 2) + 29.99
  });
});
