
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface MatchRating {
  id: number;
  match_id: number;
  overall_performance: number;
  attacking_rating: number;
  defensive_rating: number;
  possession_rating: number;
  set_pieces_rating: number;
  goalkeeper_rating: number;
  team_cohesion: number;
  tactical_execution: number;
  physical_performance: number;
  mental_strength: number;
  coach_rating: number;
  match_importance: number;
  opponent_difficulty: number;
  weather_impact: number;
  referee_impact: number;
  crowd_impact: number;
  man_of_match_player_id?: number;
  worst_performer_player_id?: number;
  man_of_match_name?: string;
  worst_performer_name?: string;
  analyst_comments?: string;
  notes?: string;
  match_date: string;
  opponent: string;
  result: string;
  created_at: string;
  updated_at: string;
}

export const useMatchRatings = (matchId?: number, limit?: number) => {
  const [ratings, setRatings] = useState<MatchRating[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatchRatings = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log('Fetching match ratings data');

        // Build the query
        let query = supabase
          .from("match_ratings")
          .select(`
            *,
            matches!inner (
              id,
              date,
              opponent,
              result
            ),
            man_of_match:players!match_ratings_man_of_match_player_id_fkey (
              name
            ),
            worst_performer:players!match_ratings_worst_performer_player_id_fkey (
              name
            )
          `)
          .order('matches.date', { ascending: false });

        // Apply filters
        if (matchId) {
          query = query.eq('match_id', matchId);
        }
        if (limit) {
          query = query.limit(limit);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) {
          console.error("Error fetching match ratings:", fetchError);
          throw fetchError;
        }

        // Transform the data
        const transformedRatings: MatchRating[] = (data || []).map((rating: any) => ({
          id: rating.id,
          match_id: rating.match_id,
          overall_performance: Number(rating.overall_performance) || 0,
          attacking_rating: Number(rating.attacking_rating) || 0,
          defensive_rating: Number(rating.defensive_rating) || 0,
          possession_rating: Number(rating.possession_rating) || 0,
          set_pieces_rating: Number(rating.set_pieces_rating) || 0,
          goalkeeper_rating: Number(rating.goalkeeper_rating) || 0,
          team_cohesion: Number(rating.team_cohesion) || 0,
          tactical_execution: Number(rating.tactical_execution) || 0,
          physical_performance: Number(rating.physical_performance) || 0,
          mental_strength: Number(rating.mental_strength) || 0,
          coach_rating: Number(rating.coach_rating) || 0,
          match_importance: Number(rating.match_importance) || 5,
          opponent_difficulty: Number(rating.opponent_difficulty) || 5,
          weather_impact: Number(rating.weather_impact) || 0,
          referee_impact: Number(rating.referee_impact) || 0,
          crowd_impact: Number(rating.crowd_impact) || 0,
          man_of_match_player_id: rating.man_of_match_player_id,
          worst_performer_player_id: rating.worst_performer_player_id,
          man_of_match_name: rating.man_of_match?.name,
          worst_performer_name: rating.worst_performer?.name,
          analyst_comments: rating.analyst_comments,
          notes: rating.notes,
          match_date: rating.matches.date,
          opponent: rating.matches.opponent,
          result: rating.matches.result,
          created_at: rating.created_at,
          updated_at: rating.updated_at,
        }));

        setRatings(transformedRatings);
        console.log('Match ratings data:', transformedRatings);

      } catch (err: any) {
        console.error("Error fetching match ratings:", err);
        setError(err.message);
        toast.error(`Failed to load match ratings: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchRatings();
  }, [matchId, limit]);

  return { ratings, loading, error };
};
