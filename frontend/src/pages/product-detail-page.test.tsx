import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductDetailPage } from '@/pages/product-detail-page';
import { toast } from 'sonner';
import * as useCartModule from '@/hooks/use-cart';
import type { Product } from '@/types/product';

// Mock TanStack Router
vi.mock('@tanstack/react-router', () => ({
  useParams: () => ({ id: '1' }),
  useNavigate: () => vi.fn(),
  Link: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
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

const mockProduct: Product = {
  id: '1',
  name: 'Produto Teste',
  description: 'Descrição detalhada do produto teste',
  price: 150,
  sku: 'SKU-002',
  createdAt: new Date().toISOString(),
};

const mockImages = [
  { id: '1', productId: '1', url: 'https://example.com/image1.jpg' },
  { id: '2', productId: '1', url: 'https://example.com/image2.jpg' },
];

vi.mock('@/hooks/use-products', () => ({
  useProductById: () => ({
    data: mockProduct,
    isLoading: false,
    isError: false,
    error: null,
  }),
  useProducts: () => ({
    deleteProduct: vi.fn(),
    isDeleting: false,
  }),
}));

vi.mock('@/hooks/use-product-images', () => ({
  useProductImages: () => ({
    data: mockImages,
    isLoading: false,
    isError: false,
    error: null,
  }),
}));

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    invalidateQueries: vi.fn(),
  }),
}));

vi.mock('@/components/image-gallery', () => ({
  ImageGallery: () => <div>Image Gallery</div>,
}));

vi.mock('@/components/star-rating', () => ({
  StarRating: () => <div>Star Rating</div>,
}));

vi.mock('@/components/quantity-selector', () => ({
  QuantitySelector: ({
    value,
    onChange,
  }: {
    value: number;
    onChange: (v: number) => void;
  }) => (
    <div>
      <button
        aria-label="decrement"
        onClick={() => onChange(Math.max(1, value - 1))}
      >
        -
      </button>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="quantity"
      />
      <button aria-label="increment" onClick={() => onChange(value + 1)}>
        +
      </button>
    </div>
  ),
}));

vi.mock('@/components/delivery-info-card', () => ({
  DeliveryInfoCard: () => <div>Delivery Info</div>,
}));

