import React from 'react';
import { Button, ButtonProps } from './button';
import Spinner from './Spinner';
import { cn } from '@/lib/utils';

interface ButtonLoadingProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
  spinnerPosition?: 'left' | 'right' | 'center';
  spinnerSize?: 'xs' | 'sm';
  spinnerColor?: 'primary' | 'white';
}

const ButtonLoading = React.forwardRef<HTMLButtonElement, ButtonLoadingProps>(
  ({ 
    children, 
    loading = false, 
    loadingText,
    spinnerPosition = 'left',
    spinnerSize = 'sm',
    spinnerColor = 'primary',
    disabled,
    className,
    ...props 
  }, ref) => {
    return (
      <Button
        className={cn(
          'relative',
          className
        )}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading ? (
          <>
            {spinnerPosition === 'left' && (
              <Spinner size={spinnerSize} color={spinnerColor} className="mr-2" />
            )}
            {spinnerPosition === 'center' && (
              <Spinner size={spinnerSize} color={spinnerColor} className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            )}
            <span className={spinnerPosition === 'center' ? 'opacity-0' : ''}>
              {loadingText || children}
            </span>
            {spinnerPosition === 'right' && (
              <Spinner size={spinnerSize} color={spinnerColor} className="ml-2" />
            )}
          </>
        ) : (
          children
        )}
      </Button>
    );
  }
);

ButtonLoading.displayName = 'ButtonLoading';

export { ButtonLoading };