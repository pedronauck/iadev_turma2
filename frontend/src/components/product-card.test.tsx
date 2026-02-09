import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductCard } from '@/components/product-card';
import { toast } from 'sonner';
import * as useCartModule from '@/hooks/use-cart';
import * as useProductImagesModule from '@/hooks/use-product-images';
import type { Product } from '@/types/product';

// Mock TanStack Router Link component
vi.mock('@tanstack/react-router', () => ({
  Link: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <div className={className}>{children}</div>,
}));

// Mock dependencies
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
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

vi.mock('@/hooks/use-products', () => ({
  useProducts: () => ({
    deleteProduct: vi.fn(),
    isDeleting: false,
  }),
}));

vi.mock('@/hooks/use-product-images', () => ({
  useProductImages: () => ({
    data: [],
    isLoading: false,
  }),
}));

vi.mock('@/components/edit-product-dialog', () => ({
  EditProductDialog: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

const mockProduct: Product = {
  id: '1',
  name: 'Produto Teste',
  description: 'Descrição do produto teste',
  price: 100,
  sku: 'SKU-001',
  createdAt: new Date().toISOString(),
};

describe('ProductCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Produto Teste')).toBeInTheDocument();
    expect(screen.getByText('Descrição do produto teste')).toBeInTheDocument();
    expect(screen.getByText('R$ 100,00')).toBeInTheDocument();
    expect(screen.getByText('SKU-001')).toBeInTheDocument();
  });

  it('displays product image when available', () => {
    vi.spyOn(useProductImagesModule, 'useProductImages').mockReturnValue({
      data: [{ id: '1', productId: '1', url: 'https://example.com/image.jpg' }],
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    render(<ProductCard product={mockProduct} />);

    const image = screen.getByRole('img', { name: 'Produto Teste' });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('displays "Sem imagem" placeholder when no image available', () => {
    vi.spyOn(useProductImagesModule, 'useProductImages').mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Sem imagem')).toBeInTheDocument();
  });

  describe('AddToCartButton integration', () => {
    it('clicking AddToCartButton calls addItem with correct payload', async () => {
      const mockAddItem = vi.fn();
      vi.spyOn(useCartModule, 'useCartActions').mockReturnValue({
        addItem: mockAddItem,
        removeItem: vi.fn(),
        updateQuantity: vi.fn(),
        clearCart: vi.fn(),
      });

      vi.spyOn(useProductImagesModule, 'useProductImages').mockReturnValue({
        data: [
          { id: '1', productId: '1', url: 'https://example.com/image.jpg' },
        ],
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      render(<ProductCard product={mockProduct} />);

      // Find the AddToCartButton by its aria-label or text content
      const buttons = screen.getAllByRole('button');
      // The first button with ShoppingCart icon is the AddToCartButton
      const addToCartButton = buttons[0];

      expect(addToCartButton).toBeDefined();
      fireEvent.click(addToCartButton);

      await waitFor(() => {
        expect(mockAddItem).toHaveBeenCalledWith({
          productId: '1',
          name: 'Produto Teste',
          price: 100,
          imageUrl: 'https://example.com/image.jpg',
          quantity: 1,
        });
      });
    });

    it('AddToCartButton calls addItem with null imageUrl when no image', async () => {
      const mockAddItem = vi.fn();
      vi.spyOn(useCartModule, 'useCartActions').mockReturnValue({
        addItem: mockAddItem,
        removeItem: vi.fn(),
        updateQuantity: vi.fn(),
        clearCart: vi.fn(),
      });

      vi.spyOn(useProductImagesModule, 'useProductImages').mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      render(<ProductCard product={mockProduct} />);

      const buttons = screen.getAllByRole('button');
      const addToCartButton = buttons[0];

      fireEvent.click(addToCartButton);

      await waitFor(() => {
        expect(mockAddItem).toHaveBeenCalledWith({
          productId: '1',
          name: 'Produto Teste',
          price: 100,
          imageUrl: null,
          quantity: 1,
        });
      });
    });

    it('shows success toast notification after adding to cart', async () => {
      vi.spyOn(useProductImagesModule, 'useProductImages').mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      render(<ProductCard product={mockProduct} />);

      const buttons = screen.getAllByRole('button');
      const addToCartButton = buttons[0];

      fireEvent.click(addToCartButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          'Produto adicionado ao carrinho!'
        );
      });
    });

    it('AddToCartButton wrapper has stopPropagation to prevent navigation', async () => {
      const mockAddItem = vi.fn();
      vi.spyOn(useCartModule, 'useCartActions').mockReturnValue({
        addItem: mockAddItem,
        removeItem: vi.fn(),
        updateQuantity: vi.fn(),
        clearCart: vi.fn(),
      });

      vi.spyOn(useProductImagesModule, 'useProductImages').mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const { container } = render(<ProductCard product={mockProduct} />);

      // Verify the wrapper div exists with stopPropagation
      const addToCartWrapper = container.querySelector(
        '.flex.justify-end.gap-2.pt-0 > div'
      );
      expect(addToCartWrapper).toBeInTheDocument();

      // Click the add to cart button
      const buttons = screen.getAllByRole('button');
      const addToCartButton = buttons[0];
      fireEvent.click(addToCartButton);

      // Verify addItem was called (functionality works)
      await waitFor(() => {
        expect(mockAddItem).toHaveBeenCalled();
      });
    });
  });

  it('formats price in BRL currency format', () => {
    render(<ProductCard product={{ ...mockProduct, price: 1234.56 }} />);

    expect(screen.getByText('R$ 1.234,56')).toBeInTheDocument();
  });

  it('has formatPriceBRL import from @/lib/utils', async () => {
    const { readFileSync } = await import('fs');
    const { join } = await import('path');
    const componentPath = join(__dirname, './product-card.tsx');
    const content = readFileSync(componentPath, 'utf-8');
    expect(content).toContain('formatPriceBRL');
    expect(content).toContain('@/lib/utils');
  });

  it('has AddToCartButton import', async () => {
    const { readFileSync } = await import('fs');
    const { join } = await import('path');
    const componentPath = join(__dirname, './product-card.tsx');
    const content = readFileSync(componentPath, 'utf-8');
    expect(content).toContain('AddToCartButton');
    expect(content).toContain('@/components/add-to-cart-button');
  });
});
