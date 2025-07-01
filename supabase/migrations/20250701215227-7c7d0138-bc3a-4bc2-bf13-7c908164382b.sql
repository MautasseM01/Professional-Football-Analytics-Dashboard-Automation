
-- First, let's check what foreign key constraints currently exist on player_match_performance table
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu 
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name = 'player_match_performance'
    AND kcu.column_name = 'match_id';

-- Drop any existing foreign key constraints between player_match_performance and matches
ALTER TABLE player_match_performance 
DROP CONSTRAINT IF EXISTS fk_player_match_performance_match;

ALTER TABLE player_match_performance 
DROP CONSTRAINT IF EXISTS player_match_performance_match_id_fkey;

-- Drop any other potential constraint names that might exist
ALTER TABLE player_match_performance 
DROP CONSTRAINT IF EXISTS player_match_performance_match_id_fkey1;

ALTER TABLE player_match_performance 
DROP CONSTRAINT IF EXISTS matches_fkey;

-- Add back only one clean foreign key constraint
ALTER TABLE player_match_performance 
ADD CONSTRAINT fk_player_match_performance_match 
FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE;

-- Also check and fix the player foreign key constraint if needed
ALTER TABLE player_match_performance 
DROP CONSTRAINT IF EXISTS fk_player_match_performance_player;

ALTER TABLE player_match_performance 
DROP CONSTRAINT IF EXISTS player_match_performance_player_id_fkey;

-- Add back the player foreign key constraint
ALTER TABLE player_match_performance 
ADD CONSTRAINT fk_player_match_performance_player 
FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE;
