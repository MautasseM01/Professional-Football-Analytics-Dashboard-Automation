import { useEffect, useState, useRef } from "react";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import FootballPitch from "./FootballPitch";
import PlayerNode from "./PlayerNode";
import PassEdge from "./PassEdge";
import { useNetworkData } from "./hooks/useNetworkData";
import { getEdgeColor, getEdgeWidth } from "./utils/networkUtils";
import { PassingNetworkProps } from "./types";
import { ResponsivePitch } from "@/components/ui/responsive-pitch";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Maximize2, Users } from "lucide-react";

export const PassingNetwork = ({
  matchId,
  passDirectionFilter,
  passOutcomeFilter
}: PassingNetworkProps) => {
  const isMobile = useIsMobile();
  const [showSimplified, setShowSimplified] = useState(false);
  
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

  // Simplified mobile view for passing network
  const SimplifiedPassingView = () => {
    if (!players || players.length === 0) return null;

    // Calculate player statistics
    const playerStats = players.map(player => {
      const outgoingPasses = connections.filter(c => c.from === player.id);
      const incomingPasses = connections.filter(c => c.to === player.id);
      const totalPasses = outgoingPasses.reduce((sum, c) => sum + c.count, 0);
      const receivedPasses = incomingPasses.reduce((sum, c) => sum + c.count, 0);
      
      return {
        ...player,
        totalPasses,
        receivedPasses,
        connections: outgoingPasses.length + incomingPasses.length
      };
    }).sort((a, b) => b.totalPasses - a.totalPasses);

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            Player Connections
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSimplified(false)}
            className="text-xs"
          >
            Show Network
          </Button>
        </div>
        
        <div className="grid gap-2">
          {playerStats.slice(0, 8).map((player, index) => (
            <div key={player.id} className="flex items-center justify-between p-3 bg-card rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <div>
                  <p className="text-sm font-medium">{player.name}</p>
                  <p className="text-xs text-muted-foreground">#{player.number}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{player.totalPasses}</p>
                <p className="text-xs text-muted-foreground">{player.connections} connections</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (isMobile && showSimplified) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <SimplifiedPassingView />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-3">
      {isMobile && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSimplified(true)}
            className="text-xs"
          >
            Simplified View
          </Button>
        </div>
      )}
      
      <ResponsivePitch 
        showZoomControls={true}
        aspectRatio={3/2}
        className="min-h-[300px] sm:min-h-[400px]"
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
    </div>
  );
};
