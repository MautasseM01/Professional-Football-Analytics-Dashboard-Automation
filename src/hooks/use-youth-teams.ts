
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface YouthTeamData {
  id: number;
  teamName: string;
  ageGroup: string;
  level: number;
  totalPlayers: number;
  availablePlayers: number;
  developmentProgress: number;
}

export const useYouthTeams = () => {
  return useQuery({
    queryKey: ['youth-teams'],
    queryFn: async (): Promise<YouthTeamData[]> => {
      console.log('Fetching youth teams data');
      
      const { data, error } = await supabase
        .from('youth_teams')
        .select(`
          id,
          team_name,
          age_group,
          level,
          player_team_assignments!left(
            player_id,
            status,
            players!inner(
              id,
              name,
              player_fitness_status!left(status)
            )
          )
        `)
        .order('level');
      
      if (error) {
        console.error('Error fetching youth teams:', error);
        throw error;
      }
      
      return data?.map(team => {
        const activePlayers = team.player_team_assignments?.filter(pta => pta.status === 'active') || [];
        const availablePlayers = activePlayers.filter(pta => 
          pta.players?.player_fitness_status?.[0]?.status === 'available'
        ).length;
        
        return {
          id: team.id,
          teamName: team.team_name,
          ageGroup: team.age_group || '',
          level: team.level,
          totalPlayers: activePlayers.length,
          availablePlayers,
          developmentProgress: Math.round(70 + Math.random() * 25) // TODO: Calculate real progress
        };
      }) || [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
