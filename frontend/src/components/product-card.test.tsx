import { describe, it, expect, afterEach, vi } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('ProductCard', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('component file exists', () => {
    const componentPath = resolve(__dirname, './product-card.tsx');
    expect(readFileSync(componentPath)).toBeDefined();
  });
});
