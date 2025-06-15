
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
    const baseHeight = isMobile ? 360 : 450; // Increased base heights for better spacing
    const calculatedMinHeight = minHeight || baseHeight;
    
    return {
      minHeight: calculatedMinHeight,
      padding: isMobile 
        ? { top: 16, right: 8, bottom: 12, left: 20 } // Asymmetric padding - more top and left, less right
        : { top: 24, right: 12, bottom: 20, left: 32 }  // More generous top and left padding on desktop
    };
  }, [isMobile, minHeight]);

  return (
    <div className={cn(
      "w-full h-full transition-all duration-300 ease-out overflow-hidden",
      "flex items-start justify-start", // Changed from center alignment to start alignment
      "touch-manipulation", // Optimize for touch devices
      className
    )}
    style={{
      minHeight: `${responsiveConfig.minHeight}px`,
      contain: 'layout style paint'
    }}>
      <div 
        className="w-full h-full flex items-start justify-start" // Changed alignment here too
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
