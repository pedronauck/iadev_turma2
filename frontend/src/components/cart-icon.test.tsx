import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartIcon } from '@/components/cart-icon';
import * as useCartModule from '@/hooks/use-cart';

vi.mock('@/hooks/use-cart', () => ({
  useCartDrawer: () => ({
    toggle: vi.fn(),
    isOpen: false,
    items: [],
    close: vi.fn(),
    open: vi.fn(),
  }),
  useCartSummary: () => ({
    totalItems: 0,
    totalPrice: 0,
  }),
}));

describe('CartIcon', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render badge with zero items', () => {
    render(<CartIcon />);

    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('renders badge with item count', () => {
    const useCartSummarySpy = vi
      .spyOn(useCartModule, 'useCartSummary')
      .mockReturnValue({
        totalItems: 3,
        totalPrice: 300,
      });

    render(<CartIcon />);

    expect(screen.getByText('3')).toBeInTheDocument();

    useCartSummarySpy.mockRestore();
  });

  it('calls toggle action on click', () => {
    const mockToggle = vi.fn();
    const useCartDrawerSpy = vi
      .spyOn(useCartModule, 'useCartDrawer')
      .mockReturnValue({
        toggle: mockToggle,
        isOpen: false,
        items: [],
        close: vi.fn(),
        open: vi.fn(),
      });

    render(<CartIcon />);

    const button = screen.getByLabelText('Abrir carrinho');
    fireEvent.click(button);

    expect(mockToggle).toHaveBeenCalled();

    useCartDrawerSpy.mockRestore();
  });

  it('badge updates when cart changes', () => {
    const useCartSummarySpy = vi
      .spyOn(useCartModule, 'useCartSummary')
      .mockReturnValue({
        totalItems: 5,
        totalPrice: 500,
      });

    render(<CartIcon />);

    expect(screen.getByText('5')).toBeInTheDocument();

    useCartSummarySpy.mockRestore();
  });
});
