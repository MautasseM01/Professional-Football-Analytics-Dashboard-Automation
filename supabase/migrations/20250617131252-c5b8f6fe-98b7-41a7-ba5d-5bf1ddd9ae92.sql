
-- Enhanced Player Attributes with Position-Specific Realistic Ratings for all 24 players
INSERT INTO player_attributes (
  player_id, finishing, aerial_duels_won, holdup_play, pace, work_rate_attacking,
  speed, acceleration, agility, strength, stamina, jumping, heading, crossing,
  passing, dribbling, ball_control, tackling, marking, positioning, vision,
  decision_making, mental_strength, leadership, communication, work_rate_defensive,
  preferred_foot, weak_foot_rating, skill_moves_rating
) VALUES 
-- Forwards/Strikers (High finishing, pace, dribbling)
(1, 85, 75, 82, 88, 85, 87, 89, 86, 78, 85, 72, 75, 65, 75, 88, 87, 45, 50, 75, 78, 82, 80, 85, 75, 70, 'Right', 3, 4),
(2, 88, 80, 85, 85, 88, 84, 87, 84, 82, 88, 78, 80, 70, 78, 85, 89, 48, 52, 78, 82, 85, 85, 88, 78, 68, 'Left', 4, 5),
(3, 82, 85, 88, 75, 82, 76, 78, 78, 88, 82, 88, 88, 75, 80, 75, 82, 55, 58, 82, 75, 80, 82, 80, 82, 75, 'Right', 3, 3),

-- Creative Midfielders (High passing, vision, work rate)
(4, 65, 70, 70, 82, 88, 80, 82, 85, 75, 92, 68, 70, 82, 92, 88, 90, 78, 75, 88, 92, 90, 88, 92, 90, 85, 'Right', 4, 4),
(5, 68, 72, 72, 85, 85, 83, 85, 88, 78, 88, 70, 72, 85, 89, 85, 88, 82, 78, 85, 89, 88, 85, 88, 88, 88, 'Left', 4, 3),
(6, 62, 68, 68, 78, 82, 79, 80, 82, 82, 85, 72, 75, 78, 85, 82, 85, 85, 82, 88, 85, 85, 82, 85, 85, 92, 'Right', 3, 2),

-- Centre-backs (High tackling, marking, strength)
(7, 45, 88, 75, 72, 65, 70, 72, 75, 92, 85, 85, 88, 58, 78, 65, 75, 92, 92, 88, 75, 88, 90, 88, 92, 95, 'Right', 2, 2),
(8, 48, 85, 78, 75, 68, 73, 75, 78, 89, 88, 82, 85, 62, 82, 68, 78, 89, 89, 85, 78, 85, 88, 85, 89, 92, 'Left', 3, 2),
(9, 42, 90, 82, 68, 62, 68, 70, 72, 95, 82, 88, 90, 55, 80, 62, 72, 95, 95, 92, 72, 82, 92, 82, 95, 98, 'Right', 2, 1),

-- Fullbacks (Balance of attack/defense, pace)
(10, 58, 75, 68, 88, 85, 86, 88, 88, 78, 92, 75, 72, 88, 85, 82, 85, 82, 85, 82, 82, 85, 82, 82, 88, 85, 'Right', 4, 3),
(11, 55, 72, 65, 85, 88, 84, 86, 85, 75, 89, 72, 70, 85, 82, 85, 82, 85, 82, 85, 85, 82, 80, 85, 85, 88, 'Left', 3, 4),

-- Goalkeeper (Specialized ratings)
(12, 25, 45, 35, 55, 25, 52, 55, 70, 85, 75, 78, 65, 35, 65, 45, 70, 35, 75, 92, 85, 92, 95, 95, 95, 45, 'Right', 3, 1),

-- Versatile Forward/Winger
(13, 75, 78, 75, 82, 82, 81, 83, 82, 80, 80, 75, 78, 68, 78, 82, 82, 58, 62, 78, 80, 78, 78, 78, 75, 72, 'Right', 3, 3),

-- Attacking Midfielder
(14, 70, 75, 72, 85, 80, 83, 85, 85, 75, 85, 72, 75, 75, 82, 85, 85, 62, 65, 80, 82, 82, 80, 80, 78, 75, 'Left', 3, 3),

-- Defensive Midfielder
(15, 58, 82, 75, 75, 72, 74, 76, 78, 88, 85, 80, 82, 65, 80, 72, 78, 88, 88, 85, 78, 82, 85, 82, 85, 88, 'Right', 2, 2),

-- Box-to-Box Midfielder
(16, 62, 70, 68, 80, 85, 79, 81, 85, 78, 88, 70, 72, 80, 85, 85, 85, 75, 72, 82, 85, 85, 82, 85, 82, 85, 'Right', 4, 3),

-- Pacey Winger
(17, 78, 75, 78, 88, 85, 86, 88, 88, 75, 85, 72, 75, 72, 80, 88, 88, 55, 58, 75, 82, 82, 82, 82, 78, 70, 'Left', 4, 4),

-- Squad Centre-back
(18, 52, 88, 80, 70, 65, 69, 71, 75, 92, 82, 85, 88, 58, 78, 65, 75, 92, 92, 88, 75, 85, 88, 85, 92, 92, 'Right', 2, 2),

-- Squad Midfielder
(19, 68, 72, 70, 82, 82, 81, 83, 82, 78, 85, 70, 72, 78, 85, 82, 85, 72, 75, 82, 85, 82, 80, 82, 80, 82, 'Right', 3, 3),

-- Squad Versatile Player
(20, 65, 75, 72, 80, 80, 79, 81, 80, 82, 82, 75, 78, 75, 82, 80, 82, 75, 78, 80, 82, 80, 78, 80, 82, 80, 'Right', 3, 3),

-- Reserve Goalkeeper
(21, 20, 40, 30, 50, 20, 48, 50, 65, 80, 70, 75, 60, 30, 60, 40, 65, 30, 70, 88, 80, 88, 90, 90, 88, 40, 'Left', 2, 1),

-- Young Striker
(22, 78, 70, 75, 90, 85, 88, 90, 88, 70, 80, 68, 70, 60, 70, 85, 85, 40, 45, 70, 75, 75, 75, 70, 70, 65, 'Right', 2, 3),

-- Young Defender
(23, 35, 75, 65, 78, 60, 76, 78, 80, 85, 78, 78, 80, 50, 70, 60, 70, 85, 85, 80, 70, 75, 78, 75, 80, 85, 'Right', 2, 2),

-- Squad Winger
(24, 72, 65, 68, 85, 82, 84, 86, 85, 72, 82, 68, 68, 78, 78, 85, 82, 50, 55, 75, 78, 78, 75, 75, 75, 70, 'Left', 3, 3);
