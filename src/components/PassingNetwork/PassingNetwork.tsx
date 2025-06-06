
import { useEffect, useState, useRef } from "react";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import FootballPitch from "./FootballPitch";
import PlayerNode from "./PlayerNode";
import PassEdge from "./PassEdge";
import { useNetworkData } from "./hooks/useNetworkData";
import { getEdgeColor, getEdgeWidth } from "./utils/networkUtils";
import { PassingNetworkProps } from "./types";
import { ResponsivePitch } from "@/components/ui/responsive-pitch";

export const PassingNetwork = ({
  matchId,
  passDirectionFilter,
  passOutcomeFilter
}: PassingNetworkProps) => {
  // Use custom hook to get network data
  const { players, connections, isLoading } = useNetworkData({
    matchId,
    passDirectionFilter,
    passOutcomeFilter
  });

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center min-h-[400px]">
        <LoadingOverlay isLoading={true} />
      </div>
    );
  }

  return (
    <ResponsivePitch 
      showZoomControls={true}
      aspectRatio={3/2}
    >
      <FootballPitch width={1000} height={667}>
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
                    x: fromPlayer.x * 1000,
                    y: fromPlayer.y * 667,
                  }}
                  to={{
                    x: toPlayer.x * 1000,
                    y: toPlayer.y * 667,
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
                x={player.x * 1000}
                y={player.y * 667}
              />
            ))}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white bg-black/30 rounded p-4">
            <div className="text-center space-y-2">
              <p className="text-sm sm:text-base">
                No player data available for this match
              </p>
            </div>
          </div>
        )}
      </FootballPitch>
    </ResponsivePitch>
  );
};
