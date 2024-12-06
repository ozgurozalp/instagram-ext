import { RefreshCw } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export function Spinner({ className, ...props }: ComponentProps<typeof RefreshCw>) {
  return <RefreshCw className={cn('animate-spin', className)} {...props} />;
}
