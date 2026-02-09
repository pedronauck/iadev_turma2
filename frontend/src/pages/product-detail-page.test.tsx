import { describe, it, expect, afterEach, vi } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('ProductDetailPage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('page file exists', () => {
    const pagePath = resolve(__dirname, './product-detail-page.tsx');
    expect(readFileSync(pagePath)).toBeDefined();
  });

  it('has useCartActions import in page code', () => {
    const pagePath = resolve(__dirname, './product-detail-page.tsx');
    const content = readFileSync(pagePath, 'utf-8');
    expect(content).toContain('useCartActions');
  });
});
