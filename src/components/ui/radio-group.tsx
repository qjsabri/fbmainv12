import React from 'react';
import { cn } from '@/lib/utils';

interface RadioGroupProps {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({ 
  children, 
  value, 
  onValueChange, 
  className 
}) => {
  return (
    <div 
      className={cn("grid gap-2", className)}
      role="radiogroup"
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            ...child.props,
            checked: child.props.value === value,
            onSelect: () => onValueChange?.(child.props.value)
          });
        }
        return child;
      })}
    </div>
  );
};

interface RadioGroupItemProps {
  value: string;
  id?: string;
  className?: string;
  checked?: boolean;
  onSelect?: () => void;
  children?: React.ReactNode;
}

export const RadioGroupItem: React.FC<RadioGroupItemProps> = ({ 
  value, 
  id, 
  className,
  checked,
  onSelect,
  children 
}) => {
  return (
    <div className="flex items-center space-x-2">
      <button
        type="button"
        role="radio"
        aria-checked={checked}
        className={cn(
          "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          checked && "bg-primary",
          className
        )}
        onClick={onSelect}
        id={id}
      >
        {checked && (
          <div className="flex items-center justify-center">
            <div className="h-2.5 w-2.5 rounded-full bg-current" />
          </div>
        )}
      </button>
      {children && (
        <label htmlFor={id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {children}
        </label>
      )}
    </div>
  );
};