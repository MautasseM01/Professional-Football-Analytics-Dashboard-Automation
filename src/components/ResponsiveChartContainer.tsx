
import React, { useMemo } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useResponsiveBreakpoint } from '@/hooks/use-orientation';
import { cn } from '@/lib/utils';
import { ChartContainer, ChartConfig } from '@/components/ui/chart';
import { clubChartTheme } from '@/components/charts/ChartTheme';

interface ResponsiveChartContainerProps {
  children: React.ReactElement;
  className?: string;
  config?: ChartConfig;
  aspectRatio?: number;
  minHeight?: number;
  showInteractions?: boolean;
}

export const ResponsiveChartContainer = ({
  children,
  className,
  config = clubChartTheme,
  aspectRatio,
  minHeight,
  showInteractions = true
}: ResponsiveChartContainerProps) => {
  const isMobile = useIsMobile();
  const breakpoint = useResponsiveBreakpoint();

  const responsiveConfig = useMemo(() => {
    const baseHeight = isMobile ? 320 : 400;
    const calculatedMinHeight = minHeight || baseHeight;
    
    return {
      minHeight: calculatedMinHeight,
      aspectRatio: aspectRatio || (isMobile ? 1.2 : 1.8),
      // Enhanced padding for better mobile experience
      padding: isMobile 
        ? { top: 20, right: 20, bottom: 20, left: 20 }
        : { top: 24, right: 24, bottom: 24, left: 24 }
    };
  }, [isMobile, minHeight, aspectRatio]);

  return (
    <div className={cn(
      "w-full transition-all duration-500 ease-out",
      "relative overflow-hidden",
      showInteractions && "group",
      className
    )}>
      {/* Interactive overlay for zoom/pan capabilities */}
      {showInteractions && (
        <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute top-2 right-2 flex gap-1">
            <div className="w-2 h-2 bg-club-gold/60 rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-club-gold/40 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 bg-club-gold/20 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      )}
      
      <ChartContainer
        config={config}
        className={cn(
          "h-full w-full",
          "transition-all duration-300 ease-in-out",
          showInteractions && "hover:scale-[1.02] hover:shadow-lg hover:shadow-club-gold/20"
        )}
        aspectRatio={responsiveConfig.aspectRatio}
        minHeight={responsiveConfig.minHeight}
      >
        {React.cloneElement(children, {
          ...children.props,
          margin: responsiveConfig.padding,
          className: cn(children.props.className, "animate-fade-in"),
        })}
      </ChartContainer>
    </div>
  );
};
