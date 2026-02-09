import { useCartActions } from '@/hooks/use-cart';
import { formatPriceBRL } from '@/lib/utils';
import { QuantitySelector } from '@/components/quantity-selector';
import { Button } from '@/components/ui/button';
import { ImageOff, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface CartDrawerItemProps {
  productId: string;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
}

export function CartDrawerItem({
  productId,
  name,
  price,
  imageUrl,
  quantity,
}: CartDrawerItemProps) {
  const { updateQuantity, removeItem } = useCartActions();
  const lineTotal = price * quantity;

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemove = () => {
    removeItem(productId);
    toast.success('Item removido do carrinho');
  };

  return (
    <div className="flex gap-4 p-3 bg-muted/50 rounded-lg">
      <div className="w-20 h-20 bg-background rounded-md flex items-center justify-center overflow-hidden shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <ImageOff className="h-6 w-6 text-muted-foreground" />
        )}
      </div>

      <div className="flex-1 flex flex-col gap-2 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-medium line-clamp-2">{name}</h3>
          <span className="text-sm font-bold shrink-0">
            {formatPriceBRL(price)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <QuantitySelector
            value={quantity}
            onChange={handleQuantityChange}
            min={1}
            max={99}
            className="w-fit"
          />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            aria-label="Remover item"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>Total:</span>
          <span className="font-semibold">{formatPriceBRL(lineTotal)}</span>
        </div>
      </div>
    </div>
  );
}
