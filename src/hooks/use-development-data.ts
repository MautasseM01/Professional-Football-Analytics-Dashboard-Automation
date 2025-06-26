
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DevelopmentPathway {
  id: number;
  player_id: number;
  current_level: string;
  target_level?: string;
  pathway_stage?: string;
  promotion_date?: string;
  demotion_date?: string;
  status: string;
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

export interface CoachAssessment {
  id: number;
  player_id: number;
  coach_id?: string;
  assessment_date: string;
  technical_rating?: number;
  tactical_rating?: number;
  physical_rating?: number;
  mental_rating?: number;
  overall_rating?: number;
  strengths?: string;
  areas_for_improvement?: string;
  development_notes?: string;
  recommendation?: string;
  created_at: string;
}

export interface GuardianCommunication {
  id: number;
  player_id: number;
  guardian_name?: string;
  guardian_email?: string;
  guardian_phone?: string;
  communication_type?: string;
  communication_date: string;
  subject?: string;
  content?: string;
  follow_up_required: boolean;
  follow_up_date?: string;
  staff_member_id?: string;
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

export interface DevelopmentRecommendation {
  id: number;
  player_id: number;
  recommendation_type?: string;
  priority_level: number;
  focus_area?: string;
  specific_recommendations?: string;
  target_completion_date?: string;
  status: string;
  created_by?: string;
  created_at: string;
}

export const useDevelopmentData = () => {
  const [pathways, setPathways] = useState<DevelopmentPathway[]>([]);
  const [milestones, setMilestones] = useState<DevelopmentMilestone[]>([]);
  const [assessments, setAssessments] = useState<CoachAssessment[]>([]);
  const [communications, setCommunications] = useState<GuardianCommunication[]>([]);
  const [educationalProgress, setEducationalProgress] = useState<EducationalProgress[]>([]);
  const [recommendations, setRecommendations] = useState<DevelopmentRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDevelopmentData = async () => {
    try {
      setLoading(true);
      
      const [
        pathwaysResponse,
        milestonesResponse,
        assessmentsResponse,
        communicationsResponse,
        educationResponse,
        recommendationsResponse
      ] = await Promise.all([
        supabase.from('player_development_pathways').select('*'),
        supabase.from('player_development_milestones').select('*'),
        supabase.from('player_coach_assessments').select('*'),
        supabase.from('player_guardian_communications').select('*'),
        supabase.from('player_educational_progress').select('*'),
        supabase.from('player_development_recommendations').select('*')
      ]);

      if (pathwaysResponse.error) throw pathwaysResponse.error;
      if (milestonesResponse.error) throw milestonesResponse.error;
      if (assessmentsResponse.error) throw assessmentsResponse.error;
      if (communicationsResponse.error) throw communicationsResponse.error;
      if (educationResponse.error) throw educationResponse.error;
      if (recommendationsResponse.error) throw recommendationsResponse.error;

      setPathways(pathwaysResponse.data || []);
      setMilestones(milestonesResponse.data || []);
      setAssessments(assessmentsResponse.data || []);
      setCommunications(communicationsResponse.data || []);
      setEducationalProgress(educationResponse.data || []);
      setRecommendations(recommendationsResponse.data || []);
      
      setError(null);
    } catch (err) {
      console.error('Error fetching development data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevelopmentData();
  }, []);

  return {
    pathways,
    milestones,
    assessments,
    communications,
    educationalProgress,
    recommendations,
    loading,
    error,
    refetch: fetchDevelopmentData
  };
};
