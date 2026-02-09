import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { toast } from 'sonner';
import { AddToCartButton } from '@/components/add-to-cart-button';
import * as useCartModule from '@/hooks/use-cart';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
  },
}));

vi.mock('@/hooks/use-cart', () => ({
  useCartActions: () => ({
    addItem: vi.fn(),
    removeItem: vi.fn(),
    updateQuantity: vi.fn(),
    clearCart: vi.fn(),
  }),
}));

const mockProps = {
  productId: '1',
  name: 'Produto Teste',
  price: 100,
  imageUrl: 'https://example.com/image.jpg',
};

describe('AddToCartButton', () => {
  it('calls addItem with correct parameters on click', () => {
    const mockAddItem = vi.fn();
    const useCartActionsSpy = vi
      .spyOn(useCartModule, 'useCartActions')
      .mockReturnValue({
        addItem: mockAddItem,
        removeItem: vi.fn(),
        updateQuantity: vi.fn(),
        clearCart: vi.fn(),
      });

    render(<AddToCartButton {...mockProps}>Adicionar</AddToCartButton>);

    const button = screen.getByRole('button', { name: 'Adicionar' });
    fireEvent.click(button);

    expect(mockAddItem).toHaveBeenCalledWith({
      productId: '1',
      name: 'Produto Teste',
      price: 100,
      imageUrl: 'https://example.com/image.jpg',
      quantity: 1,
    });

    useCartActionsSpy.mockRestore();
  });

  it('displays toast success message on add', () => {
    render(<AddToCartButton {...mockProps} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(toast.success).toHaveBeenCalledWith(
      'Produto adicionado ao carrinho!'
    );
  });

  it('renders with correct custom label', () => {
    render(<AddToCartButton {...mockProps}>Comprar</AddToCartButton>);

    expect(screen.getByText('Comprar')).toBeInTheDocument();
  });

  it('renders default label when children not provided', () => {
    render(<AddToCartButton {...mockProps} />);

    expect(screen.getByText('Adicionar ao Carrinho')).toBeInTheDocument();
  });
});
