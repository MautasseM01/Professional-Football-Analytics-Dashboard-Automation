import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Goal {
  id: number;
  title: string;
  target: number;
  current: number;
  deadline: string;
  status: string;
  category: string;
}

interface TrainingRecommendation {
  type: string;
  exercises: string[];
  frequency: string;
}

interface CoachFeedback {
  date: string;
  coach: string;
  feedback: string;
  rating: number;
}

interface DevelopmentData {
  goals: Goal[];
  trainingRecommendations: TrainingRecommendation[];
  coachFeedback: CoachFeedback[];
}

export const useDevelopmentData = () => {
  const pathways = useQuery({
    queryKey: ['development-pathways'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('player_development_pathways')
        .select(`
          *,
          players!inner(id, name, position)
        `)
        .eq('status', 'active');
      
      if (error) throw error;
      return data || [];
    }
  });

  const milestones = useQuery({
    queryKey: ['development-milestones'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('player_development_milestones')
        .select(`
          *,
          players!inner(id, name, position)
        `)
        .order('target_date');
      
      if (error) throw error;
      return data || [];
    }
  });

  const assessments = useQuery({
    queryKey: ['development-assessments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('development_assessments')
        .select(`
          *,
          players!inner(id, name, position)
        `)
        .order('assessment_date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const communications = useQuery({
    queryKey: ['guardian-communications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('player_guardian_communications')
        .select(`
          *,
          players!inner(id, name, position)
        `)
        .order('communication_date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const educationalProgress = useQuery({
    queryKey: ['educational-progress'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('player_educational_progress')
        .select(`
          *,
          players!inner(id, name, position)
        `)
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const recommendations = useQuery({
    queryKey: ['development-recommendations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('player_development_recommendations')
        .select(`
          *,
          players!inner(id, name, position)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  return {
    pathways: pathways.data || [],
    milestones: milestones.data || [],
    assessments: assessments.data || [],
    communications: communications.data || [],
    educationalProgress: educationalProgress.data || [],
    recommendations: recommendations.data || [],
    loading: pathways.isLoading || milestones.isLoading || assessments.isLoading || communications.isLoading || educationalProgress.isLoading || recommendations.isLoading,
    error: pathways.error || milestones.error || assessments.error || communications.error || educationalProgress.error || recommendations.error
  };
};
