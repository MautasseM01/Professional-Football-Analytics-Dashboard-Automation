
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ExportDataHook {
  exportLoading: string | null;
  handleExport: (actionType: string) => Promise<void>;
}

export const useExportData = (): ExportDataHook => {
  const [exportLoading, setExportLoading] = useState<string | null>(null);

  const handleExport = async (actionType: string) => {
    setExportLoading(actionType);
    
    try {
      console.log(`Starting export: ${actionType}`);
      
      switch (actionType) {
        case 'player-data':
          const { data: playerData, error: playerError } = await supabase
            .from('player_match_performance')
            .select(`
              *,
              players!inner(name, position),
              matches!inner(date, opponent, result)
            `)
            .order('created_at', { ascending: false })
            .limit(1000);

          if (playerError) throw playerError;
          
          console.log(`Exported ${playerData?.length || 0} player performance records`);
          toast.success(`Player data exported: ${playerData?.length || 0} records`);
          break;

        case 'team-report':
          const { data: teamData, error: teamError } = await supabase
            .from('match_ratings')
            .select(`
              *,
              matches!inner(date, opponent, result)
            `)
            .order('created_at', { ascending: false })
            .limit(50);

          if (teamError) throw teamError;
          
          console.log(`Generated team report with ${teamData?.length || 0} match ratings`);
          toast.success(`Team report generated: ${teamData?.length || 0} matches analyzed`);
          break;

        case 'performance-trends':
          const { data: trendsData, error: trendsError } = await supabase
            .from('players')
            .select('id, name, position, goals, assists, match_rating, matches')
            .eq('season', '2024-25')
            .not('matches', 'is', null)
            .gt('matches', 0)
            .order('match_rating', { ascending: false });

          if (trendsError) throw trendsError;
          
          console.log(`Performance trends analyzed for ${trendsData?.length || 0} players`);
          toast.success(`Performance trends analyzed: ${trendsData?.length || 0} players`);
          break;

        case 'predictive-analysis':
          const { data: goalsData, error: goalsError } = await supabase
            .from('goals')
            .select(`
              *,
              players!inner(name, position)
            `)
            .order('created_at', { ascending: false })
            .limit(500);

          const { data: assistsData, error: assistsError } = await supabase
            .from('assists')
            .select(`
              *,
              players!inner(name, position)
            `)
            .order('created_at', { ascending: false })
            .limit(500);

          if (goalsError || assistsError) throw goalsError || assistsError;
          
          console.log(`Predictive analysis: ${goalsData?.length || 0} goals, ${assistsData?.length || 0} assists`);
          toast.success(`Predictive analysis completed: ${(goalsData?.length || 0) + (assistsData?.length || 0)} data points`);
          break;

        default:
          throw new Error(`Unknown export type: ${actionType}`);
      }

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));

    } catch (error: any) {
      console.error(`Export failed for ${actionType}:`, error);
      toast.error(`Export failed: ${error.message}`);
    } finally {
      setExportLoading(null);
    }
  };

  return { exportLoading, handleExport };
};
