
-- Match Ratings for Tactical Analysis - Update existing or insert new
INSERT INTO match_ratings (
  match_id, overall_performance, tactical_execution, physical_performance, mental_strength,
  team_cohesion, defensive_rating, attacking_rating, possession_rating, set_pieces_rating,
  goalkeeper_rating, man_of_match_player_id, coach_rating, opponent_difficulty,
  match_importance, notes, analyst_comments
) VALUES 
(1, 8.2, 8.5, 8.0, 8.3, 8.1, 7.8, 8.8, 8.2, 7.5, 7.5, 1, 8.0, 6.5, 7.0, 
 'Dominant performance against local rivals', 'Excellent attacking display, clinical finishing. Midfield controlled tempo well.'),

(2, 6.8, 7.0, 7.2, 7.5, 6.5, 7.8, 6.0, 6.5, 6.2, 7.2, 4, 6.8, 8.0, 8.5,
 'Hard-fought draw away from home', 'Solid defensive performance. Struggled to create clear chances against organized defense.'),

(3, 7.5, 7.8, 7.2, 7.0, 7.8, 8.0, 7.2, 7.5, 8.2, 8.0, 2, 7.5, 5.5, 6.0,
 'Professional home win', 'Good control of the game. Set piece defending needs improvement.'),

(4, 5.8, 5.5, 6.2, 5.0, 5.8, 5.2, 6.5, 5.8, 5.0, 6.0, 2, 5.5, 8.5, 7.5,
 'Disappointing away defeat', 'Poor defensive organization. Midfield overrun in second half. Positive attacking moments.'),

(5, 8.5, 8.0, 8.2, 8.8, 8.5, 7.5, 9.2, 8.0, 8.5, 7.8, 1, 8.2, 6.0, 8.0,
 'Thrilling home victory', 'Outstanding attacking performance. Great character shown after going behind. Excellent set piece execution.')
ON CONFLICT (match_id) DO UPDATE SET
  overall_performance = EXCLUDED.overall_performance,
  tactical_execution = EXCLUDED.tactical_execution,
  physical_performance = EXCLUDED.physical_performance,
  mental_strength = EXCLUDED.mental_strength,
  team_cohesion = EXCLUDED.team_cohesion,
  defensive_rating = EXCLUDED.defensive_rating,
  attacking_rating = EXCLUDED.attacking_rating,
  possession_rating = EXCLUDED.possession_rating,
  set_pieces_rating = EXCLUDED.set_pieces_rating,
  goalkeeper_rating = EXCLUDED.goalkeeper_rating,
  man_of_match_player_id = EXCLUDED.man_of_match_player_id,
  coach_rating = EXCLUDED.coach_rating,
  opponent_difficulty = EXCLUDED.opponent_difficulty,
  match_importance = EXCLUDED.match_importance,
  notes = EXCLUDED.notes,
  analyst_comments = EXCLUDED.analyst_comments,
  updated_at = now();
