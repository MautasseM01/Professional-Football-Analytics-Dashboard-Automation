
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PerformanceBenchmarkData {
  leaguePercentile: number;
  leagueRanking: number;
  trendDirection: 'up' | 'down' | 'stable';
  kpiStatuses: {
    aboveAverage: number;
    average: number;
    belowAverage: number;
  };
}

export const usePerformanceBenchmarks = () => {
  return useQuery({
    queryKey: ['performance-benchmarks'],
    queryFn: async (): Promise<PerformanceBenchmarkData> => {
      console.log('Fetching performance benchmarks data');
      
      const { data, error } = await supabase
        .from('performance_kpis')
        .select('status, league_percentile')
        .not('league_percentile', 'is', null);
      
      if (error) {
        console.error('Error fetching performance benchmarks:', error);
        throw error;
      }
      
      const kpiStatuses = data?.reduce((acc, kpi) => {
        acc[kpi.status as keyof typeof acc] = (acc[kpi.status as keyof typeof acc] || 0) + 1;
        return acc;
      }, { above_average: 0, average: 0, below_average: 0 }) || { above_average: 0, average: 0, below_average: 0 };
      
      const avgPercentile = data?.length > 0 
        ? data.reduce((sum, kpi) => sum + (kpi.league_percentile || 0), 0) / data.length
        : 78;
      
      return {
        leaguePercentile: Math.round(avgPercentile),
        leagueRanking: avgPercentile > 75 ? 3 : avgPercentile > 50 ? 8 : 15,
        trendDirection: avgPercentile > 75 ? 'up' : 'stable',
        kpiStatuses: {
          aboveAverage: kpiStatuses.above_average,
          average: kpiStatuses.average,
          belowAverage: kpiStatuses.below_average
        }
      };
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
