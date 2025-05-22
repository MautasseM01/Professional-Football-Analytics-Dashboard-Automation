
import { useEffect, useState, useRef } from "react";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import FootballPitch from "./FootballPitch";
import PlayerNode from "./PlayerNode";
import PassEdge from "./PassEdge";
import { useNetworkData } from "./hooks/useNetworkData";
import { getEdgeColor, getEdgeWidth } from "./utils/networkUtils";
import { PassingNetworkProps } from "./types";

export const PassingNetwork = ({
  matchId,
  passDirectionFilter,
  passOutcomeFilter
}: PassingNetworkProps) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Use custom hook to get network data
  const { players, connections, isLoading } = useNetworkData({
    matchId,
    passDirectionFilter,
    passOutcomeFilter
  });

  // Set up the container dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  return (
    <div className="w-full h-full relative" ref={containerRef}>
      <LoadingOverlay isLoading={isLoading} />
      
      <FootballPitch width={dimensions.width} height={dimensions.height}>
        {players && players.length > 0 ? (
          <>
            {/* Render passing connections (edges) first so they appear behind nodes */}
            {connections.map((connection, idx) => {
              const fromPlayer = players.find(p => p.id === connection.from);
              const toPlayer = players.find(p => p.id === connection.to);
              
              if (!fromPlayer || !toPlayer) return null;
              
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
                  width={getEdgeWidth(connection.count, connections)}
                  count={connection.count}
                />
              );
            })}
            
            {/* Render player nodes */}
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
          <div className="absolute inset-0 flex items-center justify-center text-white bg-black/30 rounded">
            {isLoading ? 'Loading data...' : 'No player data available for this match'}
          </div>
        )}
      </FootballPitch>
    </div>
  );
};