vi.mock('@/components/edit-product-dialog', () => ({
  EditProductDialog: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe('ProductDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders product detail information correctly', () => {
    render(<ProductDetailPage />);

    expect(screen.getByText('Produto Teste')).toBeInTheDocument();
    expect(
      screen.getByText('Descrição detalhada do produto teste')
    ).toBeInTheDocument();
    expect(screen.getByText('R$ 150,00')).toBeInTheDocument();
  });

  it('displays "Adicionar ao Carrinho" button in Portuguese', () => {
    render(<ProductDetailPage />);

    const addButton = screen.getByRole('button', {
      name: 'Adicionar ao Carrinho',
    });
    expect(addButton).toBeInTheDocument();
  });

  describe('Add to cart integration', () => {
    it('clicking "Adicionar ao Carrinho" calls addItem with selected quantity', async () => {
      const mockAddItem = vi.fn();
      vi.spyOn(useCartModule, 'useCartActions').mockReturnValue({
        addItem: mockAddItem,
        removeItem: vi.fn(),
        updateQuantity: vi.fn(),
        clearCart: vi.fn(),
      });

      render(<ProductDetailPage />);

      // Adjust quantity to 3
      const incrementButton = screen.getByLabelText('increment');
      fireEvent.click(incrementButton);
      fireEvent.click(incrementButton);

      // Click add to cart button
      const addButton = screen.getByRole('button', {
        name: 'Adicionar ao Carrinho',
      });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(mockAddItem).toHaveBeenCalledWith({
          productId: '1',
          name: 'Produto Teste',
          price: 150,
          imageUrl: 'https://example.com/image1.jpg',
          quantity: 3,
        });
      });
    });

    it('addItem is called with default quantity 1', async () => {
      const mockAddItem = vi.fn();
      vi.spyOn(useCartModule, 'useCartActions').mockReturnValue({
        addItem: mockAddItem,
        removeItem: vi.fn(),
        updateQuantity: vi.fn(),
        clearCart: vi.fn(),
      });

      render(<ProductDetailPage />);

      const addButton = screen.getByRole('button', {
        name: 'Adicionar ao Carrinho',
      });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(mockAddItem).toHaveBeenCalledWith({
          productId: '1',
          name: 'Produto Teste',
          price: 150,
          imageUrl: 'https://example.com/image1.jpg',
          quantity: 1,
        });
      });
    });

    it('shows success toast notification after adding to cart', async () => {
      render(<ProductDetailPage />);

      const addButton = screen.getByRole('button', {
        name: 'Adicionar ao Carrinho',
      });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          'Produto adicionado ao carrinho!'
        );
      });
    });

    it('addItem payload includes correct product data', async () => {
      const mockAddItem = vi.fn();
      vi.spyOn(useCartModule, 'useCartActions').mockReturnValue({
        addItem: mockAddItem,
        removeItem: vi.fn(),
        updateQuantity: vi.fn(),
        clearCart: vi.fn(),
      });

      render(<ProductDetailPage />);

      const addButton = screen.getByRole('button', {
        name: 'Adicionar ao Carrinho',
      });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(mockAddItem).toHaveBeenCalledWith(
          expect.objectContaining({
            productId: '1',
            name: 'Produto Teste',
            price: 150,
            imageUrl: 'https://example.com/image1.jpg',
          })
        );
      });
    });
  });

  describe('QuantitySelector integration', () => {
    it('QuantitySelector adjustment changes quantity state value', async () => {
      const mockAddItem = vi.fn();
      vi.spyOn(useCartModule, 'useCartActions').mockReturnValue({
        addItem: mockAddItem,
        removeItem: vi.fn(),
        updateQuantity: vi.fn(),
        clearCart: vi.fn(),
      });

      render(<ProductDetailPage />);

      // Increment quantity
      const incrementButton = screen.getByLabelText('increment');
      fireEvent.click(incrementButton);
      fireEvent.click(incrementButton);

      // Verify the quantity input shows 3
      const quantityInput = screen.getByLabelText('quantity');
      expect(quantityInput).toHaveValue(3);

      // Add to cart
      const addButton = screen.getByRole('button', {
        name: 'Adicionar ao Carrinho',
      });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(mockAddItem).toHaveBeenCalledWith(
          expect.objectContaining({
            quantity: 3,
          })
        );
      });
    });

    it('QuantitySelector decrement works correctly', async () => {
      const mockAddItem = vi.fn();
      vi.spyOn(useCartModule, 'useCartActions').mockReturnValue({
        addItem: mockAddItem,
        removeItem: vi.fn(),
        updateQuantity: vi.fn(),
        clearCart: vi.fn(),
      });

      render(<ProductDetailPage />);

      // Increment to 5
      const incrementButton = screen.getByLabelText('increment');
      for (let i = 0; i < 4; i++) {
        fireEvent.click(incrementButton);
      }

      // Decrement to 3
      const decrementButton = screen.getByLabelText('decrement');
      fireEvent.click(decrementButton);
      fireEvent.click(decrementButton);

      // Add to cart
      const addButton = screen.getByRole('button', {
        name: 'Adicionar ao Carrinho',
      });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(mockAddItem).toHaveBeenCalledWith(
          expect.objectContaining({
            quantity: 3,
          })
        );
      });
    });
  });

  it('formats price in BRL currency format', () => {
    render(<ProductDetailPage />);

    expect(screen.getByText('R$ 150,00')).toBeInTheDocument();
  });

  it('has useCartActions import in page code', async () => {
    const { readFileSync } = await import('fs');
    const { join } = await import('path');
    const pagePath = join(__dirname, './product-detail-page.tsx');
    const content = readFileSync(pagePath, 'utf-8');
    expect(content).toContain('useCartActions');
    expect(content).toContain('@/hooks/use-cart');
  });

  it('has formatPriceBRL import in page code', async () => {
    const { readFileSync } = await import('fs');
    const { join } = await import('path');
    const pagePath = join(__dirname, './product-detail-page.tsx');
    const content = readFileSync(pagePath, 'utf-8');
    expect(content).toContain('formatPriceBRL');
    expect(content).toContain('@/lib/utils');
  });

  it('has toast.success import for notifications', async () => {
    const { readFileSync } = await import('fs');
    const { join } = await import('path');
    const pagePath = join(__dirname, './product-detail-page.tsx');
    const content = readFileSync(pagePath, 'utf-8');
    expect(content).toContain('toast.success');
    expect(content).toContain('sonner');
  });
});
