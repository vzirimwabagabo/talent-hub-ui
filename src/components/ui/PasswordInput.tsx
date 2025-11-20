// src/components/ui/PasswordInput.tsx
import { useState } from 'react';
import { Input } from './Input';
import { Lock, Eye, EyeOff } from 'lucide-react';

export const PasswordInput = (props: React.ComponentProps<typeof Input>) => {
  const [show, setShow] = useState(false);
  return (
    <Input
      {...props}
      type={show ? 'text' : 'password'}
      labelIcon={<Lock className="h-4 w-4" />}
      startIcon={<Lock className="h-5 w-5" />}
      endIcon={
        show ? (
          <EyeOff className="h-5 w-5 cursor-pointer" onClick={() => setShow(false)} />
        ) : (
          <Eye className="h-5 w-5 cursor-pointer" onClick={() => setShow(true)} />
        )
      }
    />
  );
};