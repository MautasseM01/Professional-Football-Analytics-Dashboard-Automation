-- Insert sample development pathways
INSERT INTO player_development_pathways (player_id, current_level, target_level, pathway_stage, status, created_at, updated_at) VALUES
(1, 'First Team', 'First Team', 'Established', 'active', now(), now()),
(13, 'U23s', 'First Team', 'Development', 'active', now(), now()),
(14, 'Academy U18', 'U23s', 'Progression', 'active', now(), now()),
(46, 'Academy U15', 'Academy U18', 'Early Development', 'active', now(), now()),
(52, 'U23s', 'First Team', 'Development', 'active', now(), now());

-- Insert sample development milestones
INSERT INTO player_development_milestones (player_id, milestone_type, milestone_description, target_date, status, importance_level, created_at) VALUES
(1, 'Goalkeeping Excellence', 'Maintain 70%+ save rate for 10 consecutive games', '2024-06-30', 'in_progress', 4, now()),
(13, 'Defensive Consistency', 'Complete 90%+ passes for 5 consecutive matches', '2024-04-15', 'pending', 3, now()),
(13, 'Leadership Development', 'Captain youth team for full season', '2024-07-01', 'in_progress', 5, now()),
(14, 'First Team Debut', 'Make professional debut in competitive match', '2024-08-30', 'pending', 5, now()),
(14, 'Physical Development', 'Reach target weight of 75kg', '2024-03-30', 'completed', 3, now()),
(46, 'Technical Skills', 'Master weak foot shooting accuracy to 60%+', '2024-12-31', 'in_progress', 2, now()),
(52, 'Match Fitness', 'Complete 90 minutes in 3 consecutive matches', '2024-05-15', 'pending', 4, now());

-- Insert sample coach assessments  
INSERT INTO player_coach_assessments (player_id, assessment_date, overall_rating, technical_rating, tactical_rating, physical_rating, mental_rating, strengths, areas_for_improvement, development_notes, recommendation, created_at) VALUES
(1, '2024-01-15', 85, 90, 80, 85, 88, 'Excellent shot-stopping, commanding presence', 'Distribution accuracy, communication with defenders', 'Hamadi shows great potential as a first-team goalkeeper. Focus on building confidence with ball at feet.', 'Continue first team training', now()),
(13, '2024-01-10', 75, 72, 78, 80, 75, 'Strong in the air, good positioning', 'Ball control under pressure, passing range', 'Marc has solid defensive fundamentals. Work on technical skills to progress to first team.', 'Regular U23s matches', now()),
(14, '2024-01-12', 78, 85, 70, 72, 76, 'Pace, dribbling, finishing instinct', 'Physical strength, tactical awareness', 'Ibrahima has natural attacking talent. Needs physical development to handle senior football.', 'Gym program + tactical coaching', now());

-- Insert sample development recommendations
INSERT INTO player_development_recommendations (player_id, recommendation_type, focus_area, specific_recommendations, priority_level, status, target_completion_date, created_at) VALUES
(1, 'Technical', 'Distribution', 'Practice long-range passing drills 3x per week. Work with passing coach on accuracy under pressure.', 4, 'active', '2024-03-31', now()),
(13, 'Physical', 'Speed & Agility', 'Sprint training twice weekly. Agility ladder work before training sessions.', 3, 'active', '2024-04-30', now()),
(14, 'Tactical', 'Positioning', 'Study video analysis of top strikers. Practice movement in final third with first team.', 5, 'active', '2024-06-30', now()),
(46, 'Technical', 'Weak Foot', 'Daily weak foot practice - 50 touches minimum. Work with skills coach twice weekly.', 2, 'active', '2024-08-31', now()),
(52, 'Mental', 'Decision Making', 'Positional play workshops. Study game situations with video analysis.', 4, 'active', '2024-05-31', now());

-- Insert sample guardian communications
INSERT INTO player_guardian_communications (player_id, communication_date, communication_type, subject, content, guardian_name, guardian_email, staff_member_id, follow_up_required, created_at) VALUES
(14, '2024-01-08', 'email', 'Training Progress Update', 'Ibrahima is showing excellent progress in training. His technical skills are developing well and coaches are pleased with his attitude.', 'Mrs. C.', 'parent@email.com', null, false, now()),
(46, '2024-01-05', 'phone', 'Academic Support Meeting', 'Discussed Test Player99s academic needs. Arranged additional tutoring support for mathematics.', 'Mr. Player', 'guardian@email.com', null, true, now());

-- Insert sample educational progress
INSERT INTO player_educational_progress (player_id, academic_year, education_level, subjects_grades, attendance_percentage, academic_support_needed, tutor_assigned, behavioral_notes, created_at, updated_at) VALUES
(14, '2023-24', 'Year 11', '{"mathematics": "B", "english": "A", "science": "B+", "pe": "A*"}', 94.5, false, false, 'Excellent student, balances football and academics well', now(), now()),
(46, '2023-24', 'Year 9', '{"mathematics": "C", "english": "B", "science": "C+", "pe": "A"}', 87.2, true, true, 'Struggles with mathematics, improved significantly with tutoring support', now(), now());