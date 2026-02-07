import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CartItemComponent } from "./cart-item";
import type { CartItem } from "@/types/cart";

describe("CartItem component", () => {
  const mockItem: CartItem = {
    productId: "1",
    name: "Test Product",
    price: 100,
    image: "test.jpg",
    quantity: 2,
  };

  it("should render product image, name, and price", () => {
    // Arrange
    const onQuantityChange = vi.fn();
    const onRemove = vi.fn();

    // Act
    render(
      <CartItemComponent item={mockItem} onQuantityChange={onQuantityChange} onRemove={onRemove} />,
    );

    // Assert
    expect(screen.getByAltText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText(/R\$ 100,00/)).toBeInTheDocument();
  });

  it("should display correct quantity", () => {
    // Arrange
    const onQuantityChange = vi.fn();
    const onRemove = vi.fn();

    // Act
    render(
      <CartItemComponent item={mockItem} onQuantityChange={onQuantityChange} onRemove={onRemove} />,
    );

    // Assert
    const quantityTexts = screen.getAllByText("2");
    expect(quantityTexts.length).toBeGreaterThan(0);
  });

  it("should call onQuantityChange when quantity is increased", async () => {
    // Arrange
    const onQuantityChange = vi.fn();
    const onRemove = vi.fn();
    const user = userEvent.setup();

    render(
      <CartItemComponent item={mockItem} onQuantityChange={onQuantityChange} onRemove={onRemove} />,
    );

    // Act
    const increaseButton = screen.getAllByRole("button")[1]; // The increase button
    await user.click(increaseButton);

    // Assert
    expect(onQuantityChange).toHaveBeenCalledWith(3);
  });

  it("should call onQuantityChange when quantity is decreased", async () => {
    // Arrange
    const onQuantityChange = vi.fn();
    const onRemove = vi.fn();
    const user = userEvent.setup();

    render(
      <CartItemComponent item={mockItem} onQuantityChange={onQuantityChange} onRemove={onRemove} />,
    );

    // Act
    const decreaseButton = screen.getAllByRole("button")[0]; // The decrease button
    await user.click(decreaseButton);

    // Assert
    expect(onQuantityChange).toHaveBeenCalledWith(1);
  });

  it("should call onRemove when remove button is clicked", async () => {
    // Arrange
    const onQuantityChange = vi.fn();
    const onRemove = vi.fn();
    const user = userEvent.setup();

    render(
      <CartItemComponent item={mockItem} onQuantityChange={onQuantityChange} onRemove={onRemove} />,
    );

    // Act
    const removeButton = screen.getByRole("button", { name: /remover do carrinho/i });
    await user.click(removeButton);

    // Assert
    expect(onRemove).toHaveBeenCalled();
  });

  it("should display correct line total (price × quantity)", () => {
    // Arrange
    const onQuantityChange = vi.fn();
    const onRemove = vi.fn();
    const itemWith3Qty = { ...mockItem, quantity: 3 };

    // Act
    render(
      <CartItemComponent
        item={itemWith3Qty}
        onQuantityChange={onQuantityChange}
        onRemove={onRemove}
      />,
    );

    // Assert
    const lineTotal = screen.getByText(/R\$ 300,00/);
    expect(lineTotal).toBeInTheDocument();
  });

  it("should handle missing image gracefully with fallback", () => {
    // Arrange
    const onQuantityChange = vi.fn();
    const onRemove = vi.fn();
    const itemWithoutImage = { ...mockItem, image: "" };

    // Act
    render(
      <CartItemComponent
        item={itemWithoutImage}
        onQuantityChange={onQuantityChange}
        onRemove={onRemove}
      />,
    );

    // Assert
    expect(screen.getByText("Sem imagem")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("should display different quantities correctly", () => {
    // Arrange
    const onQuantityChange = vi.fn();
    const onRemove = vi.fn();
    const itemWith5Qty = { ...mockItem, quantity: 5 };

    // Act
    render(
      <CartItemComponent
        item={itemWith5Qty}
        onQuantityChange={onQuantityChange}
        onRemove={onRemove}
      />,
    );

    // Assert
    const quantityTexts = screen.getAllByText("5");
    expect(quantityTexts.length).toBeGreaterThan(0);
    expect(screen.getByText(/R\$ 500,00/)).toBeInTheDocument();
  });

  it("should display product with decimal price correctly", () => {
    // Arrange
    const onQuantityChange = vi.fn();
    const onRemove = vi.fn();
    const itemWithDecimalPrice = { ...mockItem, price: 99.99, quantity: 2 };

    // Act
    render(
      <CartItemComponent
        item={itemWithDecimalPrice}
        onQuantityChange={onQuantityChange}
        onRemove={onRemove}
      />,
    );

    // Assert
    expect(screen.getByText(/R\$ 99,99/)).toBeInTheDocument();
    expect(screen.getByText(/R\$ 199,98/)).toBeInTheDocument();
  });

  it("should truncate long product names", () => {
    // Arrange
    const onQuantityChange = vi.fn();
    const onRemove = vi.fn();
    const longNameItem = {
      ...mockItem,
      name: "This is a very long product name that should be truncated with ellipsis to prevent layout issues",
    };

    // Act
    render(
      <CartItemComponent
        item={longNameItem}
        onQuantityChange={onQuantityChange}
        onRemove={onRemove}
      />,
    );

    // Assert
    const productName = screen.getByText(/This is a very long/);
    expect(productName).toHaveClass("line-clamp-2");
  });
});
