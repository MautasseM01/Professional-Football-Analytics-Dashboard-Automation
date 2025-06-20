
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DisciplinaryEvent {
  id: number;
  card_type: string;
  match_date: date;
  competition: string;
  match_id?: number;
  match_name?: string;
  opposition?: string;
  home_score?: number;
  away_score?: number;
  minute?: number;
}

interface DisciplinaryDetails {
  events: DisciplinaryEvent[];
  yellowCards: number;
  redCards: number;
  totalCards: number;
  riskLevel: 'SAFE' | 'AT RISK' | 'CRITICAL';
  riskColor: string;
  cardsUntilSuspension: number;
  missedMatches: number;
  fairPlayRating: number;
  teamAverageFairPlay: number;
  suspensionPeriods: Array<{
    start: string;
    end: string;
    matchesMissed: number;
  }>;
}

export const usePlayerDisciplinaryDetails = (playerId: number | null) => {
  return useQuery({
    queryKey: ['player-disciplinary-details', playerId],
    queryFn: async (): Promise<DisciplinaryDetails | null> => {
      if (!playerId) {
        console.log('No player ID provided to usePlayerDisciplinaryDetails');
        return null;
      }
      
      console.log('Fetching detailed disciplinary data for player ID:', playerId);
      
      // Fetch disciplinary events with match details
      const { data: disciplinaryData, error } = await supabase
        .from('player_disciplinary')
        .select(`
          id,
          card_type,
          match_date,
          competition,
          player_id
        `)
        .eq('player_id', playerId)
        .order('match_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching disciplinary data:', error);
        throw error;
      }
      
      console.log('Raw disciplinary events for player', playerId, ':', disciplinaryData);
      
      // Get team average fair play rating (mock calculation for now)
      const teamAverageFairPlay = 7.5;
      
      // Process the data
      const events: DisciplinaryEvent[] = disciplinaryData?.map(event => ({
        id: event.id,
        card_type: event.card_type || '',
        match_date: event.match_date,
        competition: event.competition || 'League',
        // Add mock match details for demonstration
        opposition: ['Arsenal', 'Chelsea', 'Liverpool', 'Man City', 'Tottenham'][Math.floor(Math.random() * 5)],
        home_score: Math.floor(Math.random() * 4),
        away_score: Math.floor(Math.random() * 4),
        minute: Math.floor(Math.random() * 90) + 1
      })) || [];
      
      // Calculate statistics
      const yellowCards = events.filter(e => e.card_type.toLowerCase() === 'yellow').length;
      const redCards = events.filter(e => e.card_type.toLowerCase() === 'red').length;
      const totalCards = yellowCards + redCards;
      
      // Risk assessment
      let riskLevel: 'SAFE' | 'AT RISK' | 'CRITICAL' = 'SAFE';
      let riskColor = 'text-green-500';
      let cardsUntilSuspension = 5 - (yellowCards % 5);
      
      if (redCards > 0 || totalCards >= 5) {
        riskLevel = 'CRITICAL';
        riskColor = 'text-red-500';
        cardsUntilSuspension = 0;
      } else if (totalCards === 4) {
        riskLevel = 'AT RISK';
        riskColor = 'text-amber-500';
        cardsUntilSuspension = 1;
      }
      
      // Calculate fair play rating (inverse of cards per match)
      const matchesPlayed = await supabase
        .from('players')
        .select('matches')
        .eq('id', playerId)
        .single();
      
      const playerMatches = matchesPlayed.data?.matches || 1;
      const fairPlayRating = Math.max(1, 10 - (totalCards / playerMatches) * 2);
      
      // Mock suspension periods
      const suspensionPeriods = redCards > 0 ? [{
        start: '2024-01-15',
        end: '2024-01-29',
        matchesMissed: 3
      }] : [];
      
      const result: DisciplinaryDetails = {
        events,
        yellowCards,
        redCards,
        totalCards,
        riskLevel,
        riskColor,
        cardsUntilSuspension,
        missedMatches: suspensionPeriods.reduce((sum, period) => sum + period.matchesMissed, 0),
        fairPlayRating: Number(fairPlayRating.toFixed(1)),
        teamAverageFairPlay,
        suspensionPeriods
      };
      
      console.log('Processed disciplinary details for player', playerId, ':', result);
      return result;
    },
    enabled: !!playerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
