import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartDrawer } from '@/components/cart-drawer';
import * as useCartModule from '@/hooks/use-cart';

const mockItem = {
  productId: '1',
  name: 'Produto Teste',
  price: 100,
  imageUrl: 'https://example.com/image.jpg',
  quantity: 2,
};

vi.mock('@/hooks/use-cart', () => ({
  useCartDrawer: () => ({
    isOpen: true,
    items: [],
    close: vi.fn(),
    open: vi.fn(),
    toggle: vi.fn(),
  }),
  useCartSummary: () => ({
    totalItems: 0,
    totalPrice: 0,
  }),
}));

vi.mock('@/components/cart-drawer-item', () => ({
  CartDrawerItem: ({ name }: { name: string }) => <div>{name}</div>,
}));

describe('CartDrawer', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders drawer with items', () => {
    const useCartDrawerSpy = vi
      .spyOn(useCartModule, 'useCartDrawer')
      .mockReturnValue({
        isOpen: true,
        items: [mockItem],
        close: vi.fn(),
        open: vi.fn(),
        toggle: vi.fn(),
      });

    render(<CartDrawer />);

    expect(screen.getByText('Seu Carrinho (1)')).toBeInTheDocument();
    expect(screen.getByText('Produto Teste')).toBeInTheDocument();

    useCartDrawerSpy.mockRestore();
  });

  it('renders empty cart state', () => {
    const useCartDrawerSpy = vi
      .spyOn(useCartModule, 'useCartDrawer')
      .mockReturnValue({
        isOpen: true,
        items: [],
        close: vi.fn(),
        open: vi.fn(),
        toggle: vi.fn(),
      });

    render(<CartDrawer />);

    expect(screen.getByText('Seu carrinho está vazio')).toBeInTheDocument();

    useCartDrawerSpy.mockRestore();
  });

  it('displays correct BRL-formatted subtotal', () => {
    const useCartDrawerSpy = vi
      .spyOn(useCartModule, 'useCartDrawer')
      .mockReturnValue({
        isOpen: true,
        items: [mockItem],
        close: vi.fn(),
        open: vi.fn(),
        toggle: vi.fn(),
      });

    const useCartSummarySpy = vi
      .spyOn(useCartModule, 'useCartSummary')
      .mockReturnValue({
        totalItems: 2,
        totalPrice: 200,
      });

    render(<CartDrawer />);

    expect(screen.getByText('R$ 200,00')).toBeInTheDocument();

    useCartDrawerSpy.mockRestore();
    useCartSummarySpy.mockRestore();
  });

  it('closes drawer via close button', () => {
    const mockClose = vi.fn();
    const useCartDrawerSpy = vi
      .spyOn(useCartModule, 'useCartDrawer')
      .mockReturnValue({
        isOpen: true,
        items: [mockItem],
        close: mockClose,
        open: vi.fn(),
        toggle: vi.fn(),
      });

    render(<CartDrawer />);

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockClose).toHaveBeenCalled();

    useCartDrawerSpy.mockRestore();
  });

  it('closes drawer via Escape key', () => {
    const mockClose = vi.fn();
    const useCartDrawerSpy = vi
      .spyOn(useCartModule, 'useCartDrawer')
      .mockReturnValue({
        isOpen: true,
        items: [mockItem],
        close: mockClose,
        open: vi.fn(),
        toggle: vi.fn(),
      });

    render(<CartDrawer />);

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(mockClose).toHaveBeenCalled();

    useCartDrawerSpy.mockRestore();
  });
});
