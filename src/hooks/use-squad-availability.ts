
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SquadAvailabilityData {
  availablePlayers: number;
  lightTraining: number;
  injuredPlayers: number;
  suspendedPlayers: number;
  totalSquad: number;
}

export const useSquadAvailability = () => {
  return useQuery({
    queryKey: ['squad-availability'],
    queryFn: async (): Promise<SquadAvailabilityData> => {
      console.log('Fetching squad availability data');
      
      const { data, error } = await supabase
        .from('player_fitness_status')
        .select(`
          status,
          player_id,
          players!inner(id, name, season)
        `)
        .eq('players.season', '2024-25');
      
      if (error) {
        console.error('Error fetching squad availability:', error);
        throw error;
      }
      
      const availablePlayers = data?.filter(p => p.status === 'available').length || 0;
      const lightTraining = data?.filter(p => p.status === 'light_training').length || 0;
      const injuredPlayers = data?.filter(p => p.status === 'injured').length || 0;
      const suspendedPlayers = data?.filter(p => p.status === 'suspended').length || 0;
      const totalSquad = data?.length || 0;
      
      return {
        availablePlayers,
        lightTraining,
        injuredPlayers,
        suspendedPlayers,
        totalSquad
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
