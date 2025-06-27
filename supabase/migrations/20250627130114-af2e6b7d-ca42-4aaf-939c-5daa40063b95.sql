
-- Create comprehensive injury and fitness tracking
CREATE TABLE player_fitness_status (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id),
  status VARCHAR(20) CHECK (status IN ('available', 'light_training', 'injured', 'suspended')),
  fitness_level INTEGER CHECK (fitness_level >= 1 AND fitness_level <= 100),
  last_assessment_date DATE,
  return_to_full_training_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add youth team tracking
CREATE TABLE youth_teams (
  id SERIAL PRIMARY KEY,
  team_name VARCHAR(50) NOT NULL,
  age_group VARCHAR(10),
  level INTEGER NOT NULL, -- 1=First Team, 2=U23s, etc.
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE player_team_assignments (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id),
  youth_team_id INTEGER REFERENCES youth_teams(id),
  assignment_date DATE DEFAULT CURRENT_DATE,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Development tracking tables
CREATE TABLE development_targets (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id),
  target_description TEXT NOT NULL,
  target_value DECIMAL,
  current_value DECIMAL,
  target_date DATE,
  status VARCHAR(20) CHECK (status IN ('on_track', 'behind', 'achieved', 'cancelled')),
  category VARCHAR(50),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE development_assessments (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id),
  assessment_date DATE DEFAULT CURRENT_DATE,
  assessor_id UUID REFERENCES users(id),
  overall_progress_percentage DECIMAL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Performance benchmarking tables
CREATE TABLE league_benchmarks (
  id SERIAL PRIMARY KEY,
  metric_name VARCHAR(100) NOT NULL,
  position VARCHAR(20),
  league_average DECIMAL,
  top_25_percentile DECIMAL,
  top_10_percentile DECIMAL,
  season VARCHAR(10) DEFAULT '2024-25',
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE performance_kpis (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id),
  kpi_name VARCHAR(100) NOT NULL,
  current_value DECIMAL,
  target_value DECIMAL,
  league_percentile DECIMAL,
  status VARCHAR(20) CHECK (status IN ('above_average', 'average', 'below_average')),
  calculation_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert default youth teams
INSERT INTO youth_teams (team_name, age_group, level) VALUES
('First Team', 'Senior', 1),
('U23s', 'U23', 2),
('U21s', 'U21', 3),
('U19s', 'U19', 4),
('Academy', 'U18', 5);

-- Create indexes for performance
CREATE INDEX idx_player_fitness_status_player_id ON player_fitness_status(player_id);
CREATE INDEX idx_player_team_assignments_player_id ON player_team_assignments(player_id);
CREATE INDEX idx_development_targets_player_id ON development_targets(player_id);
CREATE INDEX idx_performance_kpis_player_id ON performance_kpis(player_id);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_player_fitness_status_updated_at
    BEFORE UPDATE ON player_fitness_status
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_development_targets_updated_at
    BEFORE UPDATE ON development_targets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO player_fitness_status (player_id, status, fitness_level, last_assessment_date)
SELECT 
  id, 
  CASE 
    WHEN RANDOM() < 0.7 THEN 'available'
    WHEN RANDOM() < 0.85 THEN 'light_training'
    ELSE 'injured'
  END,
  FLOOR(RANDOM() * 30 + 70)::INTEGER,
  CURRENT_DATE - INTERVAL '1 day' * FLOOR(RANDOM() * 7)
FROM players 
WHERE id <= 25;

-- Insert sample league benchmarks
INSERT INTO league_benchmarks (metric_name, position, league_average, top_25_percentile, top_10_percentile) VALUES
('Pass Completion %', 'Midfielder', 85.5, 88.2, 92.1),
('Goals per Match', 'Forward', 0.45, 0.65, 0.85),
('Tackles per Match', 'Defender', 3.2, 4.1, 5.2),
('Distance Covered (km)', 'All', 10.8, 11.5, 12.2);
