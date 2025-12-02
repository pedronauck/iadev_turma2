import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    const result = cn('class1', 'class2');
    expect(result).toContain('class1');
    expect(result).toContain('class2');
  });

  it('should handle conditional classes', () => {
    const shouldHide = false;
    const shouldShow = true;
    const result = cn('base', shouldHide && 'hidden', shouldShow && 'visible');
    expect(result).toContain('base');
    expect(result).toContain('visible');
    expect(result).not.toContain('hidden');
  });

  it('should handle empty input', () => {
    const result = cn();
    expect(result).toBe('');
  });
});

