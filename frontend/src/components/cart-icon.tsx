import { useEffect, useRef } from 'react';
import { useCartDrawer } from '@/hooks/use-cart';
import { useCartSummary } from '@/hooks/use-cart';
import { ShoppingCart } from 'lucide-react';

export function CartIcon() {
  const { toggle } = useCartDrawer();
  const { totalItems } = useCartSummary();
  const prevTotalItemsRef = useRef(totalItems);
  const animationRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (totalItems !== prevTotalItemsRef.current) {
      prevTotalItemsRef.current = totalItems;

      if (animationRef.current) {
        animationRef.current.classList.remove('scale-110');
        void animationRef.current.offsetWidth;
        animationRef.current.classList.add('scale-110');
        setTimeout(() => {
          animationRef.current?.classList.remove('scale-110');
        }, 150);
      }
    }
  }, [totalItems]);

  return (
    <button
      type="button"
      onClick={toggle}
      className="relative p-2 rounded-md hover:bg-accent transition-colors"
      aria-label="Abrir carrinho"
    >
      <ShoppingCart className="h-5 w-5" />
      {totalItems > 0 && (
        <span
          ref={animationRef}
          className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-medium rounded-full min-w-[18px] h-[18px] flex items-center justify-center transition-transform duration-150"
          style={{ transitionProperty: 'transform' }}
        >
          {totalItems}
        </span>
      )}
    </button>
  );
}
