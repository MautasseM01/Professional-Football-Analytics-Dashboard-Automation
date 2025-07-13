-- Add player_name column to shots table for easier querying
ALTER TABLE shots ADD COLUMN IF NOT EXISTS player_name TEXT;

-- Update existing shots with player names from the players table
UPDATE shots SET player_name = (
    SELECT name FROM players WHERE players.id = shots.player_id
)
WHERE player_name IS NULL;