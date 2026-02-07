import { useCart } from "@/hooks/use-cart";

const formatPriceBRL = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

export function CartSummary() {
  const { itemCount, subtotal } = useCart();

  return (
    <div className="border-t border-border pt-4 mt-4 space-y-3">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Itens ({itemCount}):</span>
        <span className="font-medium">{formatPriceBRL(subtotal)}</span>
      </div>
      <div className="flex justify-between text-base font-semibold border-t border-border pt-3">
        <span>Total:</span>
        <span>{formatPriceBRL(subtotal)}</span>
      </div>
    </div>
  );
}
