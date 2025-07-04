import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Player } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const usePlayerProfile = () => {
  const [playerProfile, setPlayerProfile] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, profile } = useAuth();

  const fetchPlayerProfile = useCallback(async () => {
    if (!profile || profile.role !== 'player') {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching player profile for:", profile.full_name);
      
      // For demo purposes, find player by name match
      // In production, this would use a proper user_id mapping
      let { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('season', '2024-25')
        .ilike('name', `%${profile.full_name || ''}%`)
        .single();

      if (error) {
        // If no exact match found, get the first player for demo
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('players')
          .select('*')
          .eq('season', '2024-25')
          .limit(1)
          .single();

        if (fallbackError) {
          throw fallbackError;
        }
        
        console.log("Using fallback player data for demo:", fallbackData);
        data = fallbackData;
      }

      if (!data) {
        throw new Error("No player profile found");
      }

      // Transform the data to match our Player interface
      const transformedPlayer: Player = {
        id: data.id,
        name: data.name || 'Unknown Player',
        position: data.position || 'N/A',
        number: data.number || undefined,
        matches: Number(data.matches) || 0,
        distance_covered: Number(data.distance_covered) || 0,
        passes_attempted: Number(data.passes_attempted) || 0,
        passes_completed: Number(data.passes_completed) || 0,
        shots_total: Number(data.shots_total) || 0,
        shots_on_target: Number(data.shots_on_target) || 0,
        tackles_attempted: Number(data.tackles_attempted) || 0,
        tackles_won: Number(data.tackles_won) || 0,
        heatmapUrl: data.heatmapUrl || '',
        reportUrl: data.reportUrl || '',
        maxSpeed: Number(data.maxSpeed) || 0,
        sprintDistance: Number(data.sprintDistance) || 0,
        goals: Number(data.goals) || 0,
        assists: Number(data.assists) || 0,
        match_rating: Number(data.match_rating) || 0,
        pass_accuracy: Number(data.pass_accuracy) || 0,
        minutes_played: Number(data.minutes_played) || 0,
        last_match_date: data.last_match_date || undefined,
        aerial_duels_won: Number(data.aerial_duels_won) || 0,
        aerial_duels_attempted: Number(data.aerial_duels_attempted) || 0,
        clearances: Number(data.clearances) || 0,
        interceptions: Number(data.interceptions) || 0,
        dribbles_successful: Number(data.dribbles_successful) || 0,
        dribbles_attempted: Number(data.dribbles_attempted) || 0,
        crosses_completed: Number(data.crosses_completed) || 0,
        crosses_attempted: Number(data.crosses_attempted) || 0,
        corners_taken: Number(data.corners_taken) || 0,
        fouls_suffered: Number(data.fouls_suffered) || 0,
        fouls_committed: Number(data.fouls_committed) || 0,
        clean_sheets: Number(data.clean_sheets) || 0,
        saves: Number(data.saves) || 0,
        season: data.season || '2024-25',
        touches: 0,
        possession_won: 0,
        possession_lost: 0,
      };

      console.log("Player profile loaded:", transformedPlayer);
      setPlayerProfile(transformedPlayer);

    } catch (err: any) {
      console.error("Error fetching player profile:", err);
      setError(err.message);
      toast.error(`Failed to load your profile: ${err.message}`);
      setPlayerProfile(null);
    } finally {
      setLoading(false);
    }
  }, [profile]);

  const refreshProfile = useCallback(() => {
    console.log("Refreshing player profile");
    fetchPlayerProfile();
  }, [fetchPlayerProfile]);

  useEffect(() => {
    fetchPlayerProfile();
  }, [fetchPlayerProfile]);

  return {
    playerProfile,
    loading,
    error,
    refreshProfile
  };
};