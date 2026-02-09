import { useCartDrawer } from '@/hooks/use-cart';
import { useCartSummary } from '@/hooks/use-cart';
import { formatPriceBRL } from '@/lib/utils';
import { CartDrawerItem } from '@/components/cart-drawer-item';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShoppingCart } from 'lucide-react';

export function CartDrawer() {
  const { isOpen, items, close } = useCartDrawer();
  const { totalPrice } = useCartSummary();

  return (
    <Sheet open={isOpen} onOpenChange={close}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Seu Carrinho ({items.length})</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 py-12 text-muted-foreground">
            <ShoppingCart className="h-12 w-12" />
            <p className="text-sm">Seu carrinho está vazio</p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-4 p-4">
                {items.map((item) => (
                  <CartDrawerItem key={item.productId} {...item} />
                ))}
              </div>
            </ScrollArea>

            <SheetFooter>
              <div className="w-full flex items-center justify-between pt-4 border-t">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-lg font-bold">
                  {formatPriceBRL(totalPrice)}
                </span>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
