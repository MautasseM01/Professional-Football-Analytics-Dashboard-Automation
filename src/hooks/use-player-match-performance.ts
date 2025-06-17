
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Player } from "@/types";
import { toast } from "sonner";

export interface PlayerMatchPerformance {
  id: number;
  match_id: number;
  goals: number;
  assists: number;
  shots_total: number;
  shots_on_target: number;
  passes_attempted: number;
  passes_completed: number;
  pass_accuracy: number;
  tackles_attempted: number;
  tackles_won: number;
  distance_covered: number;
  sprint_distance: number;
  max_speed: number;
  match_rating: number;
  minutes_played: number;
  opponent: string;
  match_date: string;
  result: string;
  touches: number;
  dribbles_successful: number;
  aerial_duels_won: number;
}

export const usePlayerMatchPerformance = (
  player?: Player | null, 
  matchId?: number,
  limit: number = 10
) => {
  const [performances, setPerformances] = useState<PlayerMatchPerformance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPerformances = useCallback(async () => {
    if (!player && !matchId) {
      setPerformances([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Fetching player match performances for player:', player?.id, 'match:', matchId);

      // Build query with proper joins
      let query = supabase
        .from("player_match_performance")
        .select(`
          *,
          matches!inner(
            id,
            date,
            opponent,
            result
          )
        `);

      // Apply filters
      if (player) {
        query = query.eq('player_id', player.id);
      }
      if (matchId) {
        query = query.eq('match_id', matchId);
      }

      const { data, error: queryError } = await query
        .order('id', { ascending: false })
        .limit(limit);

      if (queryError) {
        console.error("Error fetching player match performances:", queryError);
        throw new Error(`Failed to fetch match performances: ${queryError.message}`);
      }

      // Transform data safely
      const transformedPerformances: PlayerMatchPerformance[] = (data || []).map((perf: any) => ({
        id: perf.id,
        match_id: perf.match_id,
        goals: perf.goals || 0,
        assists: perf.assists || 0,
        shots_total: perf.shots_total || 0,
        shots_on_target: perf.shots_on_target || 0,
        passes_attempted: perf.passes_attempted || 0,
        passes_completed: perf.passes_completed || 0,
        pass_accuracy: perf.pass_accuracy || 0,
        tackles_attempted: perf.tackles_attempted || 0,
        tackles_won: perf.tackles_won || 0,
        distance_covered: perf.distance_covered || 0,
        sprint_distance: perf.sprint_distance || 0,
        max_speed: perf.max_speed || 0,
        match_rating: perf.match_rating || 0,
        minutes_played: perf.minutes_played || 0,
        touches: perf.touches || 0,
        dribbles_successful: perf.dribbles_successful || 0,
        aerial_duels_won: perf.aerial_duels_won || 0,
        opponent: perf.matches?.opponent || 'Unknown',
        match_date: perf.matches?.date || '',
        result: perf.matches?.result || 'N/A'
      }));

      setPerformances(transformedPerformances);
      console.log('Successfully loaded player match performances:', transformedPerformances.length);

    } catch (err: any) {
      console.error("Error fetching player match performances:", err);
      const errorMessage = err.message || 'Unknown error occurred';
      setError(errorMessage);
      setPerformances([]);
      toast.error(`Failed to load match performances: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [player?.id, matchId, limit]);

  useEffect(() => {
    fetchPerformances();
  }, [fetchPerformances]);

  const refetch = useCallback(() => {
    return fetchPerformances();
  }, [fetchPerformances]);

  return { performances, loading, error, refetch };
};
