import React from 'react';
import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'blue';
  className?: string;
}

const Spinner = ({ size = 'md', color = 'primary', className }: SpinnerProps) => {
  const sizeClasses = {
    xs: 'w-3 h-3 border-[1px]',
    sm: 'w-4 h-4 border-[1.5px]',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-[2.5px]',
    xl: 'w-12 h-12 border-3'
  };

  const colorClasses = {
    primary: 'border-primary/30 border-t-primary',
    secondary: 'border-secondary/30 border-t-secondary',
    white: 'border-white/30 border-t-white',
    blue: 'border-blue-600/30 border-t-blue-600 dark:border-blue-500/30 dark:border-t-blue-500'
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-t-transparent',
        sizeClasses[size],
        colorClasses[color],
        className,
        'will-change-transform'
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;