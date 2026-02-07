import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CartSummary } from './cart-summary';

vi.mock('@/hooks/use-cart');

import { useCart } from '@/hooks/use-cart';

const mockUseCart = vi.mocked(useCart);

describe('CartSummary component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display correct item count', () => {
    mockUseCart.mockReturnValue({
      items: [{ productId: '1', name: 'Product 1', price: 100, image: 'test.jpg', quantity: 2 }],
      itemCount: 2,
      subtotal: 200,
      isOpen: false,
      addItem: vi.fn(),
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
      clearCart: vi.fn(),
      openCart: vi.fn(),
      closeCart: vi.fn(),
    });

    render(<CartSummary />);
    expect(screen.getByText(/Itens \(2\):/)).toBeInTheDocument();
  });

  it('should calculate and display correct subtotal', () => {
    mockUseCart.mockReturnValue({
      items: [
        { productId: '1', name: 'Product 1', price: 100, image: 'test.jpg', quantity: 2 },
        { productId: '2', name: 'Product 2', price: 50, image: 'test2.jpg', quantity: 3 },
      ],
      itemCount: 5,
      subtotal: 350,
      isOpen: false,
      addItem: vi.fn(),
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
      clearCart: vi.fn(),
      openCart: vi.fn(),
      closeCart: vi.fn(),
    });

    render(<CartSummary />);
    const subtotalTexts = screen.getAllByText(/R\$ 350,00/);
    expect(subtotalTexts.length).toBeGreaterThan(0);
  });

  it('should show zero subtotal when cart is empty', () => {
    mockUseCart.mockReturnValue({
      items: [],
      itemCount: 0,
      subtotal: 0,
      isOpen: false,
      addItem: vi.fn(),
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
      clearCart: vi.fn(),
      openCart: vi.fn(),
      closeCart: vi.fn(),
    });

    render(<CartSummary />);
    expect(screen.getByText(/Itens \(0\):/)).toBeInTheDocument();
    const zeroTexts = screen.getAllByText(/R\$ 0,00/);
    expect(zeroTexts.length).toBeGreaterThan(0);
  });

  it('should format currency in BRL format', () => {
    mockUseCart.mockReturnValue({
      items: [{ productId: '1', name: 'Product 1', price: 99.99, image: 'test.jpg', quantity: 2 }],
      itemCount: 2,
      subtotal: 199.98,
      isOpen: false,
      addItem: vi.fn(),
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
      clearCart: vi.fn(),
      openCart: vi.fn(),
      closeCart: vi.fn(),
    });

    render(<CartSummary />);
    const currencyTexts = screen.getAllByText(/R\$ 199,98/);
    expect(currencyTexts.length).toBeGreaterThan(0);
  });

  it('should display total section', () => {
    mockUseCart.mockReturnValue({
      items: [{ productId: '1', name: 'Product 1', price: 100, image: 'test.jpg', quantity: 2 }],
      itemCount: 2,
      subtotal: 200,
      isOpen: false,
      addItem: vi.fn(),
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
      clearCart: vi.fn(),
      openCart: vi.fn(),
      closeCart: vi.fn(),
    });

    render(<CartSummary />);
    expect(screen.getByText('Total:')).toBeInTheDocument();
  });
});
