import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ShoppingBag, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CartButton } from './cart-button';
import { CartItemCard } from './cart-item-card';
import { CartSummary } from './cart-summary';
import { useCart, useClearCart } from '@/hooks/use-cart';

export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const { data: cart, isLoading } = useCart();
  const clearCartMutation = useClearCart();
  const handleClearCart = () => {
    clearCartMutation.mutate();
    setShowClearDialog(false);
    setOpen(false);
  };
  const subtotal =
    cart?.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    ) || 0;
  const isEmpty = !cart || cart.items.length === 0;
  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <div>
            <CartButton />
          </div>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-lg flex flex-col">
          <SheetHeader>
            <SheetTitle>Carrinho de Compras</SheetTitle>
            <SheetDescription>
              {isEmpty
                ? 'Seu carrinho está vazio'
                : `${cart.items.length} ${cart.items.length === 1 ? 'item' : 'itens'} no carrinho`}
            </SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-muted-foreground">Carregando...</p>
            </div>
          ) : isEmpty ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground" />
              <div>
                <h3 className="font-semibold text-lg">
                  Seu carrinho está vazio
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Adicione produtos para começar
                </p>
              </div>
              <Button asChild onClick={() => setOpen(false)}>
                <Link to="/">Ver Produtos</Link>
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 -mx-6 px-6">
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <CartItemCard key={item.id} item={item} />
                  ))}
                </div>
              </ScrollArea>
              <div className="space-y-4 pt-4">
                <CartSummary subtotal={subtotal} />
                <div className="space-y-2">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => setOpen(false)}
                    asChild
                  >
                    <Link to="/cart">Ir para Carrinho</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowClearDialog(true)}
                    disabled={clearCartMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Limpar Carrinho
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Limpar carrinho?</AlertDialogTitle>
            <AlertDialogDescription>
              Todos os itens serão removidos do carrinho. Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearCart}>
              Limpar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
