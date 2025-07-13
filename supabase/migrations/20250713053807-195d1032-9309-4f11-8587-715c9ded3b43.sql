-- Ensure shots table has proper structure and sample data for testing
-- First check if we need to add player_name column
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'shots' AND column_name = 'player_name') THEN
        ALTER TABLE shots ADD COLUMN player_name TEXT;
        
        -- Update existing shots with player names
        UPDATE shots SET player_name = (
            SELECT name FROM players WHERE players.id = shots.player_id
        );
    END IF;
END $$;

-- Add some additional sample shots for testing if we have less than 50
INSERT INTO shots (player_id, match_id, match_name, x_coordinate, y_coordinate, minute, period, outcome, distance, date, player_name)
SELECT 
    p.id,
    m.id,
    m.opponent,
    -- Random coordinates within penalty area and outside
    CASE 
        WHEN random() < 0.3 THEN (850 + (random() * 200)::int) -- Penalty area shots
        ELSE (600 + (random() * 450)::int) -- Other shots
    END,
    CASE 
        WHEN random() < 0.3 THEN (280 + (random() * 120)::int) -- Penalty area shots
        ELSE (150 + (random() * 380)::int) -- Other shots  
    END,
    (random() * 90 + 1)::int, -- Random minute
    CASE 
        WHEN random() < 0.6 THEN 'First Half'
        WHEN random() < 0.9 THEN 'Second Half'
        ELSE 'Extra Time'
    END,
    CASE 
        WHEN random() < 0.15 THEN 'Goal'
        WHEN random() < 0.4 THEN 'Shot on Target'
        WHEN random() < 0.7 THEN 'Shot Off Target'
        ELSE 'Blocked Shot'
    END,
    (random() * 25 + 5)::int, -- Distance 5-30 meters
    m.date,
    p.name
FROM players p
CROSS JOIN matches m
WHERE random() < 0.3 -- Only add for 30% of player-match combinations
AND NOT EXISTS (
    SELECT 1 FROM shots s2 
    WHERE s2.player_id = p.id 
    AND s2.match_id = m.id 
    AND (SELECT COUNT(*) FROM shots) > 200 -- Stop if we already have enough shots
)
LIMIT 100; -- Limit to 100 new shots max

-- Update any shots missing player names
UPDATE shots SET player_name = (
    SELECT name FROM players WHERE players.id = shots.player_id
)
WHERE player_name IS NULL;