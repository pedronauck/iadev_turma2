import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuantitySelector } from "@/components/quantity-selector";
import type { CartItem } from "@/types/cart";
import { cn } from "@/lib/utils";

interface CartItemProps {
  item: CartItem;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

const formatPriceBRL = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

export function CartItemComponent({ item, onQuantityChange, onRemove }: CartItemProps) {
  const lineTotal = item.price * item.quantity;

  return (
    <div className="flex gap-4 pb-4 border-b border-border last:border-b-0 last:pb-0">
      {/* Product Image */}
      <div className="flex-shrink-0">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-20 h-20 object-cover rounded-md bg-muted"
          />
        ) : (
          <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
            <span className="text-xs">Sem imagem</span>
          </div>
        )}
      </div>

      {/* Product Info and Controls */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-sm line-clamp-2">{item.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{formatPriceBRL(item.price)}</p>
        </div>

        <div className="flex items-center justify-between">
          <QuantitySelector
            value={item.quantity}
            onChange={onQuantityChange}
            min={1}
            max={99}
            className={cn("scale-90", "origin-left")}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            aria-label="Remover do carrinho"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Line Total */}
      <div className="flex flex-col items-end justify-between flex-shrink-0">
        <div className="font-semibold">{formatPriceBRL(lineTotal)}</div>
      </div>
    </div>
  );
}
