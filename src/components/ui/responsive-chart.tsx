
import * as React from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useResponsiveBreakpoint } from "@/hooks/use-orientation";
import { ChartContainer } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface ResponsiveChartProps {
  children: React.ReactNode;
  config: any;
  className?: string;
  title?: string;
  showZoomControls?: boolean;
  simplifiedMobileView?: React.ReactNode;
  aspectRatio?: number;
  minHeight?: number;
  isLoading?: boolean;
}

// iOS-style color palette
const iOS_COLORS = {
  primary: "#007AFF",
  secondary: "#34C759",
  background: "#F2F2F7",
  gray: "#8E8E93"
};

// Type for responsive config
interface ResponsiveConfig {
  fontSize: {
    title: string;
    axis: string;
    tooltip: string;
    legend: string;
  };
  aspectRatio: number;
  margin: { top: number; right: number; bottom: number; left: number };
  maxWidth: string;
  minHeight: number;
  hideSecondaryData?: boolean;
}

// iOS-style skeleton loader for charts
const ChartSkeleton = ({ height }: { height: number }) => (
  <div className="w-full rounded-2xl bg-[#F2F2F7]/5 p-4 backdrop-blur-sm">
    <div 
      className="w-full rounded-xl bg-gradient-to-br from-[#F2F2F7]/20 to-[#F2F2F7]/5 relative overflow-hidden"
      style={{ height: `${height}px` }}
    >
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
      
      {/* Chart elements skeleton */}
      <div className="absolute inset-4 space-y-3">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-3 w-6 bg-[#F2F2F7]/30" />
          ))}
        </div>
        
        {/* Chart area */}
        <div className="ml-10 mr-4 h-full relative">
          {/* Data points */}
          <div className="absolute inset-0 flex items-end justify-between">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col items-center space-y-2">
                <Skeleton 
                  className="w-1 bg-[#007AFF]/30 rounded-full" 
                  style={{ height: `${Math.random() * 60 + 20}%` }}
                />
                <Skeleton className="h-2 w-8 bg-[#F2F2F7]/30" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const ResponsiveChart = React.forwardRef<
  HTMLDivElement,
  ResponsiveChartProps
