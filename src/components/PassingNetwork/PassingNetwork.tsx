
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
import { Maximize2, Users, ZoomIn, ZoomOut } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useHapticFeedback } from "@/hooks/use-haptic-feedback";

export const PassingNetwork = ({
  matchId,
  passDirectionFilter,
  passOutcomeFilter
}: PassingNetworkProps) => {
  const isMobile = useIsMobile();
  const [showSimplified, setShowSimplified] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { triggerHaptic } = useHapticFeedback();
  
  // Use custom hook to get network data
  const { players, connections, isLoading } = useNetworkData({
    matchId,
    passDirectionFilter,
    passOutcomeFilter
  });

  // Touch gesture handlers
  const handleZoomIn = () => {
    triggerHaptic('light');
    setZoomLevel(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    triggerHaptic('light');
    setZoomLevel(prev => Math.max(prev / 1.2, 0.5));
  };

  const handlePlayerSelect = (playerId: number) => {
    triggerHaptic('selection');
    setSelectedPlayer(selectedPlayer === playerId ? null : playerId);
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center min-h-[400px]">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-64 w-full rounded-lg" />
          <div className="flex space-x-2 justify-center">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>
      </div>
    );
  }

  // Enhanced mobile view with iOS-style cards
  const SimplifiedPassingView = () => {
    if (!players || players.length === 0) return null;

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
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Users className="h-5 w-5" />
            Player Network
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              triggerHaptic('selection');
              setShowSimplified(false);
            }}
            className="text-sm bg-white/10 backdrop-blur-sm"
          >
            Show Network
          </Button>
        </div>
        
        <div className="grid gap-3">
          {playerStats.slice(0, 8).map((player, index) => (
            <Card 
              key={player.id} 
              className="overflow-hidden bg-gradient-to-r from-card to-card/80 border-primary/20 transition-all duration-300 active:scale-95"
              onClick={() => triggerHaptic('light')}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, hsl(${index * 40}, 70%, 50%), hsl(${index * 40}, 70%, 40%))`
                      }}
                    >
                      {player.number || '?'}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{player.name}</p>
                      <p className="text-sm text-muted-foreground">{player.position || 'Unknown'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary">{player.totalPasses}</p>
                    <p className="text-sm text-muted-foreground">{player.connections} connections</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  if (isMobile && showSimplified) {
    return (
      <Card className="w-full bg-gradient-to-br from-background to-background/80">
        <CardContent className="p-4">
          <SimplifiedPassingView />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Mobile controls */}
      {isMobile && (
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              triggerHaptic('selection');
              setShowSimplified(true);
            }}
            className="text-sm bg-white/10 backdrop-blur-sm"
          >
            Stats View
          </Button>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              className="min-h-[44px] min-w-[44px] bg-white/10 backdrop-blur-sm"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              className="min-h-[44px] min-w-[44px] bg-white/10 backdrop-blur-sm"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      <ResponsivePitch 
        showZoomControls={!isMobile}
        aspectRatio={3/2}
        className="min-h-[300px] sm:min-h-[400px] bg-gradient-to-br from-background to-background/80 rounded-xl overflow-hidden"
      >
        <div 
          ref={containerRef}
          className="relative w-full h-full"
          style={{
            transform: `scale(${zoomLevel}) translate(${panPosition.x}px, ${panPosition.y}px)`,
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <FootballPitch width={1000} height={667}>
            {players && players.length > 0 ? (
              <>
                {/* Render passing connections with enhanced styling */}
                {connections.map((connection, idx) => {
                  const fromPlayer = players.find(p => p.id === connection.from);
                  const toPlayer = players.find(p => p.id === connection.to);
                  
                  if (!fromPlayer || !toPlayer) return null;
                  
                  const isHighlighted = selectedPlayer === connection.from || selectedPlayer === connection.to;
                  
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
                      color={isHighlighted ? '#D4AF37' : getEdgeColor(connection.count, connections)}
                      width={isHighlighted ? getEdgeWidth(connection.count, connections) + 2 : getEdgeWidth(connection.count, connections)}
                      count={connection.count}
                    />
                  );
                })}
                
                {/* Enhanced player nodes */}
                {players.map(player => (
                  <PlayerNode
                    key={`player-${player.id}`}
                    player={player}
                    x={player.x * 1000}
                    y={player.y * 667}
                    onSelect={() => handlePlayerSelect(player.id)}
                    isSelected={selectedPlayer === player.id}
                    isMobile={isMobile}
                  />
                ))}
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white bg-black/30 rounded-xl backdrop-blur-sm p-4">
                <div className="text-center space-y-2">
                  <p className="text-sm sm:text-base">
                    No player data available for this match
                  </p>
                </div>
              </div>
            )}
          </FootballPitch>
        </div>
      </ResponsivePitch>

      {/* Selected player details bottom sheet */}
      {selectedPlayer && isMobile && (
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            {(() => {
              const player = players?.find(p => p.id === selectedPlayer);
              const playerConnections = connections.filter(c => c.from === selectedPlayer || c.to === selectedPlayer);
              const totalPasses = playerConnections.reduce((sum, c) => sum + c.count, 0);
              
              return player ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{player.name}</h3>
                      <p className="text-muted-foreground">{player.position || 'Unknown'}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedPlayer(null)}
                      className="min-h-[44px] min-w-[44px]"
                    >
                      ✕
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-white/10 rounded-lg">
                      <p className="text-2xl font-bold text-primary">{totalPasses}</p>
                      <p className="text-sm text-muted-foreground">Total Passes</p>
                    </div>
                    <div className="text-center p-3 bg-white/10 rounded-lg">
                      <p className="text-2xl font-bold text-primary">{playerConnections.length}</p>
                      <p className="text-sm text-muted-foreground">Connections</p>
                    </div>
                  </div>
                </div>
              ) : null;
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
