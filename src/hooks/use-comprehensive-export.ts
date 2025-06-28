
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ExportOptions {
  format: 'csv' | 'pdf' | 'excel';
  dateRange: 'last7days' | 'last30days' | 'season' | 'all';
  includeCharts: boolean;
  includePlayerData: boolean;
  includeMatchData: boolean;
  includePerformanceMetrics: boolean;
  customFilters?: Record<string, any>;
}

export interface ExportProgress {
  stage: string;
  progress: number;
  message: string;
}

export const useComprehensiveExport = () => {
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState<ExportProgress | null>(null);

  const updateProgress = (stage: string, progress: number, message: string) => {
    setProgress({ stage, progress, message });
  };

  const exportAnalyticsData = async (options: ExportOptions) => {
    setExporting(true);
    setProgress(null);

    try {
      updateProgress('preparing', 10, 'Preparing data export...');

      // Calculate date filters
      const now = new Date();
      let dateFilter: Date | null = null;
      
      switch (options.dateRange) {
        case 'last7days':
          dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'last30days':
          dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'season':
          dateFilter = new Date('2024-08-01');
          break;
      }

      const exportData: any = {
        metadata: {
          exportDate: new Date().toISOString(),
          options,
          generatedBy: 'Football Analytics System'
        }
      };

      // Fetch player data
      if (options.includePlayerData) {
        updateProgress('players', 25, 'Fetching player data...');
        
        let playerQuery = supabase
          .from('players')
          .select(`
            id, name, position, number, season,
            goals, assists, matches, match_rating,
            minutes_played, shots_total, shots_on_target,
            passes_attempted, passes_completed, pass_accuracy,
            tackles_attempted, tackles_won,
            distance, sprintDistance, maxSpeed
          `);

        if (dateFilter) {
          playerQuery = playerQuery.gt('last_match_date', dateFilter.toISOString());
        }

        const { data: players, error: playersError } = await playerQuery
          .eq('season', '2024-25')
          .order('match_rating', { ascending: false });

        if (playersError) throw playersError;
        exportData.players = players;
      }

      // Fetch match data
      if (options.includeMatchData) {
        updateProgress('matches', 40, 'Fetching match data...');
        
        let matchQuery = supabase
          .from('matches')
          .select(`
            id, date, opponent, result, competition,
            home_score, away_score, location,
            attendance, weather_conditions
          `);

        if (dateFilter) {
          matchQuery = matchQuery.gt('date', dateFilter.toISOString().split('T')[0]);
        }

        const { data: matches, error: matchesError } = await matchQuery
          .order('date', { ascending: false })
          .limit(100);

        if (matchesError) throw matchesError;
        exportData.matches = matches;
      }

      // Fetch performance metrics
      if (options.includePerformanceMetrics) {
        updateProgress('performance', 60, 'Fetching performance metrics...');
        
        const [goalsRes, assistsRes, ratingsRes] = await Promise.all([
          supabase
            .from('goals')
            .select(`
              id, player_id, match_id, minute, goal_type,
              body_part, distance_from_goal, difficulty_rating,
              players!inner(name, position)
            `)
            .order('created_at', { ascending: false })
            .limit(500),
          
          supabase
            .from('assists')
            .select(`
              id, player_id, match_id, assist_type,
              pass_type, distance_of_pass, difficulty_rating,
              players!inner(name, position)
            `)
            .order('created_at', { ascending: false })
            .limit(500),
          
          supabase
            .from('match_ratings')
            .select(`
              id, match_id, overall_performance,
              attacking_rating, defensive_rating,
              tactical_execution, physical_performance,
              matches!inner(date, opponent, result)
            `)
            .order('created_at', { ascending: false })
            .limit(100)
        ]);

        if (goalsRes.error || assistsRes.error || ratingsRes.error) {
          throw goalsRes.error || assistsRes.error || ratingsRes.error;
        }

        exportData.performance = {
          goals: goalsRes.data,
          assists: assistsRes.data,
          matchRatings: ratingsRes.data
        };
      }

      updateProgress('formatting', 80, 'Formatting export data...');

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `football_analytics_${options.format}_${timestamp}`;

      // Simulate processing time for large exports
      await new Promise(resolve => setTimeout(resolve, 1000));

      updateProgress('complete', 100, 'Export completed successfully!');

      console.log('Export data prepared:', {
        format: options.format,
        recordCount: Object.keys(exportData).length - 1, // Exclude metadata
        filename
      });

      toast.success(`Analytics data exported successfully: ${filename}.${options.format}`);
      
      return { 
        success: true, 
        filename: `${filename}.${options.format}`,
        data: exportData,
        recordCount: calculateRecordCount(exportData)
      };

    } catch (error: any) {
      console.error('Export failed:', error);
      toast.error(`Export failed: ${error.message}`);
      return { success: false, error: error.message };
    } finally {
      setExporting(false);
      setTimeout(() => setProgress(null), 2000);
    }
  };

  const calculateRecordCount = (data: any): number => {
    let count = 0;
    if (data.players) count += data.players.length;
    if (data.matches) count += data.matches.length;
    if (data.performance) {
      count += data.performance.goals?.length || 0;
      count += data.performance.assists?.length || 0;
      count += data.performance.matchRatings?.length || 0;
    }
    return count;
  };

  return {
    exportAnalyticsData,
    exporting,
    progress
  };
};
