import { describe, it, expect, afterEach, vi } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('ProductDetailPage', () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it('page file exists and has useCartActions import', () => {
    const pagePath = resolve(__dirname, './product-detail-page.tsx');
    const content = readFileSync(pagePath, 'utf-8');
    expect(content).toContain('useCartActions');
  });

  it('has formatPriceBRL import in page code', () => {
    const pagePath = resolve(__dirname, './product-detail-page.tsx');
    const content = readFileSync(pagePath, 'utf-8');
    expect(content).toContain('formatPriceBRL');
  });

  it('has toast import for notifications', () => {
    const pagePath = resolve(__dirname, './product-detail-page.tsx');
    const content = readFileSync(pagePath, 'utf-8');
    expect(content).toContain('toast.success');
  });
});
