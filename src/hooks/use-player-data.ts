
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Player } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const usePlayerData = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, profile } = useAuth();

  const fetchPlayers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching players from database...");
      
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('season', '2024-25')
        .order('name');

      if (error) {
        console.error("Error fetching players:", error);
        throw error;
      }

      console.log("Raw players data:", data);

      if (!data || data.length === 0) {
        console.warn("No players found in database");
        setPlayers([]);
        return;
      }

      // Transform the data to match our Player interface
      const transformedPlayers: Player[] = data.map(player => ({
        id: player.id,
        name: player.name || 'Unknown Player',
        position: player.position || 'N/A',
        number: player.number || undefined,
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
        touches: 0, // Default value since field doesn't exist yet
        possession_won: 0, // Default value since field doesn't exist yet
        possession_lost: 0, // Default value since field doesn't exist yet
      }));

      console.log("Transformed players:", transformedPlayers);
      setPlayers(transformedPlayers);

      // Auto-select first player for certain roles or if no selection exists
      if (transformedPlayers.length > 0 && !selectedPlayer) {
        if (profile?.role === 'player') {
          // For player role, try to find their own data
          const playerData = transformedPlayers.find(p => 
            p.name.toLowerCase().includes((profile.full_name || '').toLowerCase())
          );
          setSelectedPlayer(playerData || transformedPlayers[0]);
        } else {
          setSelectedPlayer(transformedPlayers[0]);
        }
      }

    } catch (err: any) {
      console.error("Error in fetchPlayers:", err);
      setError(err.message);
      toast.error(`Failed to load player data: ${err.message}`);
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  }, [selectedPlayer, profile]);

  const refreshData = useCallback(() => {
    console.log("Manual refresh triggered");
    fetchPlayers();
  }, [fetchPlayers]);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  const selectPlayer = (player: Player) => {
    console.log("Selected player:", player);
    setSelectedPlayer(player);
  };

  // Role-based access control
  const canAccessPlayerData = profile?.role !== 'unassigned';

  return {
    players,
    selectedPlayer,
    selectPlayer,
    loading,
    error,
    canAccessPlayerData,
    refreshData
  };
};
