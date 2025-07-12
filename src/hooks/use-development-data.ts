
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Goal {
  id: number;
  title: string;
  target: number;
  current: number;
  deadline: string;
  status: string;
  category: string;
}

export interface TrainingRecommendation {
  type: string;
  exercises: string[];
  frequency: string;
}

export interface CoachFeedback {
  date: string;
  coach: string;
  feedback: string;
  rating: number;
}

export interface DevelopmentData {
  goals: Goal[];
  trainingRecommendations: TrainingRecommendation[];
  coachFeedback: CoachFeedback[];
}

export interface DevelopmentPathway {
  id: number;
  player_id: number;
  current_level: string;
  target_level?: string;
  pathway_stage?: string;
  status: string;
  promotion_date?: string;
  demotion_date?: string;
  created_at: string;
  updated_at: string;
}

export interface DevelopmentMilestone {
  id: number;
  player_id: number;
  milestone_type: string;
  milestone_description?: string;
  target_date?: string;
  completed_date?: string;
  status: string;
  importance_level: number;
  coach_id?: string;
  created_at: string;
}

export interface DevelopmentRecommendation {
  id: number;
  player_id: number;
  recommendation_type?: string;
  focus_area?: string;
  specific_recommendations?: string;
  priority_level: number;
  status: string;
  target_completion_date?: string;
  created_by?: string;
  created_at: string;
}

export interface CoachAssessment {
  id: number;
  player_id: number;
  assessment_date: string;
  coach_id?: string;
  overall_rating?: number;
  technical_rating?: number;
  tactical_rating?: number;
  physical_rating?: number;
  mental_rating?: number;
  strengths?: string;
  areas_for_improvement?: string;
  development_notes?: string;
  recommendation?: string;
  created_at: string;
}

export interface GuardianCommunication {
  id: number;
  player_id: number;
  communication_date: string;
  communication_type?: string;
  subject?: string;
  content?: string;
  guardian_name?: string;
  guardian_email?: string;
  guardian_phone?: string;
  staff_member_id?: string;
  follow_up_required: boolean;
  follow_up_date?: string;
  created_at: string;
}

export interface EducationalProgress {
  id: number;
  player_id: number;
  academic_year?: string;
  education_level?: string;
  subjects_grades?: any;
  attendance_percentage?: number;
  behavioral_notes?: string;
  academic_support_needed: boolean;
  tutor_assigned: boolean;
  created_at: string;
  updated_at: string;
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
    queryKey: ['coach-assessments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('player_coach_assessments')
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
