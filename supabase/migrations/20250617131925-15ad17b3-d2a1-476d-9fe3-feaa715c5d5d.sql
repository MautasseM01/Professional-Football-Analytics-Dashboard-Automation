
-- Player Match Performance Data - Matches 1-5 with Realistic Football Statistics
-- Using ON CONFLICT to handle existing data safely
INSERT INTO player_match_performance (
  player_id, match_id, minutes_played, goals, assists, shots_total, shots_on_target,
  passes_attempted, passes_completed, pass_accuracy, tackles_attempted, tackles_won,
  interceptions, clearances, fouls_committed, fouls_suffered, yellow_cards, red_cards,
  corners_taken, crosses_attempted, crosses_completed, dribbles_attempted, dribbles_successful,
  aerial_duels_attempted, aerial_duels_won, distance_covered, sprint_distance, max_speed,
  touches, possession_lost, possession_won, match_rating, player_of_match, captain
) VALUES 
-- Match 1: Strong Performance vs Local Rivals (3-1 Win)
(1, 1, 90, 2, 0, 5, 3, 45, 38, 84.4, 2, 1, 1, 0, 1, 2, 0, 0, 0, 2, 1, 8, 6, 4, 3, 11.2, 1.8, 28.5, 52, 8, 12, 8.5, true, false),
(2, 1, 78, 1, 1, 3, 2, 52, 45, 86.5, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 6, 4, 2, 1, 10.8, 1.5, 27.2, 48, 6, 8, 8.2, false, false),
(4, 1, 90, 0, 2, 1, 1, 78, 68, 87.2, 3, 2, 4, 1, 2, 1, 1, 0, 2, 3, 2, 4, 3, 3, 2, 12.1, 2.2, 26.8, 89, 12, 15, 8.0, false, true),
(5, 1, 90, 0, 0, 2, 0, 72, 62, 86.1, 2, 2, 3, 2, 1, 0, 0, 0, 0, 4, 2, 5, 3, 2, 1, 11.8, 2.0, 25.9, 85, 10, 13, 7.5, false, false),
(7, 1, 90, 0, 0, 0, 0, 58, 52, 89.7, 8, 6, 5, 8, 2, 0, 1, 0, 0, 1, 0, 1, 0, 6, 5, 10.5, 1.2, 24.8, 67, 4, 8, 7.8, false, false),
(8, 1, 90, 0, 0, 0, 0, 64, 58, 90.6, 7, 5, 3, 6, 1, 0, 0, 0, 0, 0, 0, 0, 0, 4, 3, 10.9, 1.1, 24.2, 72, 3, 7, 7.9, false, false),
(10, 1, 90, 0, 0, 1, 0, 56, 48, 85.7, 4, 3, 2, 2, 0, 1, 0, 0, 0, 6, 3, 4, 2, 3, 2, 11.8, 2.4, 29.1, 68, 8, 11, 7.6, false, false),
(11, 1, 85, 0, 0, 0, 0, 49, 42, 85.7, 3, 2, 1, 1, 1, 2, 0, 0, 0, 5, 2, 3, 2, 2, 1, 11.2, 2.1, 28.7, 59, 7, 9, 7.4, false, false),
(12, 1, 90, 0, 0, 0, 0, 32, 28, 87.5, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 5.8, 0.4, 19.2, 35, 1, 0, 7.7, false, false),

-- Match 2: Tough Away Draw (1-1) - Defensive Performance
(1, 2, 85, 1, 0, 4, 2, 42, 35, 83.3, 1, 0, 0, 1, 2, 3, 1, 0, 0, 3, 1, 7, 4, 3, 2, 10.9, 1.6, 27.8, 48, 9, 6, 7.8, false, false),
(2, 2, 90, 0, 1, 2, 1, 48, 41, 85.4, 0, 0, 1, 0, 0, 2, 0, 0, 0, 2, 1, 5, 3, 1, 0, 11.2, 1.7, 26.5, 54, 8, 9, 7.5, false, false),
(4, 2, 90, 0, 1, 0, 0, 69, 58, 84.1, 4, 3, 3, 0, 1, 1, 0, 0, 1, 2, 1, 3, 2, 2, 1, 11.5, 1.9, 25.2, 82, 11, 14, 7.8, false, true),
(5, 2, 90, 0, 0, 1, 0, 65, 54, 83.1, 5, 4, 4, 3, 2, 0, 1, 0, 0, 1, 0, 2, 1, 3, 2, 11.9, 2.1, 24.8, 78, 9, 12, 7.2, false, false),
(7, 2, 90, 0, 0, 0, 0, 61, 55, 90.2, 9, 7, 6, 9, 1, 0, 0, 0, 0, 0, 0, 1, 0, 7, 6, 10.2, 0.9, 23.5, 69, 2, 6, 8.1, false, false),
(8, 2, 90, 0, 0, 1, 0, 62, 55, 88.7, 6, 4, 4, 6, 1, 0, 0, 0, 0, 0, 0, 0, 0, 5, 4, 10.8, 1.4, 23.9, 71, 6, 10, 7.5, false, false),
(10, 2, 90, 0, 0, 0, 0, 52, 44, 84.6, 6, 4, 3, 3, 2, 2, 1, 0, 0, 4, 1, 2, 1, 4, 3, 11.6, 2.2, 28.4, 63, 7, 8, 7.3, false, false),
(12, 2, 90, 0, 0, 0, 0, 28, 24, 85.7, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 5.2, 0.3, 18.5, 32, 2, 0, 7.9, true, false),

