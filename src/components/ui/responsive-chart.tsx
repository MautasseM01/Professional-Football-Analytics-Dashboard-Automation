
import * as React from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useResponsiveBreakpoint } from "@/hooks/use-orientation";
import { ChartContainer } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ResponsiveChartProps {
  children: React.ReactNode;
  config: any;
  className?: string;
  title?: string;
  showZoomControls?: boolean;
  simplifiedMobileView?: React.ReactNode;
  aspectRatio?: number;
  minHeight?: number;
}

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
  ...props 
}, ref) => {
  const isMobile = useIsMobile();
  const breakpoint = useResponsiveBreakpoint();
  const [zoomLevel, setZoomLevel] = React.useState(1);
  const [showSimplified, setShowSimplified] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Responsive configuration
  const getResponsiveConfig = () => {
    if (breakpoint === 'mobile') {
      return {
        aspectRatio: aspectRatio || (4/3),
        minHeight: minHeight || 200,
        margin: { top: 10, right: 10, bottom: 10, left: 10 },
        fontSize: 10,
        showLegend: false,
        reducedDataPoints: true
      };
    }
    if (breakpoint === 'tablet-portrait') {
      return {
        aspectRatio: aspectRatio || (3/2),
        minHeight: minHeight || 250,
        margin: { top: 15, right: 15, bottom: 15, left: 15 },
        fontSize: 11,
        showLegend: true,
        reducedDataPoints: false
      };
    }
    if (breakpoint === 'tablet-landscape') {
      return {
        aspectRatio: aspectRatio || (16/10),
        minHeight: minHeight || 300,
        margin: { top: 20, right: 20, bottom: 20, left: 20 },
        fontSize: 12,
        showLegend: true,
        reducedDataPoints: false
      };
    }
    return {
      aspectRatio: aspectRatio || (16/9),
      minHeight: minHeight || 350,
      margin: { top: 20, right: 20, bottom: 20, left: 20 },
      fontSize: 12,
      showLegend: true,
      reducedDataPoints: false
    };
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

  // Pinch-to-zoom functionality
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

  if (isMobile && simplifiedMobileView && showSimplified) {
    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        <div className="flex items-center justify-between mb-2">
          {title && <h3 className="text-sm font-medium">{title}</h3>}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSimplified(false)}
            className="text-xs"
          >
            Show Full Chart
          </Button>
        </div>
        {simplifiedMobileView}
      </div>
    );
  }

  return (
    <div ref={ref} className={cn("w-full space-y-2", className)} {...props}>
      {/* Mobile orientation suggestion */}
      {isMobile && (
        <Alert className="bg-blue-500/10 border-blue-500/30">
          <RotateCcw className="h-4 w-4" />
          <AlertDescription className="text-xs">
            For better viewing, try rotating your device to landscape mode
          </AlertDescription>
        </Alert>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between">
        {title && <h3 className="text-sm sm:text-base font-medium">{title}</h3>}
        <div className="flex items-center gap-2">
          {isMobile && simplifiedMobileView && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSimplified(true)}
              className="text-xs min-h-[44px]"
            >
              Simplified View
            </Button>
          )}
          {showZoomControls && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.5}
                className="h-9 w-9 min-h-[44px] min-w-[44px]"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-xs px-2">{Math.round(zoomLevel * 100)}%</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 3}
                className="h-9 w-9 min-h-[44px] min-w-[44px]"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleResetZoom}
                className="h-9 w-9 min-h-[44px] min-w-[44px]"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Chart container */}
      <div 
        ref={containerRef}
        className="w-full overflow-auto touch-pan-x touch-pan-y"
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'top left',
          transition: 'transform 0.2s ease-in-out'
        }}
      >
        <div 
          style={{
            aspectRatio: responsiveConfig.aspectRatio,
            minHeight: responsiveConfig.minHeight,
            width: '100%'
          }}
        >
          {children}
        </div>
      </div>

      {/* Mobile zoom hint */}
      {isMobile && !showZoomControls && (
        <p className="text-xs text-muted-foreground text-center">
          Pinch to zoom • Drag to pan
        </p>
      )}
    </div>
  );
});

ResponsiveChart.displayName = "ResponsiveChart";
