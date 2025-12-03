import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating?: number;
  maxRating?: number;
  showReviews?: boolean;
  reviewCount?: number;
  className?: string;
}

export function StarRating({
  rating = 0,
  maxRating = 5,
  showReviews = false,
  reviewCount = 0,
  className,
}: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxRating }).map((_, index) => {
          const isFilled = index < fullStars || (index === fullStars && hasHalfStar);
          return (
            <Star
              key={index}
              className={cn(
                'size-5',
                isFilled
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-none text-muted-foreground'
              )}
            />
          );
        })}
      </div>
      {showReviews && reviewCount > 0 && (
        <span className="text-sm text-muted-foreground opacity-50">
          ({reviewCount} Reviews)
        </span>
      )}
    </div>
  );
}

