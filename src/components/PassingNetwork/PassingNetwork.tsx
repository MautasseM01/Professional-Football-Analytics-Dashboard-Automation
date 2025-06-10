
import { useEffect, useState, useRef } from "react";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import FootballPitch from "./FootballPitch";
import PlayerNode from "./PlayerNode";
import PassEdge from "./PassEdge";
import { useNetworkData } from "./hooks/useNetworkData";
import { getEdgeColor, getEdgeWidth } from "./utils/networkUtils";
import { PassingNetworkProps } from "./types";
import { useIsMobile } from "@/hooks/use-mobile";
import { useResponsiveBreakpoint } from "@/hooks/use-orientation";
import { useHapticFeedback } from "@/hooks/use-haptic-feedback";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

export const PassingNetwork = ({
  matchId,
  passDirectionFilter,
  passOutcomeFilter
}: PassingNetworkProps) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [detailLevel, setDetailLevel] = useState<'overview' | 'detailed'>('overview');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useIsMobile();
  const breakpoint = useResponsiveBreakpoint();
  const { triggerHaptic } = useHapticFeedback();

  // Use custom hook to get network data
  const { players, connections, isLoading } = useNetworkData({
    matchId,
    passDirectionFilter,
    passOutcomeFilter
  });

  // Touch gesture handling
  const [isDragging, setIsDragging] = useState(false);
  const [lastTouch, setLastTouch] = useState({ x: 0, y: 0 });
  const [transform, setTransform] = useState({ x: 0, y: 0 });

  // Responsive dimensions calculation with iOS-style aspect ratios
  const getOptimalDimensions = () => {
    if (!containerRef.current) return { width: 0, height: 0 };
    
    const container = containerRef.current.getBoundingClientRect();
    let width = container.width;
    let height = container.height;

    // iOS Weather app-inspired aspect ratios
    if (breakpoint === 'mobile') {
      width = Math.max(width, 375);
      height = Math.max(height, 280);
      // Maintain 4:3 aspect ratio for mobile
      if (width / height > 1.33) {
        height = width / 1.33;
      }
    } else if (breakpoint === 'tablet-portrait') {
      width = Math.max(width, 768);
      height = Math.max(height, 480);
    } else {
      width = Math.max(width, 1024);
      height = Math.max(height, 640);
    }

    return { width, height };
  };

  // Set up the container dimensions with responsive optimization
  useEffect(() => {
    const updateDimensions = () => {
      const newDimensions = getOptimalDimensions();
      setDimensions(newDimensions);
    };

    updateDimensions();

    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateDimensions, 150);
    };

    window.addEventListener('resize', debouncedResize);
    window.addEventListener('orientationchange', debouncedResize);
    
    return () => {
      window.removeEventListener('resize', debouncedResize);
      window.removeEventListener('orientationchange', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, [breakpoint]);

  // Touch event handlers for pan/zoom
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setLastTouch({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      triggerHaptic('light');
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1) {
      const deltaX = e.touches[0].clientX - lastTouch.x;
      const deltaY = e.touches[0].clientY - lastTouch.y;
      
      setTransform(prev => ({
        x: Math.max(-100, Math.min(100, prev.x + deltaX * 0.5)),
        y: Math.max(-100, Math.min(100, prev.y + deltaY * 0.5))
      }));
      
      setLastTouch({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Zoom controls
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(2, prev + 0.2));
    triggerHaptic('medium');
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(0.5, prev - 0.2));
    triggerHaptic('medium');
  };

  const handleReset = () => {
    setZoomLevel(1);
    setTransform({ x: 0, y: 0 });
    setSelectedPlayer(null);
    setDetailLevel('overview');
    triggerHaptic('heavy');
  };

  // Player selection handler
  const handlePlayerSelect = (playerId: string) => {
    setSelectedPlayer(playerId);
    setDetailLevel('detailed');
    triggerHaptic('medium');
  };

  // iOS-style container classes with gradients
  const getContainerClasses = () => {
    const baseClasses = "relative transition-all duration-300 ease-out rounded-2xl overflow-hidden";
    
    if (breakpoint === 'mobile') {
      return `${baseClasses} min-h-[280px] bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800`;
    }
    return `${baseClasses} min-h-[500px] bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800`;
  };

  if (isLoading) {
    return (
      <div className={getContainerClasses()}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="space-y-4 text-center">
            {/* iOS-style loading skeleton */}
            <div className="mx-auto w-16 h-16 bg-white/20 dark:bg-white/10 rounded-full animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 bg-white/20 dark:bg-white/10 rounded-full w-32 mx-auto animate-pulse" />
              <div className="h-3 bg-white/15 dark:bg-white/5 rounded-full w-24 mx-auto animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={getContainerClasses()}>
      {/* iOS-style control bar */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleZoomOut}
          className="bg-white/90 dark:bg-black/90 backdrop-blur-sm border-0 shadow-lg hover:scale-105 transition-transform"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleZoomIn}
          className="bg-white/90 dark:bg-black/90 backdrop-blur-sm border-0 shadow-lg hover:scale-105 transition-transform"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleReset}
          className="bg-white/90 dark:bg-black/90 backdrop-blur-sm border-0 shadow-lg hover:scale-105 transition-transform"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Main visualization container */}
      <div 
        ref={containerRef}
        className="w-full h-full relative overflow-hidden touch-manipulation"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `scale(${zoomLevel}) translate(${transform.x}px, ${transform.y}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out'
        }}
      >
        <FootballPitch width={dimensions.width} height={dimensions.height}>
          {players && players.length > 0 ? (
            <>
              {/* Render passing connections with enhanced styling */}
              {connections.map((connection, idx) => {
                const fromPlayer = players.find(p => p.id === connection.from);
                const toPlayer = players.find(p => p.id === connection.to);
                
                if (!fromPlayer || !toPlayer) return null;
                
                const scaledWidth = getEdgeWidth(connection.count, connections) * 
                  (breakpoint === 'mobile' ? 1.2 : 1);
                
                return (
                  <PassEdge
                    key={`edge-${idx}`}
                    from={{
                      x: fromPlayer.x * dimensions.width,
                      y: fromPlayer.y * dimensions.height,
                    }}
                    to={{
                      x: toPlayer.x * dimensions.width,
                      y: toPlayer.y * dimensions.height,
                    }}
                    color={getEdgeColor(connection.count, connections)}
                    width={scaledWidth}
                    count={connection.count}
                  />
                );
              })}
              
              {/* Render player nodes with touch optimization */}
              {players.map(player => (
                <PlayerNode
                  key={`player-${player.id}`}
                  player={player}
                  x={player.x * dimensions.width}
                  y={player.y * dimensions.height}
                  onSelect={() => handlePlayerSelect(String(player.id))}
                  isSelected={selectedPlayer === String(player.id)}
                  detailLevel={detailLevel}
                />
              ))}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white/70 bg-black/20 rounded-xl m-4">
              <div className="text-center space-y-2">
                <p className="text-sm sm:text-base">
                  {isLoading ? 'Loading network data...' : 'No player data available'}
                </p>
                {!isLoading && isMobile && (
                  <p className="text-xs text-white/50">
                    Try rotating your device for better viewing
                  </p>
                )}
              </div>
            </div>
          )}
        </FootballPitch>
      </div>

      {/* Selected player detail card */}
      {selectedPlayer && detailLevel === 'detailed' && (
        <Card className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-black/95 backdrop-blur-md border-0 shadow-2xl rounded-2xl z-30">
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">
                  {players.find(p => String(p.id) === selectedPlayer)?.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {players.find(p => String(p.id) === selectedPlayer)?.position}
                </p>
                <p className="text-sm font-medium mt-1">
                  {players.find(p => String(p.id) === selectedPlayer)?.totalPasses} passes
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDetailLevel('overview')}
                className="hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                ✕
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
