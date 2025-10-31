import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartItemCount } from '@/stores/cart-store';
import { useCartSummary } from '@/hooks/use-cart';

interface CartButtonProps {
  onClick?: () => void;
}

export function CartButton({ onClick }: CartButtonProps) {
  const itemCount = useCartItemCount();
  useCartSummary();
  return (
    <Button
      variant="outline"
      size="icon"
      className="relative"
      onClick={onClick}
      aria-label={`Carrinho com ${itemCount} ${itemCount === 1 ? 'item' : 'itens'}`}
    >
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
        >
          {itemCount > 99 ? '99+' : itemCount}
        </Badge>
      )}
    </Button>
  );
}
