
import React, { useMemo } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useResponsiveBreakpoint } from '@/hooks/use-orientation';
import { cn } from '@/lib/utils';

interface ResponsiveChartContainerProps {
  children: React.ReactElement;
  className?: string;
  config?: Record<string, { color: string }>;
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

  const responsiveConfig = useMemo(() => {
    const baseHeight = isMobile ? 320 : 400;
    const calculatedMinHeight = minHeight || baseHeight;
    
    return {
      minHeight: calculatedMinHeight,
      padding: isMobile 
        ? { top: 10, right: 10, bottom: 10, left: 10 }
        : { top: 15, right: 15, bottom: 15, left: 15 }
    };
  }, [isMobile, minHeight]);

  return (
    <div className={cn(
      "w-full h-full transition-all duration-300 ease-out overflow-hidden",
      "touch-manipulation", // Optimize for touch devices
      className
    )}
    style={{
      minHeight: `${responsiveConfig.minHeight}px`,
      contain: 'layout style paint'
    }}>
      <div 
        className="w-full h-full"
        style={{
          padding: `${responsiveConfig.padding.top}px ${responsiveConfig.padding.right}px ${responsiveConfig.padding.bottom}px ${responsiveConfig.padding.left}px`
        }}
      >
        {children}
      </div>
    </div>
  );
};
