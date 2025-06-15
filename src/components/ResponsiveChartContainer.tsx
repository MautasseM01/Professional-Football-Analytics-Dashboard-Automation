
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
      padding: isMobile 
        ? { top: 8, right: 20, bottom: 16, left: 12 } // Asymmetric padding - more right and bottom, less top and left
        : { top: 12, right: 32, bottom: 24, left: 20 }  // More generous right and bottom padding on desktop
    };
  }, [isMobile, minHeight]);

  return (
    <div className={cn(
      "w-full h-full transition-all duration-300 ease-out overflow-hidden",
      "flex items-end justify-end", // Changed from start alignment to end alignment for right-bottom positioning
      "touch-manipulation",
      className
    )}
    style={{
      minHeight: `${responsiveConfig.minHeight}px`,
      contain: 'layout style paint'
    }}>
      <div 
        className="w-full h-full flex items-end justify-end" // Changed alignment here too for right-bottom positioning
        style={{
          padding: `${responsiveConfig.padding.top}px ${responsiveConfig.padding.right}px ${responsiveConfig.padding.bottom}px ${responsiveConfig.padding.left}px`
        }}
      >
        <div className="w-full h-full">
          {children}
        </div>
      </div>
    </div>
  );
};
