
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
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
        supabase.from('match_ratings').select('overall_performance').not('overall_performance', 'is', null).limit(100)
      ]);

      // Extract counts safely
      const playerCount = playersResult.status === 'fulfilled' ? playersResult.value.count || 0 : 0;
      const matchCount = matchesResult.status === 'fulfilled' ? matchesResult.value.count || 0 : 0;
      const goalCount = goalsResult.status === 'fulfilled' ? goalsResult.value.count || 0 : 0;
      const assistCount = assistsResult.status === 'fulfilled' ? assistsResult.value.count || 0 : 0;
      const performanceRecords = performanceResult.status === 'fulfilled' ? performanceResult.value.count || 0 : 0;

      // Calculate average rating safely
      let avgRating = 0;
      if (ratingsResult.status === 'fulfilled' && ratingsResult.value.data) {
        const ratings = ratingsResult.value.data.filter(r => r.overall_performance);
        avgRating = ratings.length > 0 
          ? ratings.reduce((sum, r) => sum + Number(r.overall_performance), 0) / ratings.length 
          : 0;
      }

      const totalDataPoints = performanceRecords * 47; // 47 metrics per record
      const metricsTracked = 47;

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
    enabled: finalConfig.enabled,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Paginated player data with infinite scrolling
export const usePaginatedPlayers = (searchTerm: string = '', pageSize: number = 20) => {
  return useInfiniteQuery({
    queryKey: ['paginated-players', searchTerm],
    queryFn: async ({ pageParam = 0 }) => {
      console.log(`Fetching players page ${pageParam} with search: ${searchTerm}`);
      
      let query = supabase
        .from('players')
        .select(`
          id, name, position, number, goals, assists, 
          match_rating, matches, season
        `)
        .eq('season', '2024-25')
        .order('match_rating', { ascending: false })
        .range(pageParam * pageSize, (pageParam + 1) * pageSize - 1);

      if (searchTerm.trim()) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      const { data, error, count } = await query;
      
      if (error) throw error;

      return {
        data: data || [],
        nextPage: data && data.length === pageSize ? pageParam + 1 : undefined,
        hasMore: data ? data.length === pageSize : false,
        totalCount: count || 0
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 2 * 60 * 1000, // 2 minutes for player data
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    initialPageParam: 0,
  });
};

// Optimized match data with smart pagination
export const useOptimizedMatches = (limit: number = 10) => {
  return useQuery({
    queryKey: ['optimized-matches', limit],
    queryFn: async () => {
      console.log(`Fetching ${limit} recent matches`);
      
      const { data, error } = await supabase
        .from('matches')
        .select(`
          id, date, opponent, result, competition,
          home_score, away_score, location
        `)
        .order('date', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    },
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Memory-efficient performance data hook
export const usePerformanceMetrics = (playerId?: number) => {
  return useQuery({
    queryKey: ['performance-metrics', playerId],
    queryFn: async () => {
      if (!playerId) return null;
      
      console.log(`Fetching performance metrics for player ${playerId}`);
      
      const { data, error } = await supabase
        .from('player_match_performance')
        .select(`
          id, match_rating, goals, assists, minutes_played,
          passes_completed, passes_attempted, distance_covered,
          matches!inner(date, opponent)
        `)
        .eq('player_id', playerId)
        .order('id', { ascending: false })
        .limit(20); // Limit to prevent memory issues

      if (error) throw error;
      return data || [];
    },
    enabled: !!playerId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Debounced search hook
export const useDebouncedSearch = (searchTerm: string, delay: number = 300) => {
  return useMemo(() => {
    const timeoutId = setTimeout(() => searchTerm, delay);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, delay]);
};