-- Match 3: Dominant Home Win (4-0) - Attacking Display
(1, 3, 75, 1, 1, 6, 4, 48, 42, 87.5, 1, 1, 0, 0, 0, 1, 0, 0, 0, 4, 2, 9, 7, 2, 1, 10.5, 1.9, 29.2, 55, 6, 10, 8.8, false, false),
(2, 3, 90, 2, 0, 5, 4, 55, 49, 89.1, 0, 0, 1, 0, 1, 3, 0, 0, 0, 3, 2, 7, 5, 1, 0, 11.4, 1.8, 28.1, 62, 8, 11, 9.2, true, false),
(3, 3, 65, 1, 0, 3, 2, 35, 30, 85.7, 2, 1, 1, 1, 1, 2, 0, 0, 0, 2, 1, 4, 3, 5, 4, 9.8, 1.4, 26.8, 41, 5, 7, 8.5, false, false),
(4, 3, 90, 0, 3, 2, 1, 85, 76, 89.4, 2, 1, 5, 0, 1, 0, 0, 0, 3, 5, 4, 6, 4, 2, 1, 12.8, 2.5, 25.7, 98, 8, 18, 9.0, false, true),
(5, 3, 90, 0, 0, 1, 1, 79, 71, 89.9, 3, 3, 2, 1, 0, 1, 0, 0, 0, 3, 2, 4, 3, 2, 1, 12.2, 2.0, 24.9, 92, 6, 15, 8.2, false, false),
(7, 3, 90, 0, 0, 0, 0, 65, 61, 93.8, 4, 3, 2, 4, 0, 0, 0, 0, 0, 1, 1, 0, 0, 3, 3, 10.1, 0.8, 22.8, 74, 1, 5, 8.0, false, false),
(10, 3, 90, 0, 0, 2, 1, 62, 55, 88.7, 2, 1, 1, 1, 0, 0, 0, 0, 0, 8, 5, 5, 3, 2, 1, 12.5, 2.8, 30.1, 75, 9, 13, 8.3, false, false),
(12, 3, 90, 0, 0, 0, 0, 35, 32, 91.4, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5.5, 0.2, 17.8, 38, 0, 0, 7.5, false, false),

-- Match 4: Cup Match Victory (2-1) - Rotation Squad
(6, 4, 90, 0, 1, 1, 0, 71, 62, 87.3, 4, 3, 5, 2, 2, 1, 1, 0, 2, 2, 1, 3, 2, 3, 2, 11.8, 1.9, 24.5, 84, 9, 16, 7.8, false, true),
(13, 4, 85, 1, 0, 4, 2, 41, 35, 85.4, 1, 0, 0, 0, 1, 2, 0, 0, 0, 5, 3, 6, 4, 2, 1, 10.9, 1.7, 27.9, 49, 7, 8, 8.1, false, false),
(14, 4, 75, 0, 1, 2, 1, 58, 51, 87.9, 2, 2, 3, 1, 0, 1, 0, 0, 1, 4, 3, 5, 4, 2, 1, 10.2, 1.6, 26.3, 67, 6, 11, 7.9, false, false),
(15, 4, 90, 0, 0, 0, 0, 73, 67, 91.8, 7, 5, 4, 3, 1, 0, 0, 0, 0, 1, 0, 2, 1, 4, 3, 11.5, 1.5, 23.2, 81, 4, 12, 7.6, false, false),
(16, 4, 90, 1, 0, 3, 2, 66, 58, 87.9, 3, 2, 2, 1, 1, 1, 0, 0, 0, 3, 2, 4, 3, 3, 2, 11.9, 2.1, 25.8, 78, 8, 14, 8.3, false, false),
(17, 4, 60, 0, 0, 2, 0, 28, 23, 82.1, 0, 0, 0, 0, 0, 3, 0, 0, 0, 6, 2, 8, 5, 1, 0, 8.7, 1.8, 29.5, 34, 6, 4, 7.4, false, false),
(18, 4, 90, 0, 0, 0, 0, 59, 54, 91.5, 6, 4, 3, 7, 2, 0, 1, 0, 0, 0, 0, 0, 0, 5, 4, 10.4, 1.0, 22.9, 68, 3, 7, 7.7, false, false),
(21, 4, 90, 0, 0, 0, 0, 26, 22, 84.6, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 4.9, 0.3, 16.8, 29, 1, 0, 7.1, false, false),

