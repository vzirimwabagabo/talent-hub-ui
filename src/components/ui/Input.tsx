// src/components/ui/Input.tsx

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Label, LabelProps } from './label';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Optional label text */
  label?: string;
  /** Optional icon next to label (e.g., <Mail />) */
  labelIcon?: React.ReactNode;
  /** Error message to display below input */
  error?: string;
  /** Icon inside left side of input (e.g., search, email) */
  startIcon?: React.ReactNode;
  /** Icon inside right side of input (e.g., visibility toggle) */
  endIcon?: React.ReactNode;
  /** Optional custom id (auto-generated from label if not provided) */
  id?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      labelIcon,
      error,
      startIcon,
      endIcon,
      id,
      ...props
    },
    ref
  ) => {
    // Auto-generate ID from label for accessibility
    const inputId = id || (label ? `input-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

    return (
      <div className="space-y-1.5">
        {/* Label (with optional icon) */}
        {label && (
          <Label htmlFor={inputId} icon={labelIcon}>
            {label}
          </Label>
        )}

        {/* Input wrapper with icons */}
        <div className="relative">
          {/* Left icon */}
          {startIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              {startIcon}
            </div>
          )}

          {/* Input field */}
          <input
            type={type}
            id={inputId}
            className={cn(
              'flex h-10 w-full rounded-[4px] border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 transition-smooth',
              startIcon && 'pl-10',
              endIcon && 'pr-10',
              error && 'border-destructive focus-visible:ring-destructive',
              className
            )}
            ref={ref}
            {...props}
          />

          {/* Right icon */}
          {endIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              {endIcon}
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p className="text-sm text-destructive flex items-center">
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };