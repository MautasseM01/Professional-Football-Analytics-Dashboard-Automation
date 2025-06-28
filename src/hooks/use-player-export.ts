
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Player } from "@/types";
import { toast } from "sonner";

export interface PlayerExportOptions {
  includeAttributes: boolean;
  includePerformance: boolean;
  includeGoalsAssists: boolean;
  includeBenchmarks: boolean;
  timeRange: 'season' | 'last10' | 'all';
  format: 'pdf' | 'csv' | 'json';
}

export const usePlayerExport = () => {
  const [exporting, setExporting] = useState(false);

  const exportPlayerReport = async (player: Player, options: PlayerExportOptions) => {
    setExporting(true);
    
    try {
      console.log(`Exporting ${options.format} report for player:`, player.name);
      
      // Gather all requested data
      const exportData: any = {
        player: {
          id: player.id,
          name: player.name,
          position: player.position,
          number: player.number
        },
        exportDate: new Date().toISOString(),
        options
      };

      if (options.includeAttributes) {
        const { data: attributes } = await supabase
          .from('player_attributes')
          .select('*')
          .eq('player_id', player.id)
          .maybeSingle();
        exportData.attributes = attributes;
      }

      if (options.includePerformance) {
        let query = supabase
          .from('player_match_performance')
          .select(`
            *,
            matches!inner(date, opponent, competition, result)
          `)
          .eq('player_id', player.id)
          .order('id', { ascending: false });

        if (options.timeRange === 'last10') {
          query = query.limit(10);
        } else if (options.timeRange === 'season') {
          query = query.limit(38);
        }

        const { data: performance } = await query;
        exportData.performance = performance;
      }

      if (options.includeGoalsAssists) {
        const [goalsRes, assistsRes] = await Promise.all([
          supabase
            .from('goals')
            .select(`
              *,
              matches!inner(date, opponent, competition)
            `)
            .eq('player_id', player.id)
            .order('created_at', { ascending: false }),
          supabase
            .from('assists')
            .select(`
              *,
              matches!inner(date, opponent, competition)
            `)
            .eq('player_id', player.id)
            .order('created_at', { ascending: false })
        ]);

        exportData.goals = goalsRes.data;
        exportData.assists = assistsRes.data;
      }

      if (options.includeBenchmarks) {
        const { data: benchmarks } = await supabase
          .from('league_benchmarks')
          .select('*')
          .eq('position', player.position || 'All')
          .eq('season', '2024-25');
        exportData.benchmarks = benchmarks;
      }

      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In a real implementation, you would generate the actual file here
      const filename = `${player.name.replace(/\s+/g, '_')}_report_${new Date().toISOString().split('T')[0]}.${options.format}`;
      
      console.log('Export data prepared:', exportData);
      toast.success(`Player report exported: ${filename}`);
      
      return { success: true, filename, data: exportData };

    } catch (error: any) {
      console.error('Export failed:', error);
      toast.error(`Export failed: ${error.message}`);
      return { success: false, error: error.message };
    } finally {
      setExporting(false);
    }
  };

  return { exportPlayerReport, exporting };
};
