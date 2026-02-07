import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartSheet } from './cart-sheet';

vi.mock('@/hooks/use-cart');

import { useCart } from '@/hooks/use-cart';

const mockUseCart = vi.mocked(useCart);

describe('CartSheet component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render as Shadcn Sheet component', () => {
    mockUseCart.mockReturnValue({
      items: [],
      itemCount: 0,
      subtotal: 0,
      isOpen: true,
      addItem: vi.fn(),
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
      clearCart: vi.fn(),
      openCart: vi.fn(),
      closeCart: vi.fn(),
    });

    render(<CartSheet />);
    expect(screen.getByText('Carrinho de Compras')).toBeInTheDocument();
  });

  it('should show empty state message when cart is empty', () => {
    mockUseCart.mockReturnValue({
      items: [],
      itemCount: 0,
      subtotal: 0,
      isOpen: true,
      addItem: vi.fn(),
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
      clearCart: vi.fn(),
      openCart: vi.fn(),
      closeCart: vi.fn(),
    });

    render(<CartSheet />);
    expect(screen.getByText('Adicione produtos para começar')).toBeInTheDocument();
    const emptyMessages = screen.getAllByText('Seu carrinho está vazio');
    expect(emptyMessages.length).toBeGreaterThan(0);
  });

  it('should render list of cart items', () => {
    mockUseCart.mockReturnValue({
      items: [
        { productId: '1', name: 'Product 1', price: 100, image: 'test.jpg', quantity: 2 },
        { productId: '2', name: 'Product 2', price: 200, image: 'test2.jpg', quantity: 1 },
      ],
      itemCount: 3,
      subtotal: 400,
      isOpen: true,
      addItem: vi.fn(),
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
      clearCart: vi.fn(),
      openCart: vi.fn(),
      closeCart: vi.fn(),
    });

    render(<CartSheet />);
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
    expect(screen.getByText(/2 item\(ns\)/)).toBeInTheDocument();
  });

  it('should display cart summary with totals', () => {
    mockUseCart.mockReturnValue({
      items: [
        { productId: '1', name: 'Product 1', price: 100, image: 'test.jpg', quantity: 2 },
      ],
      itemCount: 2,
      subtotal: 200,
      isOpen: true,
      addItem: vi.fn(),
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
      clearCart: vi.fn(),
      openCart: vi.fn(),
      closeCart: vi.fn(),
    });

    render(<CartSheet />);
    expect(screen.getByText(/Itens \(2\):/)).toBeInTheDocument();
    expect(screen.getByText('Total:')).toBeInTheDocument();
  });

  it('should call clearCart when clear button is clicked', async () => {
    const clearCartMock = vi.fn();
    mockUseCart.mockReturnValue({
      items: [
        { productId: '1', name: 'Product 1', price: 100, image: 'test.jpg', quantity: 2 },
      ],
      itemCount: 2,
      subtotal: 200,
      isOpen: true,
      addItem: vi.fn(),
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
      clearCart: clearCartMock,
      openCart: vi.fn(),
      closeCart: vi.fn(),
    });

    const user = userEvent.setup();
    render(<CartSheet />);
    const clearButton = screen.getByRole('button', { name: /limpar carrinho/i });
    await user.click(clearButton);

    expect(clearCartMock).toHaveBeenCalled();
  });

  it('should show clear button when cart has items', () => {
    mockUseCart.mockReturnValue({
      items: [
        { productId: '1', name: 'Product 1', price: 100, image: 'test.jpg', quantity: 1 },
      ],
      itemCount: 1,
      subtotal: 100,
      isOpen: true,
      addItem: vi.fn(),
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
      clearCart: vi.fn(),
      openCart: vi.fn(),
      closeCart: vi.fn(),
    });

    render(<CartSheet />);
    const clearButton = screen.getByRole('button', { name: /limpar carrinho/i });
    expect(clearButton).toBeInTheDocument();
  });

  it('should not show clear button when cart is empty', () => {
    mockUseCart.mockReturnValue({
      items: [],
      itemCount: 0,
      subtotal: 0,
      isOpen: true,
      addItem: vi.fn(),
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
      clearCart: vi.fn(),
      openCart: vi.fn(),
      closeCart: vi.fn(),
    });

    render(<CartSheet />);
    const clearButton = screen.queryByRole('button', { name: /limpar carrinho/i });
    expect(clearButton).not.toBeInTheDocument();
  });
});
