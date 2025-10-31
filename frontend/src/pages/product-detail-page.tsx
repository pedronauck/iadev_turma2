import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Truck, RotateCcw, Minus, Plus, Heart } from 'lucide-react';
import { useProductById, useProductImages } from '@/hooks/use-products';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatPriceBRL } from '@/lib/format';

export function ProductDetailPage() {
  const { id } = useParams({ from: '/product/$id' });
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { data: product, isLoading: isLoadingProduct, error: productError } = useProductById(id);
  const { data: images = [], isLoading: isLoadingImages } = useProductImages(id);
  const isLoading = isLoadingProduct || isLoadingImages;
  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };
  const handleBack = () => {
    navigate({ to: '/' });
  };
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex gap-4">
            <div className="flex flex-col gap-4 w-[170px]">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-[138px] w-full rounded" />
              ))}
            </div>
            <Skeleton className="flex-1 h-[600px] rounded" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }
  if (productError || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <AlertDescription>
            {productError?.message || 'Produto não encontrado'}
          </AlertDescription>
        </Alert>
        <div className="mt-6 text-center">
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para lista
          </Button>
        </div>
      </div>
    );
  }
  const displayImages = images.length > 0 ? images : [];
  const mainImage = displayImages[selectedImageIndex];
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button onClick={handleBack} variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {displayImages.length > 0 && (
            <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-x-visible">
              {displayImages.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-[170px] h-[138px] bg-neutral-100 rounded overflow-hidden transition-all ${
                    selectedImageIndex === index
                      ? 'ring-2 ring-slate-900 ring-offset-2'
                      : 'hover:ring-2 hover:ring-slate-400 hover:ring-offset-2'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={`${product.name} - imagem ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
          <div className="w-full lg:w-[500px] h-[600px] bg-neutral-100 rounded flex items-center justify-center overflow-hidden">
            {mainImage ? (
              <img
                src={mainImage.url}
                alt={product.name}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="text-center text-muted-foreground p-8">
                <p>Nenhuma imagem disponível</p>
              </div>
            )}
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <h1 className="text-[30px] font-semibold leading-[36px] tracking-[-0.225px] mb-3">
              {product.name}
            </h1>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < 4 ? 'fill-yellow-400' : 'fill-gray-300'}`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
                  </svg>
                ))}
              </div>
              <span className="text-[16px] leading-[28px] opacity-50">(150 Reviews)</span>
              <div className="w-px h-4 bg-slate-400" />
              <Badge variant="outline" className="text-green-500 border-green-500">
                In Stock
              </Badge>
            </div>
            <p className="text-[16px] leading-[28px] mb-4">{formatPriceBRL(product.price)}</p>
            <p className="text-[16px] leading-[28px] text-foreground/90 max-w-[373px]">
              {product.description}
            </p>
          </div>
          <div className="border-t pt-6" />
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-slate-400 rounded-md">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleQuantityChange(-1)}
                className="h-10 w-10 rounded-r-none border-r"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 h-10 text-center border-0 focus:outline-none focus:ring-0 bg-transparent"
                min="1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleQuantityChange(1)}
                className="h-10 w-10 rounded-l-none border-l"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white px-8">
              Add to cart
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <Heart className="h-5 w-5" />
            </Button>
          </div>
          <div className="space-y-3 pt-4">
            <Card className="border border-slate-400 p-6">
              <div className="flex gap-4 items-center">
                <div className="flex-shrink-0">
                  <Truck className="h-10 w-10" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[16px] leading-[24px] font-normal mb-2">Free Delivery</p>
                  <p className="text-[14px] leading-[14px] text-slate-400 font-medium">
                    Enter your postal code
                  </p>
                </div>
              </div>
            </Card>
            <Card className="border border-slate-400 p-6">
              <div className="flex gap-4 items-center">
                <div className="flex-shrink-0">
                  <RotateCcw className="h-10 w-10" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[16px] leading-[24px] font-normal mb-2">Return Delivery</p>
                  <p className="text-[14px] leading-[14px] text-slate-400 font-medium">
                    Free 30 Days Delivery Returns. Details
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
