import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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
});
