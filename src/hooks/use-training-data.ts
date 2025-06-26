
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TrainingSession {
  id: number;
  session_date: string;
  session_type: string;
  location: string;
  duration_minutes: number;
}

export interface PlayerTrainingAttendance {
  id: number;
  player_id: number;
  training_session_id: number;
  attended: boolean;
  performance_rating: number | null;
  notes: string | null;
  training_sessions: TrainingSession;
}

export const useTrainingAttendance = () => {
  return useQuery({
    queryKey: ['training-attendance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('player_training_attendance')
        .select(`
          *,
          training_sessions (
            id,
            session_date,
            session_type,
            location,
            duration_minutes
          )
        `)
        .gte('training_sessions.session_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

      if (error) {
        console.error('Error fetching training attendance:', error);
        throw error;
      }

      return data as PlayerTrainingAttendance[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePlayerTrainingStats = (playerId: number) => {
  return useQuery({
    queryKey: ['player-training-stats', playerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('player_training_attendance')
        .select(`
          attended,
          performance_rating,
          training_sessions!inner (
            session_date
          )
        `)
        .eq('player_id', playerId)
        .gte('training_sessions.session_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

      if (error) {
        console.error('Error fetching player training stats:', error);
        throw error;
      }

      const attendanceRate = data.length > 0 
        ? Math.round((data.filter(d => d.attended).length / data.length) * 100)
        : 0;

      const avgRating = data.length > 0 
        ? data.reduce((sum, d) => sum + (d.performance_rating || 0), 0) / data.length
        : 0;

      return {
        attendanceRate,
        averageRating: Math.round(avgRating * 10) / 10,
        sessionsAttended: data.filter(d => d.attended).length,
        totalSessions: data.length
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
