
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Player } from "@/types";
import { toast } from "sonner";

export interface GoalData {
  id: number;
  player_id: number;
  match_id: number;
  minute: number;
  period: string;
  goal_type: string;
  distance_from_goal?: number;
  x_coordinate?: number;
  y_coordinate?: number;
  body_part: string;
  is_header: boolean;
  is_penalty: boolean;
  is_free_kick: boolean;
  assisted_by_player_id?: number;
  assisted_by_name?: string;
  match_name: string;
  match_date: string;
  difficulty_rating?: number;
}

export interface AssistData {
  id: number;
  player_id: number;
  match_id: number;
  goal_id: number;
  assist_type: string;
  pass_type: string;
  distance_of_pass?: number;
  difficulty_rating?: number;
  match_name: string;
  match_date: string;
}

export const useGoalsData = (player?: Player | null, matchId?: number) => {
  const [goals, setGoals] = useState<GoalData[]>([]);
  const [assists, setAssists] = useState<AssistData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGoalsData = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log('Fetching goals and assists data');

        // Build goals query
        let goalsQuery = supabase
          .from("goals")
          .select(`
            *,
            matches!inner (
              id,
              date,
              opponent
            ),
            players!goals_assisted_by_player_id_fkey (
              name
            )
          `)
          .order('matches.date', { ascending: false });

        // Apply filters
        if (player) {
          goalsQuery = goalsQuery.eq('player_id', player.id);
        }
        if (matchId) {
          goalsQuery = goalsQuery.eq('match_id', matchId);
        }

        const { data: goalsData, error: goalsError } = await goalsQuery;

        if (goalsError) {
          console.error("Error fetching goals:", goalsError);
          throw goalsError;
        }

        // Build assists query
        let assistsQuery = supabase
          .from("assists")
          .select(`
            *,
            matches!inner (
              id,
              date,
              opponent
            )
          `)
          .order('matches.date', { ascending: false });

        // Apply filters
        if (player) {
          assistsQuery = assistsQuery.eq('player_id', player.id);
        }
        if (matchId) {
          assistsQuery = assistsQuery.eq('match_id', matchId);
        }

        const { data: assistsData, error: assistsError } = await assistsQuery;

        if (assistsError) {
          console.error("Error fetching assists:", assistsError);
          throw assistsError;
        }

        // Transform goals data
        const transformedGoals: GoalData[] = (goalsData || []).map((goal: any) => ({
          id: goal.id,
          player_id: goal.player_id,
          match_id: goal.match_id,
          minute: goal.minute,
          period: goal.period || 'First Half',
          goal_type: goal.goal_type || 'Open Play',
          distance_from_goal: goal.distance_from_goal,
          x_coordinate: goal.x_coordinate,
          y_coordinate: goal.y_coordinate,
          body_part: goal.body_part || 'Right Foot',
          is_header: goal.is_header || false,
          is_penalty: goal.is_penalty || false,
          is_free_kick: goal.is_free_kick || false,
          assisted_by_player_id: goal.assisted_by_player_id,
          assisted_by_name: goal.players?.name,
          match_name: `vs ${goal.matches.opponent}`,
          match_date: goal.matches.date,
          difficulty_rating: goal.difficulty_rating,
        }));

        // Transform assists data
        const transformedAssists: AssistData[] = (assistsData || []).map((assist: any) => ({
          id: assist.id,
          player_id: assist.player_id,
          match_id: assist.match_id,
          goal_id: assist.goal_id,
          assist_type: assist.assist_type || 'Pass',
          pass_type: assist.pass_type || 'Short Pass',
          distance_of_pass: assist.distance_of_pass,
          difficulty_rating: assist.difficulty_rating,
          match_name: `vs ${assist.matches.opponent}`,
          match_date: assist.matches.date,
        }));

        setGoals(transformedGoals);
        setAssists(transformedAssists);

        console.log('Goals data:', transformedGoals);
        console.log('Assists data:', transformedAssists);

      } catch (err: any) {
        console.error("Error fetching goals/assists data:", err);
        setError(err.message);
        toast.error(`Failed to load goals/assists data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchGoalsData();
  }, [player?.id, matchId]);

  return { goals, assists, loading, error };
};
