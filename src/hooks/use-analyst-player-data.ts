
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Player } from "@/types";
import { toast } from "sonner";

export interface AnalystPlayerData {
  playerAttributes: any;
  performanceHistory: any[];
  goalAnalysis: any[];
  assistAnalysis: any[];
  benchmarkComparisons: any;
  predictiveMetrics: any;
}

export interface TimeFilter {
  period: 'last5' | 'last10' | 'season' | 'custom';
  startDate?: string;
  endDate?: string;
}

export interface MatchTypeFilter {
  competition: 'all' | 'league' | 'cup';
  location: 'all' | 'home' | 'away';
}

export const useAnalystPlayerData = (player?: Player | null) => {
  const [data, setData] = useState<AnalystPlayerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>({ period: 'season' });
  const [matchTypeFilter, setMatchTypeFilter] = useState<MatchTypeFilter>({ 
    competition: 'all', 
    location: 'all' 
  });

  const fetchAnalystData = useCallback(async () => {
    if (!player) {
      setData(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Fetching comprehensive analyst data for player:', player.id);

      // Fetch player attributes
      const { data: attributes, error: attrError } = await supabase
        .from('player_attributes')
        .select('*')
        .eq('player_id', player.id)
        .maybeSingle();

      if (attrError) console.error('Attributes error:', attrError);

      // Fetch performance history with match context
      const { data: performanceHistory, error: perfError } = await supabase
        .from('player_match_performance')
        .select(`
          *,
          matches!inner(
            id, date, opponent, competition, location, result
          )
        `)
        .eq('player_id', player.id)
        .order('id', { ascending: false })
        .limit(25);

      if (perfError) console.error('Performance error:', perfError);

      // Fetch goal analysis
      const { data: goalAnalysis, error: goalError } = await supabase
        .from('goals')
        .select(`
          *,
          matches!inner(date, opponent, competition)
        `)
        .eq('player_id', player.id)
        .order('created_at', { ascending: false });

      if (goalError) console.error('Goals error:', goalError);

      // Fetch assist analysis
      const { data: assistAnalysis, error: assistError } = await supabase
        .from('assists')
        .select(`
          *,
          matches!inner(date, opponent, competition)
        `)
        .eq('player_id', player.id)
        .order('created_at', { ascending: false });

      if (assistError) console.error('Assists error:', assistError);

      // Fetch league benchmarks for position
      const { data: benchmarks, error: benchError } = await supabase
        .from('league_benchmarks')
        .select('*')
        .eq('position', player.position || 'All')
        .eq('season', '2024-25');

      if (benchError) console.error('Benchmarks error:', benchError);

      // Calculate predictive metrics
      const recentPerformance = (performanceHistory || []).slice(0, 5);
      const avgRating = recentPerformance.reduce((sum, p) => sum + (p.match_rating || 0), 0) / Math.max(recentPerformance.length, 1);
      const formTrend = calculateFormTrend(recentPerformance);
      
      const predictiveMetrics = {
        currentForm: avgRating,
        formTrend,
        injuryRisk: calculateInjuryRisk(performanceHistory || []),
        nextMatchProjection: calculateNextMatchProjection(recentPerformance),
        seasonProjection: calculateSeasonProjection(performanceHistory || [])
      };

      // Create benchmark comparisons
      const benchmarkComparisons = createBenchmarkComparisons(
        player,
        performanceHistory || [],
        benchmarks || []
      );

      const analystData: AnalystPlayerData = {
        playerAttributes: attributes,
        performanceHistory: performanceHistory || [],
        goalAnalysis: goalAnalysis || [],
        assistAnalysis: assistAnalysis || [],
        benchmarkComparisons,
        predictiveMetrics
      };

      setData(analystData);
      console.log('Analyst data loaded successfully');

    } catch (err: any) {
      console.error('Error fetching analyst data:', err);
      setError(err.message);
      toast.error(`Failed to load analyst data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [player?.id, timeFilter, matchTypeFilter]);

  useEffect(() => {
    fetchAnalystData();
  }, [fetchAnalystData]);

  return {
    data,
    loading,
    error,
    timeFilter,
    setTimeFilter,
    matchTypeFilter,
    setMatchTypeFilter,
    refetch: fetchAnalystData
  };
};

// Helper functions for calculations
const calculateFormTrend = (performances: any[]): 'improving' | 'declining' | 'stable' => {
  if (performances.length < 3) return 'stable';
  
  const recent = performances.slice(0, 3).map(p => p.match_rating || 0);
  const earlier = performances.slice(3, 6).map(p => p.match_rating || 0);
  
  const recentAvg = recent.reduce((sum, r) => sum + r, 0) / recent.length;
  const earlierAvg = earlier.reduce((sum, r) => sum + r, 0) / Math.max(earlier.length, 1);
  
  const diff = recentAvg - earlierAvg;
  if (diff > 0.5) return 'improving';
  if (diff < -0.5) return 'declining';
  return 'stable';
};

const calculateInjuryRisk = (performances: any[]): 'low' | 'medium' | 'high' => {
  const recentMatches = performances.slice(0, 10);
  const avgMinutes = recentMatches.reduce((sum, p) => sum + (p.minutes_played || 0), 0) / Math.max(recentMatches.length, 1);
  const highIntensityMatches = recentMatches.filter(p => (p.distance_covered || 0) > 10000).length;
  
  if (avgMinutes > 80 && highIntensityMatches > 7) return 'high';
  if (avgMinutes > 60 && highIntensityMatches > 4) return 'medium';
  return 'low';
};

const calculateNextMatchProjection = (recentPerformance: any[]) => {
  if (recentPerformance.length === 0) return { rating: 0, confidence: 0 };
  
  const weights = [0.4, 0.3, 0.2, 0.1]; // More weight on recent performances
  let weightedSum = 0;
  let totalWeight = 0;
  
  recentPerformance.slice(0, 4).forEach((perf, index) => {
    const weight = weights[index] || 0.05;
    weightedSum += (perf.match_rating || 0) * weight;
    totalWeight += weight;
  });
  
  const projectedRating = totalWeight > 0 ? weightedSum / totalWeight : 0;
  const confidence = Math.min(recentPerformance.length * 25, 100);
  
  return { rating: Number(projectedRating.toFixed(1)), confidence };
};

const calculateSeasonProjection = (allPerformances: any[]) => {
  if (allPerformances.length === 0) return { goals: 0, assists: 0, rating: 0 };
  
  const totalMatches = allPerformances.length;
  const totalGoals = allPerformances.reduce((sum, p) => sum + (p.goals || 0), 0);
  const totalAssists = allPerformances.reduce((sum, p) => sum + (p.assists || 0), 0);
  const avgRating = allPerformances.reduce((sum, p) => sum + (p.match_rating || 0), 0) / totalMatches;
  
  // Project to 38 matches (full season)
  const projectionMultiplier = 38 / Math.max(totalMatches, 1);
  
  return {
    goals: Math.round(totalGoals * projectionMultiplier),
    assists: Math.round(totalAssists * projectionMultiplier),
    rating: Number(avgRating.toFixed(1))
  };
};

const createBenchmarkComparisons = (player: Player, performances: any[], benchmarks: any[]) => {
  const playerStats = calculatePlayerSeasonStats(performances);
  
  return {
    goals: compareToBenchmark(playerStats.goals, benchmarks.find(b => b.metric_name === 'goals')),
    assists: compareToBenchmark(playerStats.assists, benchmarks.find(b => b.metric_name === 'assists')),
    rating: compareToBenchmark(playerStats.avgRating, benchmarks.find(b => b.metric_name === 'match_rating')),
    passAccuracy: compareToBenchmark(playerStats.passAccuracy, benchmarks.find(b => b.metric_name === 'pass_accuracy'))
  };
};

const calculatePlayerSeasonStats = (performances: any[]) => {
  if (performances.length === 0) return { goals: 0, assists: 0, avgRating: 0, passAccuracy: 0 };
  
  return {
    goals: performances.reduce((sum, p) => sum + (p.goals || 0), 0),
    assists: performances.reduce((sum, p) => sum + (p.assists || 0), 0),
    avgRating: performances.reduce((sum, p) => sum + (p.match_rating || 0), 0) / performances.length,
    passAccuracy: performances.reduce((sum, p) => sum + (p.pass_accuracy || 0), 0) / performances.length
  };
};

const compareToBenchmark = (value: number, benchmark: any) => {
  if (!benchmark) return { percentile: 0, status: 'no-data' as const };
  
  if (value >= (benchmark.top_10_percentile || 0)) return { percentile: 90, status: 'excellent' as const };
  if (value >= (benchmark.top_25_percentile || 0)) return { percentile: 75, status: 'above-average' as const };
  if (value >= (benchmark.league_average || 0)) return { percentile: 50, status: 'average' as const };
  return { percentile: 25, status: 'below-average' as const };
};
