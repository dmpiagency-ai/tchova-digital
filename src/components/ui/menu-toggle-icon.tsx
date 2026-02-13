'use client';
import React from 'react';
import { cn } from '@/lib/utils';

type MenuToggleProps = React.ComponentProps<'div'> & {
  open: boolean;
  duration?: number;
};

export function MenuToggleIcon({
  open,
  className,
  duration = 300,
  ...props
}: MenuToggleProps) {
  return (
    <div
      className={cn(
        'relative w-6 h-6 flex flex-col justify-center items-center',
        className
      )}
      {...props}
    >
      {/* Top line */}
      <span
        className={cn(
          'absolute w-5 h-0.5 rounded-full bg-current transition-all',
          open ? 'rotate-45 translate-y-0' : '-translate-y-1.5'
        )}
        style={{ transitionDuration: `${duration}ms` }}
      />
      {/* Middle line */}
      <span
        className={cn(
          'absolute w-5 h-0.5 rounded-full bg-current transition-all',
          open ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
        )}
        style={{ transitionDuration: `${duration}ms` }}
      />
      {/* Bottom line */}
      <span
        className={cn(
          'absolute w-5 h-0.5 rounded-full bg-current transition-all',
          open ? '-rotate-45 translate-y-0' : 'translate-y-1.5'
        )}
        style={{ transitionDuration: `${duration}ms` }}
      />
    </div>
  );
}
