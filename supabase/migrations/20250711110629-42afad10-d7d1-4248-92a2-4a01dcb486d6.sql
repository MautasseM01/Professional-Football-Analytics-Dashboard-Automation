-- Insert sample AI analytics data into match_analysis table
INSERT INTO match_analysis (
  match_id, 
  date, 
  analysis_method, 
  video_source, 
  analysis_data
) VALUES (
  'test_veo_001',
  '2025-01-11T15:00:00',
  'yolo',
  'veo_camera',
  '{
    "team_stats": {
      "formation": "4-3-3",
      "possession": 57.8,
      "total_distance": 100.4,
      "passing_accuracy": 80.6
    },
    "players": [
      {"name": "Player 1", "position": "GK", "distance_covered": 4.2, "sprint_count": 3, "pass_completion": 92.1},
      {"name": "Player 2", "position": "LB", "distance_covered": 9.7, "sprint_count": 28, "pass_completion": 81.3},
      {"name": "Player 3", "position": "CB", "distance_covered": 7.8, "sprint_count": 12, "pass_completion": 88.5},
      {"name": "Player 4", "position": "CB", "distance_covered": 7.6, "sprint_count": 11, "pass_completion": 87.2},
      {"name": "Player 5", "position": "RB", "distance_covered": 11.5, "sprint_count": 26, "pass_completion": 86.5},
      {"name": "Player 6", "position": "CDM", "distance_covered": 10.3, "sprint_count": 18, "pass_completion": 85.4},
      {"name": "Player 7", "position": "CM", "distance_covered": 11.8, "sprint_count": 31, "pass_completion": 84.7},
      {"name": "Player 8", "position": "CM", "distance_covered": 10.8, "sprint_count": 24, "pass_completion": 79.3},
      {"name": "Player 9", "position": "LW", "distance_covered": 11.4, "sprint_count": 34, "pass_completion": 74.8},
      {"name": "Player 10", "position": "ST", "distance_covered": 9.2, "sprint_count": 38, "pass_completion": 71.2},
      {"name": "Player 11", "position": "RW", "distance_covered": 10.1, "sprint_count": 36, "pass_completion": 73.6}
    ],
    "key_events": [
      {"type": "kickoff", "minute": 0},
      {"type": "shot", "minute": 12, "player": "Player 9"},
      {"type": "goal", "minute": 23, "player": "Player 10"},
      {"type": "yellow_card", "minute": 45, "player": "Player 5"},
      {"type": "substitution", "minute": 65}
    ],
    "processing_stats": {
      "total_detections": 74579,
      "avg_players_detected": 10.9,
      "duration_analyzed": 7101.7,
      "detection_confidence": 0.515
    }
  }'::jsonb
);