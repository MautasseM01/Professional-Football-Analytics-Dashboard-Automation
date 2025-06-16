
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Player } from "@/types";
import { toast } from "sonner";

export interface PlayerMatchPerformance {
  id: number;
  player_id: number;
  match_id: number;
  // Basic performance
  minutes_played: number;
  goals: number;
  assists: number;
  shots_total: number;
  shots_on_target: number;
  // Passing
  passes_attempted: number;
  passes_completed: number;
  pass_accuracy: number;
  // Defending
  tackles_attempted: number;
  tackles_won: number;
  clearances: number;
  interceptions: number;
  // Physical
  distance_covered: number;
  sprint_distance: number;
  max_speed: number;
  // Aerial
  aerial_duels_attempted: number;
  aerial_duels_won: number;
  // Attacking
  dribbles_attempted: number;
  dribbles_successful: number;
  crosses_attempted: number;
  crosses_completed: number;
  corners_taken: number;
  // Positioning
  average_position_x?: number;
  average_position_y?: number;
  touches: number;
  possession_won: number;
  possession_lost: number;
  // Fouls and cards
  fouls_committed: number;
  fouls_suffered: number;
  yellow_cards: number;
  red_cards: number;
  // Match context
  match_rating: number;
  captain: boolean;
  player_of_match: boolean;
  substituted_in?: number;
  substituted_out?: number;
  // Match details
  match_date: string;
  opponent: string;
  match_result: string;
  competition: string;
  created_at: string;
  updated_at: string;
}

export const usePlayerMatchPerformance = (
  player?: Player | null, 
  matchId?: number, 
  limit?: number
) => {
  const [performances, setPerformances] = useState<PlayerMatchPerformance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      if (!player && !matchId) {
        setPerformances([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log('Fetching detailed player match performance data');

        // Build the query
        let query = supabase
          .from("player_match_performance")
          .select(`
            *,
            matches!inner (
              id,
              date,
              opponent,
              result,
              competition
            )
          `)
          .order('date', { foreignTable: 'matches', ascending: false });

        // Apply filters
        if (player) {
          query = query.eq('player_id', player.id);
        }
        if (matchId) {
          query = query.eq('match_id', matchId);
        }
        if (limit) {
          query = query.limit(limit);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) {
          console.error("Error fetching player match performance:", fetchError);
          throw fetchError;
        }

        // Transform the data
        const transformedPerformances: PlayerMatchPerformance[] = (data || []).map((perf: any) => ({
          id: perf.id,
          player_id: perf.player_id,
          match_id: perf.match_id,
          // Basic performance
          minutes_played: perf.minutes_played || 0,
          goals: perf.goals || 0,
          assists: perf.assists || 0,
          shots_total: perf.shots_total || 0,
          shots_on_target: perf.shots_on_target || 0,
          // Passing
          passes_attempted: perf.passes_attempted || 0,
          passes_completed: perf.passes_completed || 0,
          pass_accuracy: Number(perf.pass_accuracy) || 0,
          // Defending
          tackles_attempted: perf.tackles_attempted || 0,
          tackles_won: perf.tackles_won || 0,
          clearances: perf.clearances || 0,
          interceptions: perf.interceptions || 0,
          // Physical
          distance_covered: Number(perf.distance_covered) || 0,
          sprint_distance: Number(perf.sprint_distance) || 0,
          max_speed: Number(perf.max_speed) || 0,
          // Aerial
          aerial_duels_attempted: perf.aerial_duels_attempted || 0,
          aerial_duels_won: perf.aerial_duels_won || 0,
          // Attacking
          dribbles_attempted: perf.dribbles_attempted || 0,
          dribbles_successful: perf.dribbles_successful || 0,
          crosses_attempted: perf.crosses_attempted || 0,
          crosses_completed: perf.crosses_completed || 0,
          corners_taken: perf.corners_taken || 0,
          // Positioning
          average_position_x: perf.average_position_x,
          average_position_y: perf.average_position_y,
          touches: perf.touches || 0,
          possession_won: perf.possession_won || 0,
          possession_lost: perf.possession_lost || 0,
          // Fouls and cards
          fouls_committed: perf.fouls_committed || 0,
          fouls_suffered: perf.fouls_suffered || 0,
          yellow_cards: perf.yellow_cards || 0,
          red_cards: perf.red_cards || 0,
          // Match context
          match_rating: Number(perf.match_rating) || 0,
          captain: perf.captain || false,
          player_of_match: perf.player_of_match || false,
          substituted_in: perf.substituted_in,
          substituted_out: perf.substituted_out,
          // Match details
          match_date: perf.matches.date,
          opponent: perf.matches.opponent,
          match_result: perf.matches.result,
          competition: perf.matches.competition || 'League',
          created_at: perf.created_at,
          updated_at: perf.updated_at,
        }));

        setPerformances(transformedPerformances);
        console.log('Player match performance data:', transformedPerformances);

      } catch (err: any) {
        console.error("Error fetching player match performance:", err);
        setError(err.message);
        toast.error(`Failed to load match performance data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, [player?.id, matchId, limit]);

  return { performances, loading, error };
};
