
import React, { useMemo } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useResponsiveBreakpoint } from '@/hooks/use-orientation';
import { cn } from '@/lib/utils';

interface ResponsiveChartContainerProps {
  children: React.ReactElement;
  className?: string;
  config: Record<string, { color: string }>;
  aspectRatio?: number;
  minHeight?: number;
}

export const ResponsiveChartContainer = ({
  children,
  className,
  config,
  aspectRatio,
  minHeight
}: ResponsiveChartContainerProps) => {
  const isMobile = useIsMobile();
  const breakpoint = useResponsiveBreakpoint();

  const containerStyles = useMemo(() => {
    return {
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      position: 'relative' as const,
      containment: 'layout style' as const
    };
  }, []);

  return (
    <div 
      className={cn(
        "w-full h-full transition-all duration-300 ease-out overflow-hidden",
        "touch-manipulation select-none", // Optimize for touch devices
        className
      )}
      style={containerStyles}
    >
      <div className="w-full h-full p-1">
        {children}
      </div>
    </div>
  );
};
