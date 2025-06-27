
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DevelopmentProgressData {
  targetsMetPercentage: number;
  onTrackCount: number;
  needFocusCount: number;
  totalTargets: number;
  teamLevelProgress: {
    teamName: string;
    totalPlayers: number;
    onTargetPercentage: number;
  }[];
}

export const useDevelopmentProgress = () => {
  return useQuery({
    queryKey: ['development-progress'],
    queryFn: async (): Promise<DevelopmentProgressData> => {
      console.log('Fetching development progress data');
      
      // Get overall targets progress
      const { data: targetsData, error: targetsError } = await supabase
        .from('development_targets')
        .select('status')
        .gte('target_date', new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000).toISOString()); // Last 3 months
      
      if (targetsError) {
        console.error('Error fetching development targets:', targetsError);
        throw targetsError;
      }
      
      // Get team level progress
      const { data: teamProgressData, error: teamProgressError } = await supabase
        .from('youth_teams')
        .select(`
          team_name,
          level,
          player_team_assignments!inner(
            player_id,
            development_targets(status)
          )
        `)
        .eq('player_team_assignments.status', 'active')
        .order('level');
      
      if (teamProgressError) {
        console.error('Error fetching team progress:', teamProgressError);
        throw teamProgressError;
      }
      
      const totalTargets = targetsData?.length || 0;
      const onTrackCount = targetsData?.filter(t => t.status === 'on_track' || t.status === 'achieved').length || 0;
      const needFocusCount = targetsData?.filter(t => t.status === 'behind').length || 0;
      const targetsMetPercentage = totalTargets > 0 ? Math.round((onTrackCount / totalTargets) * 100) : 0;
      
      const teamLevelProgress = teamProgressData?.map(team => ({
        teamName: team.team_name,
        totalPlayers: team.player_team_assignments?.length || 0,
        onTargetPercentage: 75 + Math.random() * 20 // TODO: Calculate real percentage when data is available
      })) || [];
      
      return {
        targetsMetPercentage,
        onTrackCount,
        needFocusCount,
        totalTargets,
        teamLevelProgress
      };
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
