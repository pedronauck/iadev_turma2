import {
  createRouter,
  createRoute,
  createRootRoute,
} from '@tanstack/react-router';
import { Outlet, Link } from '@tanstack/react-router';
import { Toaster } from '@/components/ui/sonner';
import { ThemeToggle } from '@/components/theme-toggle';
import { CartDrawer } from '@/components/cart-drawer';
import { ProductsPage } from '@/pages/products-page';
import { ProductDetailPage } from '@/pages/product-detail-page';
import { CartPage } from '@/pages/cart-page';

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-bold hover:opacity-80 transition-opacity"
          >
            Minha Loja
          </Link>
          <div className="flex items-center gap-4">
            <CartDrawer />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <Toaster />
    </div>
  ),
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

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: CartPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  productDetailRoute,
  cartRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
