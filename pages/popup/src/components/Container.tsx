import type { ReactNode } from 'react';
import { cn } from '@extension/ui';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export default function Container({ children, className }: ContainerProps) {
  return <div className={cn('container mx-auto px-4', className)}>{children}</div>;
}
