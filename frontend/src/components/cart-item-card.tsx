import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatPriceBRL } from '@/lib/format';
import { useUpdateCartItem, useRemoveCartItem } from '@/hooks/use-cart';
import type { CartItem } from '@/types/cart';

interface CartItemCardProps {
  item: CartItem;
}

export function CartItemCard({ item }: CartItemCardProps) {
  const updateMutation = useUpdateCartItem();
  const removeMutation = useRemoveCartItem();
  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateMutation.mutate({ id: item.id, quantity: item.quantity - 1 });
    } else {
      removeMutation.mutate(item.id);
    }
  };
  const handleIncrement = () => {
    updateMutation.mutate({ id: item.id, quantity: item.quantity + 1 });
  };
  const handleRemove = () => {
    removeMutation.mutate(item.id);
  };
  const subtotal = item.product.price * item.quantity;
  const isLoading = updateMutation.isPending || removeMutation.isPending;
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{item.product.name}</h3>
            <p className="text-sm text-muted-foreground">
              SKU: {item.product.sku}
            </p>
            <p className="text-sm font-medium mt-1">
              {formatPriceBRL(item.product.price)}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              disabled={isLoading}
              className="h-8 w-8"
              aria-label="Remover item"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleDecrement}
                disabled={isLoading}
                className="h-8 w-8"
                aria-label="Diminuir quantidade"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-medium">
                {item.quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={handleIncrement}
                disabled={isLoading}
                className="h-8 w-8"
                aria-label="Aumentar quantidade"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm font-bold">{formatPriceBRL(subtotal)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
