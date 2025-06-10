
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

export const PassingNetwork = ({
  matchId,
  passDirectionFilter,
  passOutcomeFilter
}: PassingNetworkProps) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useIsMobile();
  const breakpoint = useResponsiveBreakpoint();

  // Use custom hook to get network data
  const { players, connections, isLoading } = useNetworkData({
    matchId,
    passDirectionFilter,
    passOutcomeFilter
  });

  // Responsive dimensions calculation
  const getOptimalDimensions = () => {
    if (!containerRef.current) return { width: 0, height: 0 };
    
    const container = containerRef.current.getBoundingClientRect();
    let width = container.width;
    let height = container.height;

    // Ensure minimum dimensions based on breakpoint
    if (breakpoint === 'mobile') {
      width = Math.max(width, 320);
      height = Math.max(height, 200);
      // Maintain aspect ratio for mobile
      if (width / height > 1.6) {
        height = width / 1.6;
      }
    } else if (breakpoint === 'tablet-portrait') {
      width = Math.max(width, 640);
      height = Math.max(height, 400);
    } else if (breakpoint === 'tablet-landscape') {
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

    // Initial calculation
    updateDimensions();

    // Debounced resize handler
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

  // Responsive styling classes
  const getContainerClasses = () => {
    const baseClasses = "w-full h-full relative transition-all duration-300 ease-in-out";
    
    if (breakpoint === 'mobile') {
      return `${baseClasses} min-h-[200px] max-h-[50vh]`;
    }
    if (breakpoint === 'tablet-portrait') {
      return `${baseClasses} min-h-[300px] max-h-[60vh]`;
    }
    if (breakpoint === 'tablet-landscape') {
      return `${baseClasses} min-h-[400px] max-h-[70vh]`;
    }
    return `${baseClasses} min-h-[500px] max-h-[80vh]`;
  };

  return (
    <div className={getContainerClasses()} ref={containerRef}>
      <LoadingOverlay isLoading={isLoading} />
      
      <FootballPitch width={dimensions.width} height={dimensions.height}>
        {players && players.length > 0 ? (
          <>
            {/* Render passing connections (edges) first so they appear behind nodes */}
            {connections.map((connection, idx) => {
              const fromPlayer = players.find(p => p.id === connection.from);
              const toPlayer = players.find(p => p.id === connection.to);
              
              if (!fromPlayer || !toPlayer) return null;
              
              // Scale edge width based on screen size
              const scaledWidth = getEdgeWidth(connection.count, connections) * 
                (breakpoint === 'mobile' ? 0.7 : breakpoint === 'tablet-portrait' ? 0.85 : 1);
              
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
            
            {/* Render player nodes with responsive scaling */}
            {players.map(player => (
              <PlayerNode
                key={`player-${player.id}`}
                player={player}
                x={player.x * dimensions.width}
                y={player.y * dimensions.height}
              />
            ))}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white bg-black/30 rounded p-4">
            <div className="text-center space-y-2">
              <p className="text-sm sm:text-base">
                {isLoading ? 'Loading data...' : 'No player data available for this match'}
              </p>
              {!isLoading && isMobile && (
                <p className="text-xs text-white/70">
                  Try rotating your device for better viewing
                </p>
              )}
            </div>
          </div>
        )}
      </FootballPitch>
    </div>
  );
};