>(({ 
  children, 
  config, 
  className, 
  title, 
  showZoomControls = false,
  simplifiedMobileView,
  aspectRatio,
  minHeight,
  isLoading = false,
  ...props 
}, ref) => {
  const isMobile = useIsMobile();
  const breakpoint = useResponsiveBreakpoint();
  const [zoomLevel, setZoomLevel] = React.useState(1);
  const [showSimplified, setShowSimplified] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Dynamic sizing configuration based on iOS weather app principles
  const getResponsiveConfig = (): ResponsiveConfig => {
    const baseConfig: ResponsiveConfig = {
      // Use CSS clamp for responsive text sizing
      fontSize: {
        title: 'clamp(14px, 4vw, 18px)',
        axis: 'clamp(10px, 2.5vw, 12px)',
        tooltip: 'clamp(11px, 3vw, 14px)',
        legend: 'clamp(10px, 2.5vw, 12px)'
      },
      // Dynamic aspect ratios like iOS weather
      aspectRatio: isMobile ? (aspectRatio || 1.2) : (aspectRatio || 1.8),
      // Responsive margins and padding
      margin: isMobile 
        ? { top: 15, right: 15, bottom: 25, left: 20 } 
        : { top: 25, right: 30, bottom: 35, left: 30 },
      // Container constraints
      maxWidth: isMobile ? '100%' : '800px',
      // Minimum heights that scale with viewport
      minHeight: minHeight || (isMobile ? 220 : 300),
      hideSecondaryData: false
    };

    // Graceful degradation for very small screens
    if (typeof window !== 'undefined' && window.innerWidth < 350) {
      return {
        ...baseConfig,
        aspectRatio: 1.1,
        minHeight: 180,
        fontSize: {
          title: '12px',
          axis: '9px',
          tooltip: '10px',
          legend: '9px'
        },
        margin: { top: 10, right: 10, bottom: 20, left: 15 },
        hideSecondaryData: true
      };
    }

    return baseConfig;
  };

  const responsiveConfig = getResponsiveConfig();

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  // iOS-style pinch-to-zoom
  React.useEffect(() => {
    if (!isMobile || !containerRef.current) return;

    let initialDistance = 0;
    let initialZoom = zoomLevel;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        initialDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        initialZoom = zoomLevel;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        
        const scale = currentDistance / initialDistance;
        const newZoom = Math.max(0.5, Math.min(3, initialZoom * scale));
        setZoomLevel(newZoom);
      }
    };

    const container = containerRef.current;
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isMobile, zoomLevel]);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div ref={ref} className={cn("w-full space-y-3", className)} {...props}>
        {title && (
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-32 bg-[#F2F2F7]/30 rounded-xl" />
          </div>
        )}
        <ChartSkeleton height={responsiveConfig.minHeight} />
      </div>
    );
  }

  // Simplified mobile view for very small screens
  if (isMobile && simplifiedMobileView && (showSimplified || responsiveConfig.hideSecondaryData)) {
    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        <div className="flex items-center justify-between mb-3">
          {title && (
            <h3 
              className="font-medium text-[#007AFF]"
              style={{ fontSize: responsiveConfig.fontSize.title }}
            >
              {title}
            </h3>
          )}
          {!responsiveConfig.hideSecondaryData && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSimplified(false)}
              className="text-[#007AFF] hover:bg-[#007AFF]/10 rounded-xl min-h-[44px]"
              style={{ fontSize: responsiveConfig.fontSize.legend }}
            >
              Show Full Chart
            </Button>
          )}
        </div>
        {simplifiedMobileView}
      </div>
    );
  }

  return (
    <div ref={ref} className={cn("w-full space-y-3", className)} {...props}>
      {/* iOS-style header with controls */}
      <div className="flex items-center justify-between">
        {title && (
          <h3 
            className="font-medium text-[#007AFF]"
            style={{ fontSize: responsiveConfig.fontSize.title }}
          >
            {title}
          </h3>
        )}
        <div className="flex items-center gap-2">
          {isMobile && simplifiedMobileView && !responsiveConfig.hideSecondaryData && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSimplified(true)}
              className="text-[#007AFF] hover:bg-[#007AFF]/10 rounded-xl min-h-[44px]"
              style={{ fontSize: responsiveConfig.fontSize.legend }}
            >
              Simplified
            </Button>
          )}
          {showZoomControls && !isMobile && (
            <div className="flex items-center gap-1 bg-[#F2F2F7]/10 rounded-xl p-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.5}
                className="h-9 w-9 text-[#007AFF] hover:bg-[#007AFF]/10 rounded-lg"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span 
                className="px-2 text-[#8E8E93] font-medium"
                style={{ fontSize: responsiveConfig.fontSize.legend }}
              >
                {Math.round(zoomLevel * 100)}%
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 3}
                className="h-9 w-9 text-[#007AFF] hover:bg-[#007AFF]/10 rounded-lg"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleResetZoom}
                className="h-9 w-9 text-[#007AFF] hover:bg-[#007AFF]/10 rounded-lg"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* iOS weather app-style chart container */}
      <div 
        ref={containerRef}
        className={cn(
          "w-full rounded-2xl overflow-hidden",
          "bg-gradient-to-br from-white/80 to-white/60 dark:from-[#1C1C1E]/80 dark:to-[#1C1C1E]/60",
          "backdrop-blur-xl border border-white/20 dark:border-[#1C1C1E]/30",
          "shadow-lg shadow-black/5 dark:shadow-black/20",
          "transition-all duration-300 ease-out",
          isMobile && "touch-pan-x touch-pan-y"
        )}
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'top left',
          transition: 'transform 0.3s ease-out',
          maxWidth: responsiveConfig.maxWidth,
          margin: '0 auto'
        }}
      >
        <div 
          className="w-full"
          style={{
            aspectRatio: responsiveConfig.aspectRatio,
            minHeight: responsiveConfig.minHeight
          }}
        >
          <ChartContainer 
            config={config}
            aspectRatio={responsiveConfig.aspectRatio}
            minHeight={responsiveConfig.minHeight}
            className="w-full h-full [&_.recharts-text]:fill-current [&_.recharts-text]:text-[length:var(--chart-text-size)]"
            style={{
              '--chart-text-size': responsiveConfig.fontSize.axis
            } as React.CSSProperties}
          >
            {React.cloneElement(children as React.ReactElement, {
              margin: responsiveConfig.margin,
              fontSize: responsiveConfig.fontSize.axis,
              hideSecondaryData: responsiveConfig.hideSecondaryData
            })}
          </ChartContainer>
        </div>
      </div>

      {/* iOS-style gesture hint */}
      {isMobile && (
        <p 
          className="text-center text-[#8E8E93] opacity-60"
          style={{ fontSize: responsiveConfig.fontSize.legend }}
        >
          {showZoomControls ? "Pinch to zoom • Drag to pan" : "Tap and hold for options"}
        </p>
      )}
    </div>
  );
});

ResponsiveChart.displayName = "ResponsiveChart";
