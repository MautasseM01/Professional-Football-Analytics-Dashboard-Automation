
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import FootballPitch from "./FootballPitch";
import PlayerNode from "./PlayerNode";
import PassEdge from "./PassEdge";

interface PassingNetworkProps {
  matchId: number;
  passDirectionFilter: string;
  passOutcomeFilter: string;
}

export interface PlayerPosition {
  id: number;
  name: string;
  number: number;
  position: string;
  x: number;
  y: number;
  totalPasses: number;
}

export interface PassConnection {
  from: number;
  to: number;
  count: number;
  direction: 'forward' | 'backward' | 'sideways';
  outcome: 'successful' | 'unsuccessful';
}

export const PassingNetwork = ({
  matchId,
  passDirectionFilter,
  passOutcomeFilter
}: PassingNetworkProps) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useState<HTMLDivElement | null>(null);

  // Query player positions and passing data
  const { data: networkData, isLoading } = useQuery({
    queryKey: ["passing-network", matchId],
    queryFn: async () => {
      // First get player positions
      const { data: positions, error: positionsError } = await supabase
        .from("player_match_positions")
        .select("*, player:players(id, name, number, position)")
        .eq("match_id", matchId);
      
      if (positionsError) {
        toast.error("Failed to load player positions");
        throw positionsError;
      }
      
      // Then get passing data
      const { data: passes, error: passesError } = await supabase
        .from("match_passes")
        .select("*")
        .eq("match_id", matchId);
      
      if (passesError) {
        toast.error("Failed to load passing data");
        throw passesError;
      }
      
      // Transform position data
      const playerPositions: PlayerPosition[] = positions.map((pos: any) => {
        const passesByPlayer = passes.filter((pass: any) => 
          pass.from_player_id === pos.player_id
        );
        
        return {
          id: pos.player_id,
          name: pos.player.name,
          number: pos.player.number,
          position: pos.player.position,
          x: pos.avg_x_position,
          y: pos.avg_y_position,
          totalPasses: passesByPlayer.length
        };
      });
      
      // Calculate pass connections
      const connections: PassConnection[] = [];
      passes.forEach((pass: any) => {
        const existingConnection = connections.find(
          c => c.from === pass.from_player_id && c.to === pass.to_player_id
        );
        
        if (existingConnection) {
          existingConnection.count++;
        } else {
          connections.push({
            from: pass.from_player_id,
            to: pass.to_player_id,
            count: 1,
            direction: pass.direction,
            outcome: pass.outcome
          });
        }
      });
      
      return {
        players: playerPositions,
        connections
      };
    },
    enabled: !!matchId
  });

  // Filter connections based on user selection
  const filteredConnections = useMemo(() => {
    if (!networkData) return [];
    
    return networkData.connections.filter(conn => {
      const directionMatch = passDirectionFilter === 'all' || conn.direction === passDirectionFilter;
      const outcomeMatch = passOutcomeFilter === 'all' || conn.outcome === passOutcomeFilter;
      return directionMatch && outcomeMatch;
    });
  }, [networkData, passDirectionFilter, passOutcomeFilter]);

  // Calculate a color based on pass count
  const getEdgeColor = (count: number): string => {
    const maxCount = Math.max(...filteredConnections.map(c => c.count));
    const intensity = Math.min(0.2 + (count / maxCount) * 0.8, 1);
    return `rgba(212, 175, 55, ${intensity})`; // Gold color with varying opacity
  };

  // Calculate edge width based on pass count
  const getEdgeWidth = (count: number): number => {
    const maxCount = Math.max(...filteredConnections.map(c => c.count));
    return 1 + (count / maxCount) * 4;
  };

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
  }, [containerRef]);

  return (
    <div className="w-full h-full relative" ref={node => containerRef[1](node)}>
      <LoadingOverlay isLoading={isLoading} />
      
      <FootballPitch width={dimensions.width} height={dimensions.height}>
        {networkData && (
          <>
            {/* Render passing connections (edges) first so they appear behind nodes */}
            {filteredConnections.map((connection, idx) => {
              const fromPlayer = networkData.players.find(p => p.id === connection.from);
              const toPlayer = networkData.players.find(p => p.id === connection.to);
              
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
                  color={getEdgeColor(connection.count)}
                  width={getEdgeWidth(connection.count)}
                  count={connection.count}
                />
              );
            })}
            
            {/* Render player nodes */}
            {networkData.players.map(player => (
              <PlayerNode
                key={`player-${player.id}`}
                player={player}
                x={player.x * dimensions.width}
                y={player.y * dimensions.height}
              />
            ))}
          </>
        )}
      </FootballPitch>
    </div>
  );
};
