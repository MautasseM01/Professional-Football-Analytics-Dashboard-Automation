
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
        distance_covered: Number(player.distance_covered) || 0,
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
        goals: Number(player.goals) || 0,
        assists: Number(player.assists) || 0,
        match_rating: Number(player.match_rating) || 0,
        pass_accuracy: Number(player.pass_accuracy) || 0,
        minutes_played: Number(player.minutes_played) || 0,
        last_match_date: player.last_match_date || undefined,
        aerial_duels_won: Number(player.aerial_duels_won) || 0,
        aerial_duels_attempted: Number(player.aerial_duels_attempted) || 0,
        clearances: Number(player.clearances) || 0,
        interceptions: Number(player.interceptions) || 0,
        dribbles_successful: Number(player.dribbles_successful) || 0,
        dribbles_attempted: Number(player.dribbles_attempted) || 0,
        crosses_completed: Number(player.crosses_completed) || 0,
        crosses_attempted: Number(player.crosses_attempted) || 0,
        corners_taken: Number(player.corners_taken) || 0,
        fouls_suffered: Number(player.fouls_suffered) || 0,
        fouls_committed: Number(player.fouls_committed) || 0,
        clean_sheets: Number(player.clean_sheets) || 0,
        saves: Number(player.saves) || 0,
        season: player.season || '2024-25',
        touches: Number(player.touches) || 0,
        possession_won: Number(player.possession_won) || 0,
        possession_lost: Number(player.possession_lost) || 0,
      })) || [];
      
      return players;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
