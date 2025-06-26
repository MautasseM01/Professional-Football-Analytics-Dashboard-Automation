
-- Create injury tracking table
CREATE TABLE player_injuries (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id),
  injury_type VARCHAR(100),
  injury_date DATE,
  expected_return_date DATE,
  status VARCHAR(20) DEFAULT 'active', -- active, recovering, fit
  severity VARCHAR(20), -- minor, moderate, major
  body_part VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create contract information table
CREATE TABLE player_contracts (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id),
  contract_start_date DATE,
  contract_end_date DATE,
  salary_per_week DECIMAL,
  contract_type VARCHAR(50), -- professional, youth, loan
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create training sessions table
CREATE TABLE training_sessions (
  id SERIAL PRIMARY KEY,
  session_date DATE,
  session_type VARCHAR(50), -- fitness, tactical, technical
  location VARCHAR(100),
  duration_minutes INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create player training attendance table
CREATE TABLE player_training_attendance (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id),
  training_session_id INTEGER REFERENCES training_sessions(id),
  attended BOOLEAN DEFAULT FALSE,
  performance_rating DECIMAL(3,1), -- 1.0 to 10.0
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create starting eleven table
CREATE TABLE starting_eleven (
  id SERIAL PRIMARY KEY,
  match_id INTEGER REFERENCES matches(id),
  player_id INTEGER REFERENCES players(id),
  position_on_field VARCHAR(20),
  formation VARCHAR(10), -- 4-4-2, 4-3-3, etc
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create player development goals table
CREATE TABLE player_development_goals (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id),
  coach_id UUID REFERENCES users(id),
  goal_description TEXT,
  target_date DATE,
  status VARCHAR(20) DEFAULT 'active', -- active, completed, cancelled
  priority VARCHAR(10), -- high, medium, low
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add RLS policies for coach access
ALTER TABLE player_injuries ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_training_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE starting_eleven ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_development_goals ENABLE ROW LEVEL SECURITY;

-- Create policies for coaches and management
CREATE POLICY "Coaches can view all player injuries" ON player_injuries FOR SELECT USING (true);
CREATE POLICY "Coaches can view all player contracts" ON player_contracts FOR SELECT USING (true);
CREATE POLICY "Coaches can view all training sessions" ON training_sessions FOR SELECT USING (true);
CREATE POLICY "Coaches can view all training attendance" ON player_training_attendance FOR SELECT USING (true);
CREATE POLICY "Coaches can view all starting eleven" ON starting_eleven FOR SELECT USING (true);
CREATE POLICY "Coaches can view all development goals" ON player_development_goals FOR SELECT USING (true);

-- Insert some sample data for testing
INSERT INTO player_injuries (player_id, injury_type, injury_date, expected_return_date, status, severity, body_part, notes)
SELECT 
  p.id,
  CASE 
    WHEN p.id % 15 = 1 THEN 'Hamstring Strain'
    WHEN p.id % 15 = 2 THEN 'Ankle Sprain'
    ELSE NULL
  END,
  CURRENT_DATE - INTERVAL '1 week',
  CURRENT_DATE + INTERVAL '2 weeks',
  CASE 
    WHEN p.id % 15 = 1 THEN 'active'
    WHEN p.id % 15 = 2 THEN 'recovering'
    ELSE NULL
  END,
  'minor',
  CASE 
    WHEN p.id % 15 = 1 THEN 'Hamstring'
    WHEN p.id % 15 = 2 THEN 'Ankle'
    ELSE NULL
  END,
  'Injury occurred during training'
FROM players p
WHERE p.id % 15 IN (1, 2);

INSERT INTO player_contracts (player_id, contract_start_date, contract_end_date, contract_type, status)
SELECT 
  p.id,
  '2024-07-01',
  '2025-06-30',
  'professional',
  'active'
FROM players p
LIMIT 10;

INSERT INTO training_sessions (session_date, session_type, location, duration_minutes)
VALUES 
  (CURRENT_DATE - INTERVAL '1 day', 'fitness', 'Training Ground A', 90),
  (CURRENT_DATE - INTERVAL '2 days', 'tactical', 'Training Ground B', 120),
  (CURRENT_DATE - INTERVAL '3 days', 'technical', 'Training Ground A', 90);

INSERT INTO player_training_attendance (player_id, training_session_id, attended, performance_rating)
SELECT 
  p.id,
  ts.id,
  CASE WHEN random() > 0.15 THEN true ELSE false END,
  ROUND((random() * 4 + 6)::numeric, 1)
FROM players p
CROSS JOIN training_sessions ts
WHERE p.id <= 20;
