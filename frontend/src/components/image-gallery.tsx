import { useState } from 'react';
import type { ProductImage } from '@/types/product-image';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageGalleryProps {
  images: ProductImage[];
  productName: string;
  isLoading?: boolean;
}

export function ImageGallery({
  images,
  productName,
  isLoading = false,
}: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="flex flex-col md:flex-row gap-4">
        {/* Thumbnails skeleton */}
        <div className="flex flex-row md:flex-col gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={index}
              className="w-[138px] h-[138px] rounded shrink-0"
            />
          ))}
        </div>
        {/* Main image skeleton */}
        <Skeleton className="w-full md:w-[500px] h-[400px] md:h-[600px] rounded shrink-0" />
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-[500px] h-[400px] md:h-[600px] rounded bg-muted flex items-center justify-center shrink-0">
          <div className="flex flex-col items-center justify-center text-muted-foreground gap-2">
            <ImageOff className="h-12 w-12" />
            <span className="text-sm">Sem imagens</span>
          </div>
        </div>
      </div>
    );
  }

  const selectedImage = images[selectedIndex] || images[0];

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Thumbnails on the left (desktop) or top (mobile) */}
      {images.length > 1 && (
        <div className="flex flex-row md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:overflow-x-hidden pb-2 md:pb-0 md:max-h-[600px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={cn(
                'w-[138px] h-[138px] rounded overflow-hidden border transition-all bg-muted shrink-0',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                index === selectedIndex
                  ? 'border-primary ring-2 ring-primary/50'
                  : 'border-border hover:border-primary/50'
              )}
              aria-label={`Ver imagem ${index + 1} de ${productName}`}
              aria-pressed={index === selectedIndex}
            >
              <img
                src={image.url}
                alt={`${productName} - Miniatura ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
      {/* Main image */}
      <div className="w-full md:w-[500px] h-[400px] md:h-[600px] rounded overflow-hidden bg-muted shrink-0">
        <img
          src={selectedImage?.url}
          alt={`${productName} - Imagem principal`}
          className="w-full h-full object-cover transition-opacity duration-300"
          loading="eager"
        />
      </div>
    </div>
  );
}



