
-- Goals Data with Realistic Match Scenarios and Narratives
INSERT INTO goals (
  match_id, player_id, assisted_by_player_id, minute, period, goal_type, body_part,
  distance_from_goal, x_coordinate, y_coordinate, description, is_penalty, is_free_kick,
  is_header, is_volley, difficulty_rating
) VALUES 
-- Match 1: 3-1 Win vs Local Rivals - Strong attacking display
(1, 1, 4, 23, 'First Half', 'Open Play', 'Right Foot', 12, 85, 45, 'Clinical low drive into bottom corner after perfect through ball from midfield', false, false, false, false, 7.5),
(1, 2, 4, 34, 'First Half', 'Open Play', 'Left Foot', 8, 88, 52, 'Close range finish from excellent cross, showing great positioning', false, false, false, false, 6.0),
(1, 1, 2, 67, 'Second Half', 'Open Play', 'Right Foot', 15, 82, 38, 'Magnificent curled shot from edge of area after quick combination play', false, false, false, false, 8.2),

-- Match 2: 1-1 Away Draw - Defensive battle with set piece goal
(2, 1, 4, 52, 'Second Half', 'Set Piece', 'Head', 6, 90, 48, 'Powerful header from corner kick, rising above two defenders', false, false, true, false, 6.8),

-- Match 3: 4-0 Dominant Home Win - Clinical finishing display
(3, 2, 1, 19, 'First Half', 'Open Play', 'Left Foot', 10, 86, 55, 'First time finish from perfectly weighted through ball', false, false, false, false, 7.8),
(3, 1, 4, 31, 'First Half', 'Open Play', 'Right Foot', 14, 84, 42, 'Composed finish after driving run into the box', false, false, false, false, 7.2),
(3, 3, 10, 58, 'Second Half', 'Open Play', 'Head', 5, 92, 50, 'Powerful header from pinpoint cross, unstoppable', false, false, true, false, 7.5),
(3, 2, 4, 73, 'Second Half', 'Open Play', 'Right Foot', 9, 87, 48, 'Cool finish after excellent team move', false, false, false, false, 7.0),

-- Match 4: 2-1 Cup Win - Rotation squad comes through
(4, 13, 14, 42, 'First Half', 'Open Play', 'Right Foot', 11, 86, 47, 'Well-taken finish from substitute showing great movement', false, false, false, false, 7.3),
(4, 16, 6, 78, 'Second Half', 'Open Play', 'Left Foot', 7, 89, 51, 'Clinical finish from close range after defensive error', false, false, false, false, 6.8),

-- Match 5: 3-2 Derby Win - High intensity thriller
(5, 1, 4, 12, 'First Half', 'Open Play', 'Right Foot', 14, 83, 46, 'Early opener sets the tone, excellent first touch and finish', false, false, false, false, 7.0),
(5, 2, 4, 29, 'First Half', 'Open Play', 'Left Foot', 9, 88, 53, 'Quick turn and finish in the box showing great technique', false, false, false, false, 7.5),
(5, 2, 1, 58, 'Second Half', 'Open Play', 'Right Foot', 12, 85, 44, 'Crucial second goal after patient buildup play', false, false, false, false, 7.8)

ON CONFLICT (id) DO NOTHING;

-- Corresponding Assists Data with Realistic Pass Types and Situations
INSERT INTO assists (
  match_id, player_id, goal_id, assist_type, pass_type, distance_of_pass, difficulty_rating
) VALUES 
-- Match 1 assists - Midfield creativity on display
(1, 4, (SELECT id FROM goals WHERE match_id = 1 AND player_id = 1 AND minute = 23), 'Pass', 'Through Ball', 25, 8.0),
(1, 4, (SELECT id FROM goals WHERE match_id = 1 AND player_id = 2 AND minute = 34), 'Cross', 'Cross from Right', 18, 7.2),
(1, 2, (SELECT id FROM goals WHERE match_id = 1 AND player_id = 1 AND minute = 67), 'Pass', 'Short Pass', 8, 6.5),

-- Match 2 assists - Set piece delivery
(2, 4, (SELECT id FROM goals WHERE match_id = 2 AND player_id = 1 AND minute = 52), 'Cross', 'Corner Kick', 12, 7.0),

-- Match 3 assists - Dominant performance with multiple assist providers
(3, 1, (SELECT id FROM goals WHERE match_id = 3 AND player_id = 2 AND minute = 19), 'Pass', 'Through Ball', 22, 7.8),
(3, 4, (SELECT id FROM goals WHERE match_id = 3 AND player_id = 1 AND minute = 31), 'Pass', 'Key Pass', 16, 7.0),
(3, 10, (SELECT id FROM goals WHERE match_id = 3 AND player_id = 3 AND minute = 58), 'Cross', 'Cross from Right', 15, 6.8),
(3, 4, (SELECT id FROM goals WHERE match_id = 3 AND player_id = 2 AND minute = 73), 'Pass', 'Through Ball', 20, 7.5),

-- Match 4 assists - Cup rotation showing squad depth
(4, 14, (SELECT id FROM goals WHERE match_id = 4 AND player_id = 13 AND minute = 42), 'Pass', 'Short Pass', 12, 6.5),
(4, 6, (SELECT id FROM goals WHERE match_id = 4 AND player_id = 16 AND minute = 78), 'Pass', 'Key Pass', 14, 7.2),

-- Match 5 assists - Derby intensity with quick passing
(5, 4, (SELECT id FROM goals WHERE match_id = 5 AND player_id = 1 AND minute = 12), 'Pass', 'Key Pass', 18, 7.5),
(5, 4, (SELECT id FROM goals WHERE match_id = 5 AND player_id = 2 AND minute = 29), 'Pass', 'Short Pass', 10, 6.8),
(5, 1, (SELECT id FROM goals WHERE match_id = 5 AND player_id = 2 AND minute = 58), 'Pass', 'Through Ball', 24, 8.2)

ON CONFLICT (id) DO NOTHING;
