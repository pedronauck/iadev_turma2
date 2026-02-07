import { X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CartItemComponent } from "@/components/cart-item";
import { CartSummary } from "@/components/cart-summary";
import { useCart } from "@/hooks/use-cart";

export function CartSheet() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, clearCart } = useCart();

  const handleQuantityChange = (productId: string, quantity: number) => {
    updateQuantity(productId, quantity);
  };

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
  };

  const handleClearCart = () => {
    clearCart();
  };

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <div className="flex justify-between items-center">
            <div>
              <SheetTitle>Carrinho de Compras</SheetTitle>
              <SheetDescription>
                {items.length === 0 ? "Seu carrinho está vazio" : `${items.length} item(ns)`}
              </SheetDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeCart}
              className="h-6 w-6"
              aria-label="Fechar carrinho"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <p>Seu carrinho está vazio</p>
              <p className="text-sm mt-2">Adicione produtos para começar</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto space-y-4 pr-4">
              {items.map((item) => (
                <CartItemComponent
                  key={item.productId}
                  item={item}
                  onQuantityChange={(quantity) => handleQuantityChange(item.productId, quantity)}
                  onRemove={() => handleRemoveItem(item.productId)}
                />
              ))}
            </div>

            <CartSummary />

            <Button variant="default" className="w-full mt-4" onClick={handleClearCart}>
              Limpar Carrinho
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
