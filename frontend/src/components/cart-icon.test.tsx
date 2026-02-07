import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CartIcon } from "./cart-icon";
import { useCartStore } from "@/stores/cart-store";

// Mock the cart store
vi.mock("@/stores/cart-store", () => ({
  useCartStore: vi.fn(),
}));

describe("CartIcon component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render ShoppingCart icon", () => {
    // Arrange
    vi.mocked(useCartStore).mockImplementation((selector) =>
      selector({
        items: [],
        isOpen: false,
        addItem: vi.fn(),
        removeItem: vi.fn(),
        updateQuantity: vi.fn(),
        clearCart: vi.fn(),
        openCart: vi.fn(),
        closeCart: vi.fn(),
      }),
    );

    // Act
    render(<CartIcon />);

    // Assert
    const button = screen.getByRole("button", { name: /abrir carrinho/i });
    expect(button).toBeInTheDocument();
    expect(button.querySelector("svg")).toBeInTheDocument();
  });

  it("should display badge with correct item count", () => {
    // Arrange
    const openCartMock = vi.fn();
    vi.mocked(useCartStore).mockImplementation((selector) =>
      selector({
        items: [
          { productId: "1", name: "Product 1", price: 100, image: "test.jpg", quantity: 2 },
          { productId: "2", name: "Product 2", price: 200, image: "test2.jpg", quantity: 3 },
        ],
        isOpen: false,
        addItem: vi.fn(),
        removeItem: vi.fn(),
        updateQuantity: vi.fn(),
        clearCart: vi.fn(),
        openCart: openCartMock,
        closeCart: vi.fn(),
      }),
    );

    // Act
    render(<CartIcon />);

    // Assert
    const badge = screen.getByText("5");
    expect(badge).toBeInTheDocument();
  });

  it("should hide badge when cart is empty", () => {
    // Arrange
    vi.mocked(useCartStore).mockImplementation((selector) =>
      selector({
        items: [],
        isOpen: false,
        addItem: vi.fn(),
        removeItem: vi.fn(),
        updateQuantity: vi.fn(),
        clearCart: vi.fn(),
        openCart: vi.fn(),
        closeCart: vi.fn(),
      }),
    );

    // Act
    render(<CartIcon />);

    // Assert
    const badge = screen.queryByRole("status");
    expect(badge).not.toBeInTheDocument();
  });

  it("should call openCart when icon is clicked", async () => {
    // Arrange
    const openCartMock = vi.fn();
    vi.mocked(useCartStore).mockImplementation((selector) =>
      selector({
        items: [],
        isOpen: false,
        addItem: vi.fn(),
        removeItem: vi.fn(),
        updateQuantity: vi.fn(),
        clearCart: vi.fn(),
        openCart: openCartMock,
        closeCart: vi.fn(),
      }),
    );

    // Act
    const user = userEvent.setup();
    render(<CartIcon />);
    const button = screen.getByRole("button", { name: /abrir carrinho/i });
    await user.click(button);

    // Assert
    expect(openCartMock).toHaveBeenCalled();
  });

  it("should display single item count correctly", () => {
    // Arrange
    vi.mocked(useCartStore).mockImplementation((selector) =>
      selector({
        items: [{ productId: "1", name: "Product 1", price: 100, image: "test.jpg", quantity: 1 }],
        isOpen: false,
        addItem: vi.fn(),
        removeItem: vi.fn(),
        updateQuantity: vi.fn(),
        clearCart: vi.fn(),
        openCart: vi.fn(),
        closeCart: vi.fn(),
      }),
    );

    // Act
    render(<CartIcon />);

    // Assert
    const badge = screen.getByText("1");
    expect(badge).toBeInTheDocument();
  });

  it("should display correct count when items are updated", () => {
    // Arrange
    const openCartMock = vi.fn();
    const { rerender } = render(<CartIcon />);

    // Initial render with empty cart
    vi.mocked(useCartStore).mockImplementation((selector) =>
      selector({
        items: [],
        isOpen: false,
        addItem: vi.fn(),
        removeItem: vi.fn(),
        updateQuantity: vi.fn(),
        clearCart: vi.fn(),
        openCart: openCartMock,
        closeCart: vi.fn(),
      }),
    );
    rerender(<CartIcon />);

    // Update with items
    vi.mocked(useCartStore).mockImplementation((selector) =>
      selector({
        items: [{ productId: "1", name: "Product 1", price: 100, image: "test.jpg", quantity: 5 }],
        isOpen: false,
        addItem: vi.fn(),
        removeItem: vi.fn(),
        updateQuantity: vi.fn(),
        clearCart: vi.fn(),
        openCart: openCartMock,
        closeCart: vi.fn(),
      }),
    );
    rerender(<CartIcon />);

    // Assert
    const badge = screen.getByText("5");
    expect(badge).toBeInTheDocument();
  });
});
