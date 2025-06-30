
-- First, drop the dependent view that references the distance column
DROP VIEW IF EXISTS player_season_stats CASCADE;

-- 1. Remove duplicate 'distance' field from players table
-- First, migrate any data from 'distance' to 'distance_covered' if distance_covered is null
UPDATE players 
SET distance_covered = distance 
WHERE distance_covered IS NULL AND distance IS NOT NULL;

-- Now drop the redundant 'distance' column
ALTER TABLE players DROP COLUMN IF EXISTS distance;

-- Recreate the player_season_stats view using distance_covered instead of distance
CREATE VIEW player_season_stats AS
SELECT 
    p.id,
    p.name,
    p.position,
    p.number,
    p.season,
    p.matches,
    p.goals,
    p.assists,
    (p.goals + p.assists) as goal_contributions,
    CASE WHEN p.matches > 0 THEN ROUND(p.goals::numeric / p.matches, 2) ELSE 0 END as goals_per_match,
    CASE WHEN p.matches > 0 THEN ROUND(p.assists::numeric / p.matches, 2) ELSE 0 END as assists_per_match,
    p.shots_total,
    p.shots_on_target,
    CASE WHEN p.shots_total > 0 THEN ROUND((p.shots_on_target::numeric / p.shots_total) * 100, 1) ELSE 0 END as shot_accuracy_pct,
    p.passes_attempted,
    p.passes_completed,
    CASE WHEN p.passes_attempted > 0 THEN ROUND((p.passes_completed::numeric / p.passes_attempted) * 100, 1) ELSE 0 END as pass_completion_pct,
    p.tackles_attempted,
    p.tackles_won,
    CASE WHEN p.tackles_attempted > 0 THEN ROUND((p.tackles_won::numeric / p.tackles_attempted) * 100, 1) ELSE 0 END as tackle_success_pct,
    p.distance_covered as distance,  -- Map distance_covered to distance for backward compatibility
    p."sprintDistance",
    p."maxSpeed",
    p.match_rating,
    p.last_match_date
FROM players p;

-- 2. Add missing foreign key constraints
-- Add foreign key for goals.assisted_by_player_id -> players.id
ALTER TABLE goals 
ADD CONSTRAINT fk_goals_assisted_by_player 
FOREIGN KEY (assisted_by_player_id) REFERENCES players(id) ON DELETE SET NULL;

-- Add foreign key for assists.player_id -> players.id
ALTER TABLE assists 
ADD CONSTRAINT fk_assists_player 
FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE;

-- Add foreign key for player_match_performance.player_id -> players.id
ALTER TABLE player_match_performance 
ADD CONSTRAINT fk_player_match_performance_player 
FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE;

-- Add foreign key for player_match_performance.match_id -> matches.id
ALTER TABLE player_match_performance 
ADD CONSTRAINT fk_player_match_performance_match 
FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE;

-- 3. Create performance indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_player_match_performance_player_match 
ON player_match_performance(player_id, match_id);

CREATE INDEX IF NOT EXISTS idx_goals_player_match 
ON goals(player_id, match_id);

CREATE INDEX IF NOT EXISTS idx_shots_player_match 
ON shots(player_id, match_id);

CREATE INDEX IF NOT EXISTS idx_assists_player_goal 
ON assists(player_id, goal_id);

-- 4. Add missing fields to player_match_performance table if not already present
-- Check if columns exist and add them if they don't
DO $$ 
BEGIN
    -- Add touches column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'player_match_performance' AND column_name = 'touches') THEN
        ALTER TABLE player_match_performance ADD COLUMN touches integer DEFAULT 0;
    END IF;
    
    -- Add dribbles_successful column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'player_match_performance' AND column_name = 'dribbles_successful') THEN
        ALTER TABLE player_match_performance ADD COLUMN dribbles_successful integer DEFAULT 0;
    END IF;
    
    -- Add possession_won column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'player_match_performance' AND column_name = 'possession_won') THEN
        ALTER TABLE player_match_performance ADD COLUMN possession_won integer DEFAULT 0;
    END IF;
    
    -- Add possession_lost column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'player_match_performance' AND column_name = 'possession_lost') THEN
        ALTER TABLE player_match_performance ADD COLUMN possession_lost integer DEFAULT 0;
    END IF;
END $$;

-- Update the aggregated stats function to use distance_covered instead of distance
CREATE OR REPLACE FUNCTION public.update_player_aggregated_stats()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
    -- Update aggregated stats in players table
    UPDATE players 
    SET 
        goals = (SELECT COALESCE(SUM(goals), 0) FROM player_match_performance WHERE player_id = NEW.player_id),
        assists = (SELECT COALESCE(SUM(assists), 0) FROM player_match_performance WHERE player_id = NEW.player_id),
        shots_total = (SELECT COALESCE(SUM(shots_total), 0) FROM player_match_performance WHERE player_id = NEW.player_id),
        shots_on_target = (SELECT COALESCE(SUM(shots_on_target), 0) FROM player_match_performance WHERE player_id = NEW.player_id),
        passes_attempted = (SELECT COALESCE(SUM(passes_attempted), 0) FROM player_match_performance WHERE player_id = NEW.player_id),
        passes_completed = (SELECT COALESCE(SUM(passes_completed), 0) FROM player_match_performance WHERE player_id = NEW.player_id),
        tackles_attempted = (SELECT COALESCE(SUM(tackles_attempted), 0) FROM player_match_performance WHERE player_id = NEW.player_id),
        tackles_won = (SELECT COALESCE(SUM(tackles_won), 0) FROM player_match_performance WHERE player_id = NEW.player_id),
        distance_covered = (SELECT COALESCE(SUM(distance_covered), 0) FROM player_match_performance WHERE player_id = NEW.player_id),
        "sprintDistance" = (SELECT COALESCE(SUM(sprint_distance), 0) FROM player_match_performance WHERE player_id = NEW.player_id),
        "maxSpeed" = (SELECT COALESCE(MAX(max_speed), 0) FROM player_match_performance WHERE player_id = NEW.player_id),
        matches = (SELECT COUNT(*) FROM player_match_performance WHERE player_id = NEW.player_id AND minutes_played > 0),
        match_rating = (SELECT COALESCE(AVG(match_rating), 0) FROM player_match_performance WHERE player_id = NEW.player_id AND match_rating > 0),
        minutes_played = (SELECT COALESCE(SUM(minutes_played), 0) FROM player_match_performance WHERE player_id = NEW.player_id),
        last_match_date = (SELECT MAX(m.date) FROM player_match_performance pmp JOIN matches m ON pmp.match_id = m.id WHERE pmp.player_id = NEW.player_id),
        updated_at = now()
    WHERE id = NEW.player_id;
    
    RETURN NEW;
END;
$function$;
