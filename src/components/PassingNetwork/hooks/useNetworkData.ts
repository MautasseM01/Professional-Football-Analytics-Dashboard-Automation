
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PlayerPosition, PassConnection } from "../types";

interface UseNetworkDataProps {
  matchId: number;
  passDirectionFilter: string;
  passOutcomeFilter: string;
}

interface NetworkData {
  players: PlayerPosition[];
  connections: PassConnection[];
}

export const useNetworkData = ({ 
  matchId, 
  passDirectionFilter, 
  passOutcomeFilter 
}: UseNetworkDataProps) => {
  const { data: networkData, isLoading } = useQuery({
    queryKey: ["passing-network", matchId],
    queryFn: async () => {
      try {
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
            name: pos.player?.name || "Unknown",
            number: pos.player?.number || 0,
            position: pos.player?.position || "Unknown",
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
              direction: pass.direction as 'forward' | 'backward' | 'sideways',
              outcome: pass.outcome as 'successful' | 'unsuccessful'
            });
          }
        });
        
        return {
          players: playerPositions,
          connections
        };
      } catch (error) {
        console.error("Error fetching network data:", error);
        return { players: [], connections: [] };
      }
    },
    enabled: !!matchId
  });

  // Filter connections based on user selection
  const filteredConnections = networkData?.connections.filter(conn => {
    const directionMatch = passDirectionFilter === 'all' || conn.direction === passDirectionFilter;
    const outcomeMatch = passOutcomeFilter === 'all' || conn.outcome === passOutcomeFilter;
    return directionMatch && outcomeMatch;
  }) || [];

  return {
    players: networkData?.players || [],
    connections: filteredConnections,
    isLoading
  };
};
