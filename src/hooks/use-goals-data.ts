
import { useState, useEffect, useCallback } from "react";
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
  is_volley: boolean;
  assisted_by_player_id?: number;
  assisted_by_name?: string;
  match_name: string;
  match_date: string;
  difficulty_rating?: number;
  description?: string;
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

  const fetchGoalsData = useCallback(async () => {
    if (!player && !matchId) {
      setGoals([]);
      setAssists([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Fetching goals and assists data for player:', player?.id, 'match:', matchId);

      // Build goals query
      let goalsQuery = supabase
        .from("goals")
        .select('*');

      // Apply filters
      if (player) {
        goalsQuery = goalsQuery.eq('player_id', player.id);
      }
      if (matchId) {
        goalsQuery = goalsQuery.eq('match_id', matchId);
      }

      const { data: goalsData, error: goalsError } = await goalsQuery.order('created_at', { ascending: false });

      if (goalsError) {
        console.error("Error fetching goals:", goalsError);
        throw new Error(`Failed to fetch goals: ${goalsError.message}`);
      }

      // Build assists query
      let assistsQuery = supabase
        .from("assists")
        .select('*');

      // Apply filters
      if (player) {
        assistsQuery = assistsQuery.eq('player_id', player.id);
      }
      if (matchId) {
        assistsQuery = assistsQuery.eq('match_id', matchId);
      }

      const { data: assistsData, error: assistsError } = await assistsQuery.order('created_at', { ascending: false });

      if (assistsError) {
        console.error("Error fetching assists:", assistsError);
        throw new Error(`Failed to fetch assists: ${assistsError.message}`);
      }

      // Handle empty data gracefully
      const safeGoalsData = goalsData || [];
      const safeAssistsData = assistsData || [];

      console.log(`Found ${safeGoalsData.length} goals and ${safeAssistsData.length} assists`);

      // Fetch matches data for context only if we have goals or assists
      const uniqueMatchIds = [
        ...new Set([
          ...safeGoalsData.map(g => g.match_id),
          ...safeAssistsData.map(a => a.match_id)
        ])
      ];

      let matchesData: any[] = [];
      if (uniqueMatchIds.length > 0) {
        const { data: matches, error: matchesError } = await supabase
          .from("matches")
          .select('id, date, opponent, result')
          .in('id', uniqueMatchIds);

        if (matchesError) {
          console.error("Error fetching matches:", matchesError);
          // Don't throw here, just log the error and continue with empty matches
          matchesData = [];
        } else {
          matchesData = matches || [];
        }
      }

      // Fetch assist providers only if we have goals with assist providers
      const uniqueAssistProviderIds = safeGoalsData
        .filter(g => g.assisted_by_player_id)
        .map(g => g.assisted_by_player_id);

      let assistProvidersData: any[] = [];
      if (uniqueAssistProviderIds.length > 0) {
        const { data: assistProviders, error: assistProvidersError } = await supabase
          .from("players")
          .select('id, name')
          .in('id', uniqueAssistProviderIds);

        if (assistProvidersError) {
          console.error("Error fetching assist providers:", assistProvidersError);
          // Don't throw here, just log the error and continue with empty assist providers
          assistProvidersData = [];
        } else {
          assistProvidersData = assistProviders || [];
        }
      }

      // Transform goals data with safe defaults
      const transformedGoals: GoalData[] = safeGoalsData.map((goal: any) => {
        const match = matchesData.find(m => m.id === goal.match_id);
        const assistProvider = assistProvidersData.find(p => p.id === goal.assisted_by_player_id);

        return {
          id: goal.id,
          player_id: goal.player_id,
          match_id: goal.match_id,
          minute: goal.minute || 0,
          period: goal.period || 'First Half',
          goal_type: goal.goal_type || 'Open Play',
          distance_from_goal: goal.distance_from_goal,
          x_coordinate: goal.x_coordinate,
          y_coordinate: goal.y_coordinate,
          body_part: goal.body_part || 'Right Foot',
          is_header: goal.is_header || false,
          is_penalty: goal.is_penalty || false,
          is_free_kick: goal.is_free_kick || false,
          is_volley: goal.is_volley || false,
          assisted_by_player_id: goal.assisted_by_player_id,
          assisted_by_name: assistProvider?.name,
          match_name: match ? `vs ${match.opponent}` : 'Unknown Match',
          match_date: match?.date || '',
          difficulty_rating: goal.difficulty_rating,
          description: goal.description,
        };
      });

      // Transform assists data with safe defaults
      const transformedAssists: AssistData[] = safeAssistsData.map((assist: any) => {
        const match = matchesData.find(m => m.id === assist.match_id);

        return {
          id: assist.id,
          player_id: assist.player_id,
          match_id: assist.match_id,
          goal_id: assist.goal_id,
          assist_type: assist.assist_type || 'Pass',
          pass_type: assist.pass_type || 'Short Pass',
          distance_of_pass: assist.distance_of_pass,
          difficulty_rating: assist.difficulty_rating,
          match_name: match ? `vs ${match.opponent}` : 'Unknown Match',
          match_date: match?.date || '',
        };
      });

      setGoals(transformedGoals);
      setAssists(transformedAssists);

      console.log('Successfully loaded goals data:', transformedGoals.length);
      console.log('Successfully loaded assists data:', transformedAssists.length);

    } catch (err: any) {
      console.error("Error fetching goals/assists data:", err);
      const errorMessage = err.message || 'Unknown error occurred';
      setError(errorMessage);
      setGoals([]);
      setAssists([]);
      toast.error(`Failed to load goals/assists data: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [player?.id, matchId]);

  useEffect(() => {
    fetchGoalsData();
  }, [fetchGoalsData]);

  const refetch = useCallback(() => {
    return fetchGoalsData();
  }, [fetchGoalsData]);

  return { goals, assists, loading, error, refetch };
};
