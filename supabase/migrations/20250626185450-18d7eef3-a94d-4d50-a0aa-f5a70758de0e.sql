
-- Create enhanced player development tracking tables
CREATE TABLE IF NOT EXISTS public.player_development_pathways (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id),
  current_level VARCHAR(50) NOT NULL DEFAULT 'Academy',
  target_level VARCHAR(50),
  pathway_stage VARCHAR(100),
  promotion_date DATE,
  demotion_date DATE,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create development milestones table
CREATE TABLE IF NOT EXISTS public.player_development_milestones (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id),
  milestone_type VARCHAR(100) NOT NULL,
  milestone_description TEXT,
  target_date DATE,
  completed_date DATE,
  status VARCHAR(20) DEFAULT 'pending',
  importance_level INTEGER DEFAULT 3,
  coach_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create coach assessments table
CREATE TABLE IF NOT EXISTS public.player_coach_assessments (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id),
  coach_id UUID REFERENCES users(id),
  assessment_date DATE NOT NULL,
  technical_rating INTEGER CHECK (technical_rating >= 1 AND technical_rating <= 10),
  tactical_rating INTEGER CHECK (tactical_rating >= 1 AND tactical_rating <= 10),
  physical_rating INTEGER CHECK (physical_rating >= 1 AND physical_rating <= 10),
  mental_rating INTEGER CHECK (mental_rating >= 1 AND mental_rating <= 10),
  overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 10),
  strengths TEXT,
  areas_for_improvement TEXT,
  development_notes TEXT,
  recommendation VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create parent/guardian communication log
CREATE TABLE IF NOT EXISTS public.player_guardian_communications (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id),
  guardian_name VARCHAR(100),
  guardian_email VARCHAR(100),
  guardian_phone VARCHAR(20),
  communication_type VARCHAR(50),
  communication_date DATE NOT NULL,
  subject TEXT,
  content TEXT,
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_date DATE,
  staff_member_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create educational progress table
CREATE TABLE IF NOT EXISTS public.player_educational_progress (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id),
  academic_year VARCHAR(20),
  education_level VARCHAR(50),
  subjects_grades JSONB,
  attendance_percentage NUMERIC(5,2),
  behavioral_notes TEXT,
  academic_support_needed BOOLEAN DEFAULT false,
  tutor_assigned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create development recommendations table
CREATE TABLE IF NOT EXISTS public.player_development_recommendations (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id),
  recommendation_type VARCHAR(50),
  priority_level INTEGER DEFAULT 3,
  focus_area VARCHAR(100),
  specific_recommendations TEXT,
  target_completion_date DATE,
  status VARCHAR(20) DEFAULT 'active',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_player_development_pathways_player_id ON player_development_pathways(player_id);
CREATE INDEX IF NOT EXISTS idx_player_development_milestones_player_id ON player_development_milestones(player_id);
CREATE INDEX IF NOT EXISTS idx_player_coach_assessments_player_id ON player_coach_assessments(player_id);
CREATE INDEX IF NOT EXISTS idx_player_guardian_communications_player_id ON player_guardian_communications(player_id);
CREATE INDEX IF NOT EXISTS idx_player_educational_progress_player_id ON player_educational_progress(player_id);
CREATE INDEX IF NOT EXISTS idx_player_development_recommendations_player_id ON player_development_recommendations(player_id);

-- Add RLS policies for security
ALTER TABLE player_development_pathways ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_development_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_coach_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_guardian_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_educational_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_development_recommendations ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users in coaching/management roles
CREATE POLICY "Coaching staff can view development data" ON player_development_pathways
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Coaching staff can manage development data" ON player_development_pathways
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Coaching staff can view milestones" ON player_development_milestones
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Coaching staff can manage milestones" ON player_development_milestones
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Coaching staff can view assessments" ON player_coach_assessments
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Coaching staff can manage assessments" ON player_coach_assessments
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can view guardian communications" ON player_guardian_communications
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can manage guardian communications" ON player_guardian_communications
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can view educational progress" ON player_educational_progress
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can manage educational progress" ON player_educational_progress
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can view recommendations" ON player_development_recommendations
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can manage recommendations" ON player_development_recommendations
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Create triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_player_development_pathways_updated_at
  BEFORE UPDATE ON player_development_pathways
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_player_educational_progress_updated_at
  BEFORE UPDATE ON player_educational_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
