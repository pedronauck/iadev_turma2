import {
  createRouter,
  createRootRoute,
  createRoute,
} from '@tanstack/react-router';
import App from './App';
import { ProductsPage } from '@/pages/products-page';
import { ProductDetailPage } from '@/pages/product-detail-page';

const rootRoute = createRootRoute({
  component: App,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: ProductsPage,
});

const productDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/product/$id',
  component: ProductDetailPage,
});

const routeTree = rootRoute.addChildren([indexRoute, productDetailRoute]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

