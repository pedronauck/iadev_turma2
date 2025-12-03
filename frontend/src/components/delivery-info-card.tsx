import { Truck, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeliveryInfoCardProps {
  icon: 'delivery' | 'return';
  title: string;
  description: string;
  className?: string;
}

export function DeliveryInfoCard({
  icon,
  title,
  description,
  className,
}: DeliveryInfoCardProps) {
  const IconComponent = icon === 'delivery' ? Truck : RotateCcw;

  return (
    <div
      className={cn(
        'flex items-center gap-4 p-6 border border-border rounded-lg',
        className
      )}
    >
      <div className="flex-shrink-0 size-10 flex items-center justify-center">
        <IconComponent className="size-6 text-foreground" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-base font-normal leading-6 text-foreground">{title}</p>
        <p className="text-sm font-medium leading-[14px] text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

