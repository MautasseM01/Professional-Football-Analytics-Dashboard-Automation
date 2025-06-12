
import React, { useMemo } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useResponsiveBreakpoint } from '@/hooks/use-orientation';
import { ChartContainer } from '@/components/ui/chart';
import { cn } from '@/lib/utils';

interface ResponsiveChartContainerProps {
  children: React.ReactNode;
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

  const responsiveConfig = useMemo(() => {
    const baseHeight = isMobile ? 280 : 320;
    const calculatedMinHeight = minHeight || baseHeight;
    
    const ratio = aspectRatio || (isMobile ? 1.2 : 2.0);
    
    return {
      aspectRatio: ratio,
      minHeight: calculatedMinHeight,
      margin: isMobile 
        ? { top: 10, right: 10, bottom: 20, left: 10 }
        : { top: 20, right: 20, bottom: 30, left: 20 }
    };
  }, [isMobile, aspectRatio, minHeight]);

  return (
    <div className={cn(
      "w-full transition-all duration-300 ease-out",
      "touch-manipulation", // Optimize for touch devices
      className
    )}>
      <ChartContainer
        config={config}
        aspectRatio={responsiveConfig.aspectRatio}
        minHeight={responsiveConfig.minHeight}
        className="w-full"
      >
        {children}
      </ChartContainer>
    </div>
  );
};
