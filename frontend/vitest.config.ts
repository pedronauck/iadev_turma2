import path from 'path';
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      name: 'frontend',
      // Use jsdom environment for React component testing
      environment: 'jsdom',
      // Globals enabled for cleaner test syntax
      globals: true,
      // Test file patterns
      include: ['**/*.{test,spec}.{ts,tsx}'],
      exclude: ['node_modules', 'dist', '.next'],
      // Setup files
      setupFiles: ['./src/test/setup.ts'],
      // Performance optimization
      pool: 'threads',
      poolOptions: {
        threads: {
          singleThread: false,
        },
      },
      // Enable test file parallelism
      fileParallelism: true,
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
          '**/src/main.tsx',
          '**/src/vite-env.d.ts',
        ],
        thresholds: {
          lines: 80,
          functions: 80,
          branches: 75,
          statements: 80,
        },
      },
      // Path aliases (inherited from vite.config.ts but ensuring they work in tests)
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        },
      },
    },
  })
);

