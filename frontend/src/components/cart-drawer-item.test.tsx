import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartDrawerItem } from '@/components/cart-drawer-item';
import * as useCartModule from '@/hooks/use-cart';

vi.mock('@/hooks/use-cart', () => ({
  useCartActions: () => ({
    addItem: vi.fn(),
    removeItem: vi.fn(),
    updateQuantity: vi.fn(),
    clearCart: vi.fn(),
  }),
}));

vi.mock('@/components/quantity-selector', () => ({
  QuantitySelector: ({
    value,
    onChange,
    min = 1,
    max = 99,
    className,
  }: {
    value: number;
    onChange?: (value: number) => void;
    min?: number;
    max?: number;
    className?: string;
  }) => (
    <div className={className} data-testid="quantity-selector">
      <button
        onClick={() => onChange && onChange(value - 1)}
        disabled={value <= min}
      >
        -
      </button>
      <span>{value}</span>
      <button
        onClick={() => onChange && onChange(value + 1)}
        disabled={value >= max}
      >
        +
      </button>
    </div>
  ),
}));

describe('CartDrawerItem', () => {
  const mockProps = {
    productId: '1',
    name: 'Produto Teste',
    price: 100,
    imageUrl: 'https://example.com/image.jpg',
    quantity: 2,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders cart item with image', () => {
    render(<CartDrawerItem {...mockProps} />);

    expect(screen.getByAltText('Produto Teste')).toBeInTheDocument();
    expect(screen.getByText('Produto Teste')).toBeInTheDocument();
  });

  it('renders cart item with null imageUrl with ImageOff fallback', () => {
    render(<CartDrawerItem {...mockProps} imageUrl={null} />);

    expect(screen.queryByAltText('Produto Teste')).not.toBeInTheDocument();
  });

  it('calls updateQuantity on quantity change', () => {
    const mockUpdateQuantity = vi.fn();
    const useCartActionsSpy = vi
      .spyOn(useCartModule, 'useCartActions')
      .mockReturnValue({
        addItem: vi.fn(),
        removeItem: vi.fn(),
        updateQuantity: mockUpdateQuantity,
        clearCart: vi.fn(),
      });

    render(<CartDrawerItem {...mockProps} />);

    const increaseButton = screen.getByText('+');
    fireEvent.click(increaseButton);

    expect(mockUpdateQuantity).toHaveBeenCalledWith('1', 3);

    useCartActionsSpy.mockRestore();
  });

  it('calls removeItem on remove button click', () => {
    const mockRemoveItem = vi.fn();
    const useCartActionsSpy = vi
      .spyOn(useCartModule, 'useCartActions')
      .mockReturnValue({
        addItem: vi.fn(),
        removeItem: mockRemoveItem,
        updateQuantity: vi.fn(),
        clearCart: vi.fn(),
      });

    render(<CartDrawerItem {...mockProps} />);

    const removeButton = screen.getByLabelText('Remover item');
    fireEvent.click(removeButton);

    expect(mockRemoveItem).toHaveBeenCalledWith('1');

    useCartActionsSpy.mockRestore();
  });

  it('displays correct line total', () => {
    render(<CartDrawerItem {...mockProps} />);

    expect(screen.getByText('R$ 200,00')).toBeInTheDocument();
  });
});
