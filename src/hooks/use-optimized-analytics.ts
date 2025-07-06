
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useMemo } from "react";

export interface OptimizedAnalyticsData {
  totalDataPoints: number;
  metricsTracked: number;
  playerCount: number;
  matchCount: number;
  goalCount: number;
  assistCount: number;
  avgMatchRating: number;
  recentActivity: any[];
}

export interface PaginatedAnalyticsConfig {
  pageSize: number;
  enabled: boolean;
  staleTime: number;
}

const DEFAULT_CONFIG: PaginatedAnalyticsConfig = {
  pageSize: 50,
  enabled: true,
  staleTime: 5 * 60 * 1000, // 5 minutes
};

// Optimized analytics hook with caching and progressive loading
export const useOptimizedAnalytics = (config: Partial<PaginatedAnalyticsConfig> = {}) => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  return useQuery({
    queryKey: ['optimized-analytics'],
    queryFn: async (): Promise<OptimizedAnalyticsData> => {
      console.log('Fetching optimized analytics data');
      
      // Use Promise.allSettled to prevent one failed query from breaking everything
      const [
        playersResult,
        matchesResult,
        goalsResult,
        assistsResult,
        performanceResult,
        ratingsResult
      ] = await Promise.allSettled([
        supabase.from('players').select('*', { count: 'exact', head: true }).eq('season', '2024-25'),
        supabase.from('matches').select('*', { count: 'exact', head: true }).limit(1),
        supabase.from('goals').select('*', { count: 'exact', head: true }).limit(1),
        supabase.from('assists').select('*', { count: 'exact', head: true }).limit(1),
        supabase.from('player_match_performance').select('*', { count: 'exact', head: true }).limit(1),
        supabase.from('match_ratings').select('overall_performance').not('overall_performance', 'is', null)
      ]);

      // Process results safely
      const playerCount = playersResult.status === 'fulfilled' ? playersResult.value.count || 0 : 0;
      const matchCount = matchesResult.status === 'fulfilled' ? matchesResult.value.count || 0 : 0;
      const goalCount = goalsResult.status === 'fulfilled' ? goalsResult.value.count || 0 : 0;
      const assistCount = assistsResult.status === 'fulfilled' ? assistsResult.value.count || 0 : 0;
      const performanceRecords = performanceResult.status === 'fulfilled' ? performanceResult.value.count || 0 : 0;
      
      let avgRating = 0;
      if (ratingsResult.status === 'fulfilled' && ratingsResult.value.data && ratingsResult.value.data.length > 0) {
        avgRating = ratingsResult.value.data.reduce((sum, record) => sum + (Number(record.overall_performance) || 0), 0) / ratingsResult.value.data.length;
      }

      // Calculate metrics - updated to reflect new database structure
      const totalDataPoints = performanceRecords * 50; // Updated to include new fields (touches, possession_won, etc.)
      const metricsTracked = 50; // Updated count including new fields
      
      return {
        totalDataPoints,
        metricsTracked,
        playerCount,
        matchCount,
        goalCount,
        assistCount,
        avgMatchRating: Number(avgRating.toFixed(1)),
        recentActivity: []
      };
    },
    staleTime: finalConfig.staleTime,
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};

// Hook for paginated players with optimized performance
export const usePaginatedPlayers = (searchTerm: string = '', pageSize: number = 50) => {
  return useInfiniteQuery({
    queryKey: ['paginated-players', searchTerm],
    queryFn: async ({ pageParam = 0 }) => {
      let query = supabase
        .from('players')
        .select(`
          id, name, position, number, goals, assists, match_rating,
          distance_covered, passes_completed, tackles_won, 
          dribbles_successful, minutes_played, matches
        `)
        .eq('season', '2024-25')
        .order('match_rating', { ascending: false, nullsFirst: false })
        .range(pageParam * pageSize, (pageParam + 1) * pageSize - 1);

      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      return {
        data: data || [],
        nextPage: data && data.length === pageSize ? pageParam + 1 : undefined,
        hasMore: data && data.length === pageSize
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    initialPageParam: 0,
  });
};

// Hook for optimized matches data
export const useOptimizedMatches = (limit: number = 10) => {
  return useQuery({
    queryKey: ['optimized-matches', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('matches')
        .select('id, date, opponent, result, competition')
        .order('date', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data?.map(match => ({
        id: match.id,
        opponent: match.opponent,
        result: match.result,
        date: new Date(match.date).toLocaleDateString(),
        competition: match.competition
      })) || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Debounced search hook
export const useDebouncedSearch = (value: string, delay: number = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
