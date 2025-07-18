
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

        // First, get the match ratings with basic match info
        let query = supabase
          .from("match_ratings")
          .select(`
            *,
            matches!inner (
              id,
              date,
              opponent,
              result
            )
          `)
          .order('created_at', { ascending: false });

        // Apply filters
        if (matchId) {
          query = query.eq('match_id', matchId);
        }
        if (limit && limit < 50) {
          query = query.limit(limit);
        }

        const { data: ratingsData, error: fetchError } = await query;

        if (fetchError) {
          console.error("Error fetching match ratings:", fetchError);
          throw fetchError;
        }

        if (!ratingsData || ratingsData.length === 0) {
          setRatings([]);
          console.log('No match ratings found');
          return;
        }

        // Now fetch player names separately to avoid relationship issues
        const playerIds = [
          ...ratingsData.map(r => r.man_of_match_player_id).filter(Boolean),
          ...ratingsData.map(r => r.worst_performer_player_id).filter(Boolean)
        ];

        let playersMap: Record<number, string> = {};
        
        if (playerIds.length > 0) {
          const { data: playersData, error: playersError } = await supabase
            .from("players")
            .select("id, name")
            .in('id', playerIds);

          if (!playersError && playersData) {
            playersMap = playersData.reduce((acc, player) => {
              acc[player.id] = player.name || 'Unknown Player';
              return acc;
            }, {} as Record<number, string>);
          }
        }

        // Transform the data
        const transformedRatings: MatchRating[] = ratingsData.map((rating: any) => ({
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
          man_of_match_name: rating.man_of_match_player_id ? playersMap[rating.man_of_match_player_id] : undefined,
          worst_performer_name: rating.worst_performer_player_id ? playersMap[rating.worst_performer_player_id] : undefined,
          analyst_comments: rating.analyst_comments,
          notes: rating.notes,
          match_date: rating.matches.date,
          opponent: rating.matches.opponent,
          result: rating.matches.result,
          created_at: rating.created_at,
          updated_at: rating.updated_at,
        }));

        // Sort by match date descending
        transformedRatings.sort((a, b) => new Date(b.match_date).getTime() - new Date(a.match_date).getTime());

        setRatings(transformedRatings);
        console.log('Match ratings data loaded successfully:', transformedRatings.length, 'records');

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
