// src/components/Logo.tsx

import { cn } from '@/lib/utils';

interface LogoProps {
  collapsed: boolean;
}

export default function Logo({ collapsed }: LogoProps) {
  return (
    <div className={cn(
      'flex items-center gap-2 transition-all duration-300',
      collapsed && 'justify-center'
    )}>
      <div className="bg-gradient-primary w-8 h-8 rounded-lg flex items-center justify-center">
        <span className="text-primary-foreground font-bold text-lg">T</span>
      </div>
      {!collapsed && (
        <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          TalentHub
        </span>
      )}
    </div>
  );
}