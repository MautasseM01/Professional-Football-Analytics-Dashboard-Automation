
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
    const baseHeight = isMobile ? 360 : 450;
    const calculatedMinHeight = minHeight || baseHeight;
    
    return {
      minHeight: calculatedMinHeight,
      // Asymmetric padding to favor bottom-left positioning
      padding: isMobile 
        ? { top: 16, right: 16, bottom: 4, left: 4 } // More top/right, less bottom/left on mobile
        : { top: 20, right: 20, bottom: 8, left: 8 }  // More pronounced on desktop
    };
  }, [isMobile, minHeight]);

  return (
    <div className={cn(
      "w-full h-full transition-all duration-300 ease-out overflow-hidden",
      "flex justify-start items-end", // Position content to bottom-left
      "touch-manipulation",
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
