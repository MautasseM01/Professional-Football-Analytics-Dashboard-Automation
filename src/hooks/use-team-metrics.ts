
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useTeamMetrics = () => {
  return useQuery({
    queryKey: ['team-metrics'],
    queryFn: async () => {
      // Get total players
      const { count: totalPlayers } = await supabase
        .from('players')
        .select('*', { count: 'exact', head: true })
        .eq('season', '2024-25');

      // Get injured players
      const { count: injuredPlayers } = await supabase
        .from('player_injuries')
        .select('player_id', { count: 'exact', head: true })
        .eq('status', 'active');

      // Get suspended players
      const { count: suspendedPlayers } = await supabase
        .from('player_eligibility')
        .select('player_id', { count: 'exact', head: true })
        .gt('suspension_until', new Date().toISOString().split('T')[0]);

      // Get team goals this season
      const { count: teamGoals } = await supabase
        .from('goals')
        .select('id', { count: 'exact', head: true });

      // Get recent matches for win rate
      const { data: matches } = await supabase
        .from('matches')
        .select('result, home_score, away_score')
        .gte('date', '2024-09-01')
        .order('date', { ascending: false });

      // Calculate available players
      const availablePlayers = (totalPlayers || 0) - (injuredPlayers || 0) - (suspendedPlayers || 0);

      // Calculate win rate
      let winRate = 0;
      if (matches && matches.length > 0) {
        const wins = matches.filter(match => 
          match.result === 'Win' || 
          (match.home_score !== null && match.away_score !== null && match.home_score > match.away_score)
        ).length;
        winRate = Math.round((wins / matches.length) * 100);
      }

      // Get training attendance
      const { data: trainingData } = await supabase
        .from('player_training_attendance')
        .select('attended')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      let trainingAttendance = 0;
      if (trainingData && trainingData.length > 0) {
        const attended = trainingData.filter(d => d.attended).length;
        trainingAttendance = Math.round((attended / trainingData.length) * 100);
      }

      return {
        totalPlayers: totalPlayers || 0,
        availablePlayers,
        injuredPlayers: injuredPlayers || 0,
        suspendedPlayers: suspendedPlayers || 0,
        teamGoals: teamGoals || 0,
        winRate,
        trainingAttendance,
        matchesPlayed: matches?.length || 0
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
