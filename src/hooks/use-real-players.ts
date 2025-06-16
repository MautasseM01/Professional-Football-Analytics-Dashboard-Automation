
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Player } from "@/types";

export const useRealPlayers = () => {
  return useQuery({
    queryKey: ['real-players'],
    queryFn: async () => {
      console.log('Fetching real players from database');
      
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching players:', error);
        throw error;
      }
      
      console.log('Fetched players:', data);
      
      // Transform the data to match our Player interface
      const players: Player[] = data?.map(player => ({
        id: player.id,
        name: player.name || 'Unknown Player',
        position: player.position || 'N/A',
        matches: Number(player.matches) || 0,
        distance: Number(player.distance) || 0,
        passes_attempted: Number(player.passes_attempted) || 0,
        passes_completed: Number(player.passes_completed) || 0,
        shots_total: Number(player.shots_total) || 0,
        shots_on_target: Number(player.shots_on_target) || 0,
        tackles_attempted: Number(player.tackles_attempted) || 0,
        tackles_won: Number(player.tackles_won) || 0,
        heatmapUrl: player.heatmapUrl || '',
        reportUrl: player.reportUrl || '',
        maxSpeed: Number(player.maxSpeed) || 0,
        number: player.number || undefined,
        sprintDistance: Number(player.sprintDistance) || 0,
      })) || [];
      
      return players;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
