import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Use projects to handle frontend separately
    // Backend uses Bun's test runner, so we only configure frontend here
    projects: ['frontend'],
    // Global test configuration
    globals: true,
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        '**/vite.config.ts',
        '**/vitest.config.ts',
      ],
    },
  },
});

