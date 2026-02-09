import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  useCartDrawer,
  useCartSummary,
  useCartActions,
} from '@/hooks/use-cart';
import { useCartStore } from '@/store/cart-store';

describe('Cart Integration Tests', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
    useCartStore.getState().closeDrawer();
  });

  it('adds item to cart and updates summary', () => {
    const { result: actions } = renderHook(() => useCartActions());
    const { result: summary } = renderHook(() => useCartSummary());

    act(() => {
      actions.current.addItem({
        productId: '1',
        name: 'Produto Teste',
        price: 100,
        imageUrl: 'https://example.com/image.jpg',
        quantity: 2,
      });
    });

    expect(summary.current.totalItems).toBe(2);
    expect(summary.current.totalPrice).toBe(200);
  });

  it('updates quantity in cart', () => {
    const { result: actions } = renderHook(() => useCartActions());
    const { result: summary } = renderHook(() => useCartSummary());

    act(() => {
      actions.current.addItem({
        productId: '1',
        name: 'Produto Teste',
        price: 100,
        imageUrl: 'https://example.com/image.jpg',
        quantity: 2,
      });
    });

    expect(summary.current.totalPrice).toBe(200);

    act(() => {
      actions.current.updateQuantity('1', 5);
    });

    expect(summary.current.totalItems).toBe(5);
    expect(summary.current.totalPrice).toBe(500);
  });

  it('removes item from cart', () => {
    const { result: actions } = renderHook(() => useCartActions());
    const { result: summary } = renderHook(() => useCartSummary());

    act(() => {
      actions.current.addItem({
        productId: '1',
        name: 'Produto Teste',
        price: 100,
        imageUrl: 'https://example.com/image.jpg',
        quantity: 2,
      });
    });

    expect(summary.current.totalItems).toBe(2);

    act(() => {
      actions.current.removeItem('1');
    });

    expect(summary.current.totalItems).toBe(0);
    expect(summary.current.totalPrice).toBe(0);
  });

  it('opens and closes drawer', () => {
    const { result: drawer } = renderHook(() => useCartDrawer());

    expect(drawer.current.isOpen).toBe(false);

    act(() => {
      drawer.current.open();
    });

    expect(drawer.current.isOpen).toBe(true);

    act(() => {
      drawer.current.close();
    });

    expect(drawer.current.isOpen).toBe(false);
  });

  it('toggles drawer', () => {
    const { result: drawer } = renderHook(() => useCartDrawer());

    expect(drawer.current.isOpen).toBe(false);

    act(() => {
      drawer.current.toggle();
    });

    expect(drawer.current.isOpen).toBe(true);

    act(() => {
      drawer.current.toggle();
    });

    expect(drawer.current.isOpen).toBe(false);
  });

  it('drawer shows correct items', () => {
    const { result: actions } = renderHook(() => useCartActions());
    const { result: drawer } = renderHook(() => useCartDrawer());

    expect(drawer.current.items).toHaveLength(0);

    act(() => {
      actions.current.addItem({
        productId: '1',
        name: 'Produto Teste',
        price: 100,
        imageUrl: 'https://example.com/image.jpg',
        quantity: 2,
      });
    });

    expect(drawer.current.items).toHaveLength(1);
    expect(drawer.current.items[0].name).toBe('Produto Teste');
  });
});
