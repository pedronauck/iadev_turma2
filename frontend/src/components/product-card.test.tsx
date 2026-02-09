import { describe, it, expect, afterEach, vi } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('ProductCard', () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it('component file exists and has AddToCartButton import', () => {
    const componentPath = resolve(__dirname, './product-card.tsx');
    const content = readFileSync(componentPath, 'utf-8');
    expect(content).toContain('AddToCartButton');
  });

  it('has formatPriceBRL import in component code', () => {
    const componentPath = resolve(__dirname, './product-card.tsx');
    const content = readFileSync(componentPath, 'utf-8');
    expect(content).toContain('formatPriceBRL');
  });
});
