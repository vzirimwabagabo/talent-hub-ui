// src/components/ui/Label.tsx

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center'
);

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right'; // default: left
}

const Label = React.forwardRef<
  HTMLLabelElement,
  LabelProps
>(({ className, icon, iconPosition = 'left', children, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props}>
    {icon && iconPosition === 'left' && (
      <span className="mr-2 text-muted-foreground">{icon}</span>
    )}
    {children}
    {icon && iconPosition === 'right' && (
      <span className="ml-2 text-muted-foreground">{icon}</span>
    )}
  </LabelPrimitive.Root>
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };