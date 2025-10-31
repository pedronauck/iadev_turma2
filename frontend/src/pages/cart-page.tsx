import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, ShoppingBag, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { CartItemCard } from '@/components/cart-item-card';
import { CartSummary } from '@/components/cart-summary';
import { useCart, useClearCart } from '@/hooks/use-cart';

export function CartPage() {
  const [showClearDialog, setShowClearDialog] = useState(false);
  const { data: cart, isLoading } = useCart();
  const clearCartMutation = useClearCart();
  const handleClearCart = () => {
    clearCartMutation.mutate();
    setShowClearDialog(false);
  };
  const subtotal =
    cart?.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    ) || 0;
  const isEmpty = !cart || cart.items.length === 0;
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Carrinho de Compras</h1>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      ) : isEmpty ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <ShoppingBag className="h-24 w-24 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">
            Seu carrinho está vazio
          </h2>
          <p className="text-muted-foreground mb-6">
            Adicione produtos para começar suas compras
          </p>
          <Button asChild size="lg">
            <Link to="/">Ver Produtos</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <CartItemCard key={item.id} item={item} />
            ))}
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
          <div className="md:col-span-1">
            <div className="bg-muted/50 rounded-lg p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
              <CartSummary subtotal={subtotal} />
              <Button className="w-full mt-6" size="lg">
                Finalizar Compra
              </Button>
            </div>
          </div>
        </div>
      )}
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
    </div>
  );
}
