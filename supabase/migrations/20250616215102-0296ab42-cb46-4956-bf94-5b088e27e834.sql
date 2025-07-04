
-- Insert match performance data with minimal required columns first
INSERT INTO player_match_performance (
    player_id, 
    match_id, 
    minutes_played, 
    goals, 
    assists, 
    shots_total, 
    shots_on_target,
    passes_attempted, 
    passes_completed, 
    tackles_attempted, 
    tackles_won,
    distance_covered
) VALUES
-- Match 1 data
(1, 1, 90, 2, 1, 6, 4, 45, 38, 3, 2, 11.2),
(2, 1, 90, 0, 2, 2, 1, 62, 54, 8, 6, 10.8),
(3, 1, 90, 0, 0, 1, 0, 58, 48, 12, 9, 11.5),
(4, 1, 90, 0, 0, 0, 0, 52, 44, 10, 7, 11.3),
(5, 1, 75, 1, 0, 4, 2, 35, 28, 5, 3, 9.8),
(6, 1, 90, 0, 1, 1, 1, 48, 41, 6, 4, 10.2),
(7, 1, 90, 0, 0, 3, 1, 55, 49, 2, 1, 10.5),
(8, 1, 90, 0, 0, 2, 0, 41, 33, 4, 2, 9.9),
(9, 1, 90, 0, 0, 1, 0, 39, 31, 7, 5, 10.1),
(10, 1, 90, 0, 0, 0, 0, 44, 37, 9, 6, 10.7),
(11, 1, 90, 0, 0, 0, 0, 36, 29, 8, 5, 9.8),

-- Match 2 data  
(1, 2, 90, 1, 0, 4, 2, 42, 35, 2, 1, 10.9),
(2, 2, 90, 0, 1, 1, 0, 58, 51, 7, 5, 10.6),
(3, 2, 85, 0, 0, 0, 0, 54, 46, 11, 8, 11.1),
(4, 2, 90, 0, 0, 1, 1, 49, 42, 9, 6, 11.0),
(5, 2, 90, 0, 1, 2, 1, 38, 31, 4, 2, 10.3),
(6, 2, 90, 0, 0, 3, 2, 51, 44, 5, 3, 10.4),
(7, 2, 90, 0, 0, 2, 1, 53, 47, 3, 1, 10.6),
(8, 2, 90, 0, 0, 1, 0, 43, 36, 4, 2, 10.1),
(9, 2, 90, 0, 0, 0, 0, 41, 33, 8, 6, 10.3),
(10, 2, 90, 0, 0, 1, 0, 46, 39, 10, 7, 10.8),
(11, 2, 90, 0, 0, 0, 0, 38, 31, 9, 6, 9.9);
