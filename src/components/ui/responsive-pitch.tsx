
import * as React from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useResponsiveBreakpoint } from "@/hooks/use-orientation";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw, Maximize2 } from "lucide-react";

interface ResponsivePitchProps {
  children: React.ReactNode;
  className?: string;
  showZoomControls?: boolean;
  aspectRatio?: number;
}

export const ResponsivePitch = React.forwardRef<
  HTMLDivElement,
  ResponsivePitchProps
>(({ 
  children, 
  className, 
  showZoomControls = true,
  aspectRatio = 3/2,
  ...props 
}, ref) => {
  const isMobile = useIsMobile();
  const breakpoint = useResponsiveBreakpoint();
  const [zoomLevel, setZoomLevel] = React.useState(1);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Get responsive dimensions
  const getDimensions = () => {
    if (typeof window === 'undefined') return { width: 800, height: 500 };
    
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    if (isFullscreen) {
      return {
        width: Math.min(screenWidth - 20, 1200),
        height: Math.min(screenHeight - 100, 750)
      };
    }
    
    if (breakpoint === 'mobile') {
      return {
        width: Math.min(screenWidth - 32, 350),
        height: Math.min((screenWidth - 32) / aspectRatio, 220)
      };
    }
    if (breakpoint === 'tablet-portrait') {
      return {
        width: Math.min(screenWidth - 64, 600),
        height: Math.min((screenWidth - 64) / aspectRatio, 400)
      };
    }
    if (breakpoint === 'tablet-landscape') {
      return {
        width: Math.min(screenWidth - 80, 900),
        height: Math.min((screenWidth - 80) / aspectRatio, 600)
      };
    }
    return {
      width: Math.min(screenWidth - 100, 1000),
      height: Math.min((screenWidth - 100) / aspectRatio, 667)
    };
  };

  const dimensions = getDimensions();

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setZoomLevel(1); // Reset zoom when toggling fullscreen
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

  const containerClasses = cn(
    "relative bg-club-dark-gray rounded-lg overflow-auto",
    "touch-pan-x touch-pan-y",
    isFullscreen && "fixed inset-4 z-50 bg-background border shadow-2xl",
    className
  );

  const pitchStyle = {
    width: `${dimensions.width * zoomLevel}px`,
    height: `${dimensions.height * zoomLevel}px`,
    minWidth: breakpoint === 'mobile' ? '300px' : '400px',
    minHeight: breakpoint === 'mobile' ? '200px' : '267px',
    transition: 'all 0.2s ease-in-out'
  };

  return (
    <div ref={ref} className={containerClasses} {...props}>
      {/* Controls */}
      {showZoomControls && (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-background/80 backdrop-blur-sm rounded-md p-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomOut}
            disabled={zoomLevel <= 0.5}
            className="h-8 w-8 min-h-[44px] min-w-[44px]"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs px-2 min-w-[40px] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomIn}
            disabled={zoomLevel >= 3}
            className="h-8 w-8 min-h-[44px] min-w-[44px]"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleResetZoom}
            className="h-8 w-8 min-h-[44px] min-w-[44px]"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="h-8 w-8 min-h-[44px] min-w-[44px]"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Pitch container */}
      <div 
        ref={containerRef}
        className="flex justify-center items-center w-full h-full p-4"
      >
        <div style={pitchStyle}>
          {children}
        </div>
      </div>

      {/* Mobile instruction */}
      {isMobile && (
        <div className="absolute bottom-2 left-2 right-2 text-center">
          <p className="text-xs text-muted-foreground bg-background/80 backdrop-blur-sm rounded px-2 py-1">
            Pinch to zoom • Drag to pan
          </p>
        </div>
      )}

      {/* Fullscreen overlay */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={toggleFullscreen}
        />
      )}
    </div>
  );
});

ResponsivePitch.displayName = "ResponsivePitch";
