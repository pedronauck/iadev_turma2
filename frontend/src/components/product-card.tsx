import { Link } from '@tanstack/react-router';
import { ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatPriceBRL } from '@/lib/format';
import { useProductImages } from '@/hooks/use-products';
import { useAddToCart } from '@/hooks/use-cart';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { data: images } = useProductImages(product.id);
  const addToCart = useAddToCart();
  const firstImage = images?.[0];
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart.mutate({ productId: product.id, quantity: 1 });
  };
  return (
    <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden group">
      <Link to="/product/$id" params={{ id: product.id }} className="block">
        {firstImage && (
          <div className="relative aspect-video w-full overflow-hidden bg-muted">
            <img
              src={firstImage.url}
              alt={product.name}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
        )}
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg">{product.name}</CardTitle>
            <Badge variant="secondary">{product.sku}</Badge>
          </div>
          <CardDescription className="line-clamp-2">
            {product.description}
          </CardDescription>
        </CardHeader>
      </Link>
      <CardContent className="space-y-3">
        <p className="text-2xl font-bold">{formatPriceBRL(product.price)}</p>
        <Button
          className="w-full"
          onClick={handleAddToCart}
          disabled={addToCart.isPending}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {addToCart.isPending ? 'Adicionando...' : 'Adicionar ao Carrinho'}
        </Button>
      </CardContent>
    </Card>
  );
}
