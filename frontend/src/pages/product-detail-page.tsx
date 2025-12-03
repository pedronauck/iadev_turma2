import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { ImageGallery } from '@/components/image-gallery';
import { StarRating } from '@/components/star-rating';
import { QuantitySelector } from '@/components/quantity-selector';
import { DeliveryInfoCard } from '@/components/delivery-info-card';
import { EditProductDialog } from '@/components/edit-product-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useProductById, useProducts } from '@/hooks/use-products';
import { useProductImages } from '@/hooks/use-product-images';
import { ArrowLeft, Pencil, Trash2, AlertCircle, Heart } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

const formatPriceBRL = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    value
  );

export function ProductDetailPage() {
  const { id } = useParams({ from: '/product/$id' });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);

  const {
    data: product,
    isLoading: isLoadingProduct,
    isError: isErrorProduct,
    error: productError,
  } = useProductById(id);

  const {
    data: images = [],
    isLoading: isLoadingImages,
    isError: isErrorImages,
    error: imagesError,
  } = useProductImages(id);

  const { deleteProduct, isDeleting } = useProducts();

  const handleDelete = () => {
    if (!product) return;

    deleteProduct(product.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['products'] });
        queryClient.invalidateQueries({ queryKey: ['product', id] });
        queryClient.invalidateQueries({ queryKey: ['product-images', id] });
        navigate({ to: '/' });
      },
    });
  };

  if (isLoadingProduct) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/' })}
          className="gap-2 pl-0 hover:pl-2 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para lista
        </Button>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-16">
          <div className="flex gap-4 flex-col md:flex-row">
             <div className="order-2 md:order-1 flex md:flex-col gap-4 overflow-hidden">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="w-24 h-24 md:w-32 md:h-32 rounded-lg shrink-0" />
                ))}
             </div>
             <Skeleton className="order-1 md:order-2 w-full aspect-square md:aspect-[4/5] rounded-lg" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <div className="flex gap-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-32 w-full" />
            <div className="flex items-center gap-4 pt-4 border-t">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 flex-1" />
              <Skeleton className="h-12 w-12" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isErrorProduct) {
    const isNotFound =
      productError instanceof Error &&
      productError.message === 'Produto não encontrado';

    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/' })}
          className="gap-2 pl-0"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para lista
        </Button>
        <div className="max-w-2xl mx-auto mt-12">
            <Alert variant={isNotFound ? 'default' : 'destructive'}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>
                {isNotFound ? 'Produto não encontrado' : 'Erro ao carregar produto'}
            </AlertTitle>
            <AlertDescription>
                {isNotFound
                ? 'O produto que você está procurando não existe ou foi removido.'
                : productError instanceof Error
                    ? productError.message
                    : 'Ocorreu um erro inesperado ao carregar o produto.'}
            </AlertDescription>
            </Alert>
            <div className="flex justify-center mt-6">
            <Button onClick={() => navigate({ to: '/' })}>Voltar para lista</Button>
            </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button
            variant="ghost"
            onClick={() => navigate({ to: '/' })}
            className="gap-2 pl-0 hover:pl-2 transition-all"
        >
            <ArrowLeft className="h-4 w-4" />
            Voltar para lista
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
        {/* Image Gallery Section */}
        <div>
          <ImageGallery
            images={images}
            productName={product.name}
            isLoading={isLoadingImages}
          />
          {isErrorImages && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro ao carregar imagens</AlertTitle>
              <AlertDescription>
                {imagesError instanceof Error
                  ? imagesError.message
                  : 'Não foi possível carregar as imagens do produto.'}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Product Information Section */}
        <div className="flex flex-col space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
                {product.name}
            </h1>

            <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <StarRating rating={4.5} showReviews={false} />
                    <span className="text-muted-foreground">(150 reviews)</span>
                </div>
                <div className="h-4 w-px bg-border" />
                <span className="text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded">In Stock</span>
            </div>

            <p className="text-3xl font-bold text-foreground">
                {formatPriceBRL(product.price)}
            </p>
          </div>
          
          <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
             <p>{product.description}</p>
          </div>

          <Separator />

          <div className="space-y-6">
             <div className="flex flex-col sm:flex-row gap-4">
                <QuantitySelector
                    value={quantity}
                    onChange={setQuantity}
                    className="w-full sm:w-auto"
                />
                <Button
                    className="flex-1 h-10 text-base font-medium"
                    size="lg"
                >
                    Add to Cart
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="size-10 shrink-0"
                >
                    <Heart className="h-5 w-5" />
                </Button>
             </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <DeliveryInfoCard
                    icon="delivery"
                    title="Free Delivery"
                    description="Enter your postal code for availability"
                />
                <DeliveryInfoCard
                    icon="return"
                    title="Return Delivery"
                    description="Free 30 Days Delivery Returns"
                />
            </div>
          </div>

          {/* Admin Actions */}
          <div className="pt-6 border-t flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Admin Actions
            </span>
            <div className="flex gap-2">
                <EditProductDialog product={product}>
                <Button variant="ghost" size="sm" className="h-8 gap-2">
                    <Pencil className="h-3.5 w-3.5" />
                    Editar
                </Button>
                </EditProductDialog>

                <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                    disabled={isDeleting}
                    >
                    <Trash2 className="h-3.5 w-3.5" />
                    Excluir
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Excluir produto?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Isso excluirá permanentemente o
                        produto <strong>{product.name}</strong>.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Excluindo...' : 'Excluir'}
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

