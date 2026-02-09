import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCartStore } from '@/store/cart-store';

describe('localStorage persistence verification', () => {
  beforeEach(() => {
    localStorage.clear();
    useCartStore.getState().clearCart();
    vi.spyOn(Storage.prototype, 'getItem');
    vi.spyOn(Storage.prototype, 'setItem');
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    useCartStore.getState().clearCart();
  });

  it('writes valid JSON to localStorage when items are added', () => {
    const { addItem } = useCartStore.getState();

    act(() => {
      addItem({
        productId: '1',
        name: 'Produto Teste',
        price: 100,
        imageUrl: 'https://example.com/image.jpg',
        quantity: 2,
      });
    });

    const storedData = localStorage.getItem('minha-loja-cart');
    expect(storedData).toBeTruthy();

    const parsed = JSON.parse(storedData!);
    expect(parsed).toHaveProperty('state');
    expect(parsed.state).toHaveProperty('items');
    expect(parsed.state.items).toHaveLength(1);
    expect(parsed.state.items[0]).toMatchObject({
      productId: '1',
      name: 'Produto Teste',
      price: 100,
      imageUrl: 'https://example.com/image.jpg',
      quantity: 2,
    });
  });

  it('loads persisted items from localStorage on store hydration', () => {
    const testData = {
      state: {
        items: [
          {
            productId: '1',
            name: 'Produto Teste',
            price: 100,
            imageUrl: 'https://example.com/image.jpg',
            quantity: 2,
          },
        ],
      },
      version: 0,
    };

    localStorage.setItem('minha-loja-cart', JSON.stringify(testData));

    act(() => {
      useCartStore.persist.rehydrate();
    });

    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      productId: '1',
      name: 'Produto Teste',
      price: 100,
      quantity: 2,
    });
  });

  it('falls back to empty items array on corrupted JSON', () => {
    localStorage.setItem('minha-loja-cart', 'invalid json{{{');

    const { result } = renderHook(() => useCartStore());

    expect(result.current.items).toHaveLength(0);
  });

  it('handles malformed localStorage data gracefully', () => {
    localStorage.setItem(
      'minha-loja-cart',
      JSON.stringify({ invalid: 'structure' })
    );

    act(() => {
      useCartStore.persist.rehydrate();
    });

    const items = useCartStore.getState().items;
    expect(items).toHaveLength(0);
  });

  it('isDrawerOpen is excluded from persistence', () => {
    const { openDrawer } = useCartStore.getState();

    act(() => {
      openDrawer();
    });

    const storedData = localStorage.getItem('minha-loja-cart');
    expect(storedData).toBeTruthy();

    const parsed = JSON.parse(storedData!);
    expect(parsed.state).not.toHaveProperty('isDrawerOpen');
  });

  it('starts with isDrawerOpen false after previous open state', () => {
    const { openDrawer, closeDrawer } = useCartStore.getState();

    act(() => {
      openDrawer();
      closeDrawer();
    });

    const storedData = localStorage.getItem('minha-loja-cart');
    expect(storedData).toBeTruthy();

    const parsed = JSON.parse(storedData!);
    expect(parsed.state).not.toHaveProperty('isDrawerOpen');
    expect(useCartStore.getState().isDrawerOpen).toBe(false);
  });

  it('preserves version number in localStorage', () => {
    const { addItem } = useCartStore.getState();

    act(() => {
      addItem({
        productId: '1',
        name: 'Produto Teste',
        price: 100,
        imageUrl: 'https://example.com/image.jpg',
        quantity: 1,
      });
    });

    const storedData = localStorage.getItem('minha-loja-cart');
    const parsed = JSON.parse(storedData!);
    expect(parsed.version).toBeDefined();
  });

  it('handles multiple items correctly', () => {
    const { addItem } = useCartStore.getState();

    act(() => {
      addItem({
        productId: '1',
        name: 'Produto Teste 1',
        price: 100,
        imageUrl: 'https://example.com/image1.jpg',
        quantity: 2,
      });
      addItem({
        productId: '2',
        name: 'Produto Teste 2',
        price: 200,
        imageUrl: 'https://example.com/image2.jpg',
        quantity: 1,
      });
    });

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(2);

    const storedData = localStorage.getItem('minha-loja-cart');
    const parsed = JSON.parse(storedData!);
    expect(parsed.state.items).toHaveLength(2);
  });

  it('updates localStorage when items are removed', () => {
    const { addItem, removeItem } = useCartStore.getState();

    act(() => {
      addItem({
        productId: '1',
        name: 'Produto Teste',
        price: 100,
        imageUrl: 'https://example.com/image.jpg',
        quantity: 2,
      });
    });

    let storedData = localStorage.getItem('minha-loja-cart');
    let parsed = JSON.parse(storedData!);
    expect(parsed.state.items).toHaveLength(1);

    act(() => {
      removeItem('1');
    });

    storedData = localStorage.getItem('minha-loja-cart');
    parsed = JSON.parse(storedData!);
    expect(parsed.state.items).toHaveLength(0);
  });

  it('updates localStorage when quantity is changed', () => {
    const { addItem, updateQuantity } = useCartStore.getState();

    act(() => {
      addItem({
        productId: '1',
        name: 'Produto Teste',
        price: 100,
        imageUrl: 'https://example.com/image.jpg',
        quantity: 2,
      });
    });

    let storedData = localStorage.getItem('minha-loja-cart');
    let parsed = JSON.parse(storedData!);
    expect(parsed.state.items[0].quantity).toBe(2);

    act(() => {
      updateQuantity('1', 5);
    });

    storedData = localStorage.getItem('minha-loja-cart');
    parsed = JSON.parse(storedData!);
    expect(parsed.state.items[0].quantity).toBe(5);
  });
});