-- Match 5: Derby Win (3-2) - High Intensity Match
(1, 5, 90, 1, 0, 7, 3, 47, 39, 83.0, 3, 2, 1, 0, 2, 4, 1, 0, 0, 3, 1, 10, 6, 4, 2, 11.8, 2.1, 29.8, 58, 12, 15, 8.4, false, false),
(2, 5, 90, 2, 1, 6, 4, 51, 44, 86.3, 2, 1, 1, 0, 1, 2, 0, 0, 0, 4, 2, 8, 6, 3, 1, 11.5, 1.9, 28.7, 61, 9, 12, 9.1, true, false),
(4, 5, 90, 0, 2, 2, 1, 81, 69, 85.2, 4, 3, 6, 2, 3, 2, 1, 0, 4, 4, 3, 5, 3, 4, 3, 12.9, 2.7, 26.1, 95, 15, 20, 8.7, false, true),
(5, 5, 90, 0, 0, 1, 0, 74, 63, 85.1, 5, 4, 4, 3, 2, 1, 1, 0, 0, 2, 1, 3, 2, 3, 2, 12.4, 2.3, 25.4, 87, 11, 16, 7.9, false, false),
(7, 5, 90, 0, 0, 1, 0, 63, 56, 88.9, 9, 6, 4, 8, 3, 1, 2, 0, 0, 1, 0, 1, 0, 8, 6, 10.8, 1.3, 24.1, 72, 5, 9, 8.2, false, false),
(8, 5, 90, 0, 0, 0, 0, 67, 61, 91.0, 8, 6, 5, 7, 2, 0, 1, 0, 0, 0, 0, 0, 0, 6, 5, 11.1, 1.6, 24.7, 76, 4, 11, 8.0, false, false),
(10, 5, 85, 0, 0, 1, 0, 59, 50, 84.7, 5, 3, 2, 2, 1, 3, 0, 0, 0, 7, 3, 3, 2, 5, 4, 12.1, 2.6, 29.7, 71, 10, 12, 7.8, false, false),
(11, 5, 90, 0, 0, 0, 0, 54, 46, 85.2, 4, 3, 2, 2, 2, 1, 1, 0, 0, 6, 2, 4, 2, 3, 2, 11.7, 2.4, 28.9, 65, 8, 10, 7.6, false, false),
(12, 5, 90, 0, 0, 0, 0, 31, 27, 87.1, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 5.9, 0.5, 19.8, 36, 2, 0, 8.3, false, false)

ON CONFLICT (player_id, match_id) 
DO UPDATE SET
  minutes_played = EXCLUDED.minutes_played,
  goals = EXCLUDED.goals,
  assists = EXCLUDED.assists,
  shots_total = EXCLUDED.shots_total,
  shots_on_target = EXCLUDED.shots_on_target,
  passes_attempted = EXCLUDED.passes_attempted,
  passes_completed = EXCLUDED.passes_completed,
  pass_accuracy = EXCLUDED.pass_accuracy,
  tackles_attempted = EXCLUDED.tackles_attempted,
  tackles_won = EXCLUDED.tackles_won,
  interceptions = EXCLUDED.interceptions,
  clearances = EXCLUDED.clearances,
  fouls_committed = EXCLUDED.fouls_committed,
  fouls_suffered = EXCLUDED.fouls_suffered,
  yellow_cards = EXCLUDED.yellow_cards,
  red_cards = EXCLUDED.red_cards,
  corners_taken = EXCLUDED.corners_taken,
  crosses_attempted = EXCLUDED.crosses_attempted,
  crosses_completed = EXCLUDED.crosses_completed,
  dribbles_attempted = EXCLUDED.dribbles_attempted,
  dribbles_successful = EXCLUDED.dribbles_successful,
  aerial_duels_attempted = EXCLUDED.aerial_duels_attempted,
  aerial_duels_won = EXCLUDED.aerial_duels_won,
  distance_covered = EXCLUDED.distance_covered,
  sprint_distance = EXCLUDED.sprint_distance,
  max_speed = EXCLUDED.max_speed,
  touches = EXCLUDED.touches,
  possession_lost = EXCLUDED.possession_lost,
  possession_won = EXCLUDED.possession_won,
  match_rating = EXCLUDED.match_rating,
  player_of_match = EXCLUDED.player_of_match,
  captain = EXCLUDED.captain,
  updated_at = now();
