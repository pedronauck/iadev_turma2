import { Separator } from '@/components/ui/separator';
import { formatPriceBRL } from '@/lib/format';

interface CartSummaryProps {
  subtotal: number;
}

export function CartSummary({ subtotal }: CartSummaryProps) {
  return (
    <div className="space-y-4">
      <Separator />
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">{formatPriceBRL(subtotal)}</span>
        </div>
        <Separator />
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>{formatPriceBRL(subtotal)}</span>
        </div>
      </div>
    </div>
  );
}
