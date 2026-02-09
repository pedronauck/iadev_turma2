import type { ReactNode } from 'react';
import { useCartActions } from '@/hooks/use-cart';
import { toast } from 'sonner';

interface AddToCartButtonProps {
  productId: string;
  name: string;
  price: number;
  imageUrl: string | null;
  children?: ReactNode;
  className?: string;
}

export function AddToCartButton({
  productId,
  name,
  price,
  imageUrl,
  children,
  className,
}: AddToCartButtonProps) {
  const { addItem } = useCartActions();

  const handleAdd = () => {
    addItem({ productId, name, price, imageUrl, quantity: 1 });
    toast.success('Produto adicionado ao carrinho!');
  };

  return (
    <button type="button" onClick={handleAdd} className={className}>
      {children || 'Adicionar ao Carrinho'}
    </button>
  );
}
