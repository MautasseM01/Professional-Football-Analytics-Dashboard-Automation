export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      assists: {
        Row: {
          assist_type: string | null
          assists_before_goal: number | null
          created_at: string | null
          difficulty_rating: number | null
          distance_of_pass: number | null
          goal_id: number
          id: number
          match_id: number
          pass_type: string | null
          player_id: number
        }
        Insert: {
          assist_type?: string | null
          assists_before_goal?: number | null
          created_at?: string | null
          difficulty_rating?: number | null
          distance_of_pass?: number | null
          goal_id: number
          id?: number
          match_id: number
          pass_type?: string | null
          player_id: number
        }
        Update: {
          assist_type?: string | null
          assists_before_goal?: number | null
          created_at?: string | null
          difficulty_rating?: number | null
          distance_of_pass?: number | null
          goal_id?: number
          id?: number
          match_id?: number
          pass_type?: string | null
          player_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "assists_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: true
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assists_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "match_player_context"
            referencedColumns: ["match_id"]
          },
          {
            foreignKeyName: "assists_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assists_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "current_squad"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assists_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "enhanced_player_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assists_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_season_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assists_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_assists_player"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "current_squad"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_assists_player"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "enhanced_player_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_assists_player"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_season_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_assists_player"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          details: string | null
          id: number
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: string | null
          id?: number
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: string | null
          id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      development_assessments: {
        Row: {
          assessment_date: string | null
          assessor_id: string | null
          created_at: string | null
          id: number
          notes: string | null
          overall_progress_percentage: number | null
          player_id: number | null
        }
        Insert: {
          assessment_date?: string | null
          assessor_id?: string | null
          created_at?: string | null
          id?: number
          notes?: string | null
          overall_progress_percentage?: number | null
          player_id?: number | null
        }
        Update: {
          assessment_date?: string | null
          assessor_id?: string | null
          created_at?: string | null
          id?: number
          notes?: string | null
          overall_progress_percentage?: number | null
          player_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "development_assessments_assessor_id_fkey"
            columns: ["assessor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "development_assessments_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "current_squad"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "development_assessments_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "enhanced_player_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "development_assessments_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_season_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "development_assessments_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      development_targets: {
        Row: {
          category: string | null
          created_at: string | null
          created_by: string | null
          current_value: number | null
          id: number
          player_id: number | null
          status: string | null
          target_date: string | null
          target_description: string
          target_value: number | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          current_value?: number | null
          id?: number
          player_id?: number | null
          status?: string | null
          target_date?: string | null
          target_description: string
          target_value?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          current_value?: number | null
          id?: number
          player_id?: number | null
          status?: string | null
          target_date?: string | null
          target_description?: string
          target_value?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "development_targets_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "development_targets_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "current_squad"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "development_targets_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "enhanced_player_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "development_targets_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_season_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "development_targets_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          assisted_by_player_id: number | null
          body_part: string | null
          celebration_type: string | null
          created_at: string | null
          description: string | null
          difficulty_rating: number | null
          distance_from_goal: number | null
          goal_type: string | null
          id: number
          is_free_kick: boolean | null
          is_header: boolean | null
          is_own_goal: boolean | null
          is_penalty: boolean | null
          is_volley: boolean | null
          match_id: number
          minute: number
          period: string | null
          player_id: number
          video_timestamp: number | null
          x_coordinate: number | null
          y_coordinate: number | null
        }
        Insert: {
          assisted_by_player_id?: number | null
          body_part?: string | null
          celebration_type?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_rating?: number | null
          distance_from_goal?: number | null
          goal_type?: string | null
          id?: number
          is_free_kick?: boolean | null
          is_header?: boolean | null
          is_own_goal?: boolean | null
          is_penalty?: boolean | null
          is_volley?: boolean | null
          match_id: number
          minute: number
          period?: string | null
          player_id: number
          video_timestamp?: number | null
          x_coordinate?: number | null
          y_coordinate?: number | null
        }
        Update: {
          assisted_by_player_id?: number | null
          body_part?: string | null
          celebration_type?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_rating?: number | null
          distance_from_goal?: number | null
          goal_type?: string | null
          id?: number
          is_free_kick?: boolean | null
          is_header?: boolean | null
          is_own_goal?: boolean | null
          is_penalty?: boolean | null
          is_volley?: boolean | null
          match_id?: number
          minute?: number
          period?: string | null
          player_id?: number
          video_timestamp?: number | null
          x_coordinate?: number | null
          y_coordinate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_goals_assisted_by_player"
            columns: ["assisted_by_player_id"]
            isOneToOne: false
            referencedRelation: "current_squad"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_goals_assisted_by_player"
            columns: ["assisted_by_player_id"]
            isOneToOne: false
            referencedRelation: "enhanced_player_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_goals_assisted_by_player"
            columns: ["assisted_by_player_id"]
            isOneToOne: false
            referencedRelation: "player_season_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_goals_assisted_by_player"
            columns: ["assisted_by_player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goals_assisted_by_fkey"
            columns: ["assisted_by_player_id"]
            isOneToOne: false
            referencedRelation: "current_squad"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goals_assisted_by_fkey"
            columns: ["assisted_by_player_id"]
            isOneToOne: false
            referencedRelation: "enhanced_player_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goals_assisted_by_fkey"
            columns: ["assisted_by_player_id"]
            isOneToOne: false
            referencedRelation: "player_season_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goals_assisted_by_fkey"
            columns: ["assisted_by_player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goals_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "match_player_context"
            referencedColumns: ["match_id"]
          },
          {
            foreignKeyName: "goals_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goals_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "current_squad"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goals_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "enhanced_player_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goals_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_season_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goals_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      jersey_administrative_log: {
        Row: {
          assigned_jersey: number | null
          commercial_impact_score: number | null
          conflict_with_player_id: number | null
          decided_by: string | null
          decision_reason: string | null
          decision_timestamp: string | null
          decision_type: string | null
          id: number
          notes: string | null
          player_id: number | null
          priority_score: number | null
          requested_jersey: number | null
          requires_human_review: boolean | null
          resolution_method: string | null
          season: string | null
        }
        Insert: {
          assigned_jersey?: number | null
          commercial_impact_score?: number | null
          conflict_with_player_id?: number | null
          decided_by?: string | null
          decision_reason?: string | null
          decision_timestamp?: string | null
          decision_type?: string | null
          id?: number
          notes?: string | null
          player_id?: number | null
          priority_score?: number | null
          requested_jersey?: number | null
          requires_human_review?: boolean | null
          resolution_method?: string | null
          season?: string | null
        }
        Update: {
          assigned_jersey?: number | null
          commercial_impact_score?: number | null
          conflict_with_player_id?: number | null
          decided_by?: string | null
          decision_reason?: string | null
          decision_timestamp?: string | null
          decision_type?: string | null
          id?: number
          notes?: string | null
          player_id?: number | null
          priority_score?: number | null
          requested_jersey?: number | null
          requires_human_review?: boolean | null
          resolution_method?: string | null
          season?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jersey_administrative_log_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "current_squad"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jersey_administrative_log_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "enhanced_player_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jersey_administrative_log_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_season_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jersey_administrative_log_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      league_benchmarks: {
        Row: {
          id: number
          league_average: number | null
          metric_name: string
          position: string | null
          season: string | null
          top_10_percentile: number | null
          top_25_percentile: number | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          league_average?: number | null
          metric_name: string
          position?: string | null
          season?: string | null
          top_10_percentile?: number | null
          top_25_percentile?: number | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          league_average?: number | null
          metric_name?: string
          position?: string | null
          season?: string | null
          top_10_percentile?: number | null
          top_25_percentile?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      match_analysis: {
        Row: {
          analysis_data: Json
          analysis_method: string
          created_at: string | null
          date: string
          id: string
          match_id: string
          processing_time: number | null
          updated_at: string | null
          video_source: string | null
        }
        Insert: {
          analysis_data: Json
          analysis_method: string
          created_at?: string | null
          date: string
          id?: string
          match_id: string
          processing_time?: number | null
          updated_at?: string | null
          video_source?: string | null
        }
        Update: {
          analysis_data?: Json
          analysis_method?: string
          created_at?: string | null
          date?: string
          id?: string
          match_id?: string
          processing_time?: number | null
          updated_at?: string | null
          video_source?: string | null
        }
        Relationships: []
      }
      match_passes: {
        Row: {
          created_at: string | null
          direction: string
          from_player_id: number
          id: number
          match_id: number
          outcome: string
          to_player_id: number
        }
        Insert: {
          created_at?: string | null
          direction: string
          from_player_id: number
          id?: number
          match_id: number
          outcome: string
          to_player_id: number
        }
        Update: {
          created_at?: string | null
          direction?: string
          from_player_id?: number
          id?: number
          match_id?: number
          outcome?: string
          to_player_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "match_passes_from_player_id_fkey"
            columns: ["from_player_id"]
            isOneToOne: false
            referencedRelation: "current_squad"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_passes_from_player_id_fkey"
            columns: ["from_player_id"]
            isOneToOne: false
            referencedRelation: "enhanced_player_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_passes_from_player_id_fkey"
            columns: ["from_player_id"]
            isOneToOne: false
            referencedRelation: "player_season_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_passes_from_player_id_fkey"
            columns: ["from_player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_passes_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "match_player_context"
            referencedColumns: ["match_id"]
          },
          {
            foreignKeyName: "match_passes_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_passes_to_player_id_fkey"
            columns: ["to_player_id"]
            isOneToOne: false
            referencedRelation: "current_squad"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_passes_to_player_id_fkey"
            columns: ["to_player_id"]
            isOneToOne: false
            referencedRelation: "enhanced_player_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_passes_to_player_id_fkey"
            columns: ["to_player_id"]
            isOneToOne: false
            referencedRelation: "player_season_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_passes_to_player_id_fkey"
            columns: ["to_player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      match_ratings: {
        Row: {
          analyst_comments: string | null
          attacking_rating: number | null
          coach_rating: number | null
          created_at: string | null
          crowd_impact: number | null
          defensive_rating: number | null
          goalkeeper_rating: number | null
          id: number
          man_of_match_player_id: number | null
          match_id: number
          match_importance: number | null
          mental_strength: number | null
          notes: string | null
          opponent_difficulty: number | null
          overall_performance: number | null
          physical_performance: number | null
          possession_rating: number | null
          referee_impact: number | null
          set_pieces_rating: number | null
          tactical_execution: number | null
          team_cohesion: number | null
          updated_at: string | null
          weather_impact: number | null
          worst_performer_player_id: number | null
        }
        Insert: {
          analyst_comments?: string | null
          attacking_rating?: number | null
          coach_rating?: number | null
          created_at?: string | null
          crowd_impact?: number | null
          defensive_rating?: number | null
          goalkeeper_rating?: number | null
          id?: number
          man_of_match_player_id?: number | null
          match_id: number
          match_importance?: number | null
          mental_strength?: number | null
          notes?: string | null
          opponent_difficulty?: number | null
          overall_performance?: number | null
          physical_performance?: number | null
          possession_rating?: number | null
          referee_impact?: number | null
          set_pieces_rating?: number | null
          tactical_execution?: number | null
          team_cohesion?: number | null
          updated_at?: string | null
          weather_impact?: number | null
          worst_performer_player_id?: number | null
        }
        Update: {
          analyst_comments?: string | null
          attacking_rating?: number | null
          coach_rating?: number | null
          created_at?: string | null
          crowd_impact?: number | null
          defensive_rating?: number | null
          goalkeeper_rating?: number | null
          id?: number
          man_of_match_player_id?: number | null
          match_id?: number
          match_importance?: number | null
          mental_strength?: number | null
          notes?: string | null
          opponent_difficulty?: number | null
          overall_performance?: number | null
          physical_performance?: number | null
          possession_rating?: number | null
          referee_impact?: number | null
          set_pieces_rating?: number | null
          tactical_execution?: number | null
          team_cohesion?: number | null
          updated_at?: string | null
          weather_impact?: number | null
          worst_performer_player_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "match_ratings_man_of_match_fkey"
            columns: ["man_of_match_player_id"]
            isOneToOne: false
            referencedRelation: "current_squad"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_ratings_man_of_match_fkey"
            columns: ["man_of_match_player_id"]
            isOneToOne: false
            referencedRelation: "enhanced_player_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_ratings_man_of_match_fkey"
            columns: ["man_of_match_player_id"]
            isOneToOne: false
            referencedRelation: "player_season_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_ratings_man_of_match_fkey"
            columns: ["man_of_match_player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_ratings_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: true
            referencedRelation: "match_player_context"
            referencedColumns: ["match_id"]
          },
          {
            foreignKeyName: "match_ratings_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: true
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_ratings_worst_performer_fkey"
            columns: ["worst_performer_player_id"]
            isOneToOne: false
            referencedRelation: "current_squad"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_ratings_worst_performer_fkey"
            columns: ["worst_performer_player_id"]
            isOneToOne: false
            referencedRelation: "enhanced_player_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_ratings_worst_performer_fkey"
            columns: ["worst_performer_player_id"]
            isOneToOne: false
            referencedRelation: "player_season_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_ratings_worst_performer_fkey"
            columns: ["worst_performer_player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          attendance: number | null
          away_score: number | null
          away_team: string | null
          competition: string | null
          created_at: string | null
          date: string
          home_score: number | null
          home_team: string | null
          id: number
          location: string
          match_duration: number | null
          match_status: string | null
          opponent: string
          referee: string | null
          result: string
          updated_at: string | null
          weather_conditions: string | null
        }
        Insert: {
          attendance?: number | null
          away_score?: number | null
          away_team?: string | null
          competition?: string | null
          created_at?: string | null
          date: string
          home_score?: number | null
          home_team?: string | null
          id?: number
          location: string
          match_duration?: number | null
          match_status?: string | null
          opponent: string
          referee?: string | null
          result: string
          updated_at?: string | null
          weather_conditions?: string | null
        }
        Update: {
          attendance?: number | null
          away_score?: number | null
          away_team?: string | null
          competition?: string | null
          created_at?: string | null
          date?: string
          home_score?: number | null
          home_team?: string | null
          id?: number
          location?: string
          match_duration?: number | null
          match_status?: string | null
          opponent?: string
          referee?: string | null
          result?: string
          updated_at?: string | null
          weather_conditions?: string | null
        }
        Relationships: []
      }
      performance_kpis: {
        Row: {
          calculation_date: string | null
          created_at: string | null
          current_value: number | null
          id: number
          kpi_name: string
          league_percentile: number | null
          player_id: number | null
          status: string | null
          target_value: number | null
        }
        Insert: {
          calculation_date?: string | null
          created_at?: string | null
          current_value?: number | null
          id?: number
          kpi_name: string
          league_percentile?: number | null
          player_id?: number | null
          status?: string | null
          target_value?: number | null
        }
        Update: {
          calculation_date?: string | null
          created_at?: string | null
          current_value?: number | null
          id?: number
          kpi_name?: string
          league_percentile?: number | null
          player_id?: number | null
          status?: string | null
          target_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "performance_kpis_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "current_squad"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_kpis_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "enhanced_player_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_kpis_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_season_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_kpis_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      pipeline_status: {
        Row: {
          id: number
          last_update: string | null
          service_name: string
          status: string | null
        }
        Insert: {
          id?: number
          last_update?: string | null
          service_name: string
          status?: string | null
        }
        Update: {
          id?: number
          last_update?: string | null
          service_name?: string
          status?: string | null
        }
        Relationships: []
      }
      player_attributes: {
        Row: {
          acceleration: number | null
          aerial_duels_won: number
          agility: number | null
          ball_control: number | null
          communication: number | null
          created_at: string | null
          crossing: number | null
          decision_making: number | null
          dribbling: number | null
          finishing: number
          heading: number | null
          holdup_play: number
          id: number
          jumping: number | null
          leadership: number | null
          marking: number | null
          mental_strength: number | null
          pace: number
          passing: number | null
          player_id: number
          positioning: number | null
          preferred_foot: string | null
          skill_moves_rating: number | null
          speed: number | null
          stamina: number | null
          strength: number | null
          tackling: number | null
          updated_at: string | null
          vision: number | null
          weak_foot_rating: number | null
          work_rate_attacking: number
          work_rate_defensive: number | null
        }
        Insert: {
          acceleration?: number | null
          aerial_duels_won: number
          agility?: number | null
          ball_control?: number | null
          communication?: number | null
          created_at?: string | null
          crossing?: number | null
          decision_making?: number | null
          dribbling?: number | null
          finishing: number
          heading?: number | null
          holdup_play: number
          id?: number
          jumping?: number | null
          leadership?: number | null
          marking?: number | null
          mental_strength?: number | null
          pace: number
          passing?: number | null
          player_id: number
          positioning?: number | null
          preferred_foot?: string | null
          skill_moves_rating?: number | null
          speed?: number | null
          stamina?: number | null
          strength?: number | null
          tackling?: number | null
          updated_at?: string | null
          vision?: number | null
          weak_foot_rating?: number | null
          work_rate_attacking: number
          work_rate_defensive?: number | null
        }
        Update: {
          acceleration?: number | null
          aerial_duels_won?: number
          agility?: number | null
          ball_control?: number | null
          communication?: number | null
          created_at?: string | null
          crossing?: number | null
          decision_making?: number | null
          dribbling?: number | null
          finishing?: number
          heading?: number | null
          holdup_play?: number
          id?: number
          jumping?: number | null
          leadership?: number | null
          marking?: number | null
          mental_strength?: number | null
          pace?: number
          passing?: number | null
          player_id?: number
          positioning?: number | null
          preferred_foot?: string | null
          skill_moves_rating?: number | null
          speed?: number | null
          stamina?: number | null
          strength?: number | null
          tackling?: number | null
          updated_at?: string | null
          vision?: number | null
          weak_foot_rating?: number | null
          work_rate_attacking?: number
          work_rate_defensive?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "player_attributes_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "current_squad"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_attributes_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "enhanced_player_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_attributes_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_season_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_attributes_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      player_coach_assessments: {
        Row: {
          areas_for_improvement: string | null
          assessment_date: string
          coach_id: string | null
          created_at: string | null
          development_notes: string | null
          id: number
          mental_rating: number | null
          overall_rating: number | null
          physical_rating: number | null
          player_id: number | null
          recommendation: string | null
          strengths: string | null
          tactical_rating: number | null
          technical_rating: number | null
        }
        Insert: {
          areas_for_improvement?: string | null
          assessment_date: string
          coach_id?: string | null
          created_at?: string | null
          development_notes?: string | null
          id?: number
          mental_rating?: number | null
          overall_rating?: number | null
          physical_rating?: number | null
          player_id?: number | null
          recommendation?: string | null
          strengths?: string | null
          tactical_rating?: number | null
          technical_rating?: number | null
        }
        Update: {
          areas_for_improvement?: string | null
          assessment_date?: string
          coach_id?: string | null
          created_at?: string | null
          development_notes?: string | null
          id?: number
          mental_rating?: number | null
          overall_rating?: number | null
          physical_rating?: number | null
          player_id?: number | null
          recommendation?: string | null
          strengths?: string | null
          tactical_rating?: number | null
          technical_rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "player_coach_assessments_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_coach_assessments_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "current_squad"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_coach_assessments_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "enhanced_player_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_coach_assessments_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_season_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_coach_assessments_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      player_contracts: {
        Row: {
          contract_end_date: string | null
          contract_start_date: string | null
          contract_type: string | null
          created_at: string | null
          id: number
          player_id: number | null
          salary_per_week: number | null
          status: string | null
        }
        Insert: {
          contract_end_date?: string | null
          contract_start_date?: string | null
          contract_type?: string | null
          created_at?: string | null
          id?: number
          player_id?: number | null
          salary_per_week?: number | null
          status?: string | null
        }
        Update: {
          contract_end_date?: string | null
          contract_start_date?: string | null
          contract_type?: string | null
          created_at?: string | null
          id?: number
          player_id?: number | null
          salary_per_week?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "player_contracts_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "current_squad"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_contracts_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "enhanced_player_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_contracts_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_season_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_contracts_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      player_development_goals: {
        Row: {
          coach_id: string | null
          created_at: string | null
          goal_description: string | null
          id: number
          player_id: number | null
          priority: string | null
          status: string | null
          target_date: string | null
        }
        Insert: {
          coach_id?: string | null
          created_at?: string | null
          goal_description?: string | null
          id?: number
          player_id?: number | null
          priority?: string | null
          status?: string | null
          target_date?: string | null
        }
        Update: {
          coach_id?: string | null
          created_at?: string | null
          goal_description?: string | null
          id?: number
          player_id?: number | null
          priority?: string | null
          status?: string | null
          target_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "player_development_goals_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_development_goals_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "current_squad"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_development_goals_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "enhanced_player_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_development_goals_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_season_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_development_goals_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      player_development_milestones: {
        Row: {
          coach_id: string | null
          completed_date: string | null
          created_at: string | null
          id: number
          importance_level: number | null
          milestone_description: string | null
          milestone_type: string
          player_id: number | null
          status: string | null
          target_date: string | null
        }
        Insert: {
          coach_id?: string | null
          completed_date?: string | null
          created_at?: string | null
          id?: number
          importance_level?: number | null
          milestone_description?: string | null
          milestone_type: string
          player_id?: number | null
          status?: string | null
          target_date?: string | null
        }
        Update: {
          coach_id?: string | null
          completed_date?: string | null
          created_at?: string | null
          id?: number
          importance_level?: number | null
          milestone_description?: string | null
          milestone_type?: string
          player_id?: number | null
          status?: string | null
          target_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "player_development_milestones_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_development_milestones_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "current_squad"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_development_milestones_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "enhanced_player_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_development_milestones_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_season_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_development_milestones_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      player_development_pathways: {
        Row: {
          created_at: string | null
          current_level: string
          demotion_date: string | null
          id: number
          pathway_stage: string | null
          player_id: number | null
          promotion_date: string | null
          status: string | null
          target_level: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_level?: string
          demotion_date?: string | null
          id?: number
          pathway_stage?: string | null
          player_id?: number | null
          promotion_date?: string | null
          status?: string | null
          target_level?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_level?: string
          demotion_date?: string | null
          id?: number
          pathway_stage?: string | null
          player_id?: number | null
          promotion_date?: string | null
          status?: string | null
          target_level?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "player_development_pathways_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "current_squad"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_development_pathways_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "enhanced_player_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_development_pathways_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_season_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_development_pathways_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      player_development_recommendations: {
        Row: {
          created_at: string | null
          created_by: string | null
          focus_area: string | null
          id: number
          player_id: number | null
          priority_level: number | null
          recommendation_type: string | null
          specific_recommendations: string | null
          status: string | null
          target_completion_date: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          focus_area?: string | null
          id?: number
          player_id?: number | null
          priority_level?: number | null
          recommendation_type?: string | null
          specific_recommendations?: string | null
          status?: string | null
          target_completion_date?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          focus_area?: string | null
          id?: number
          player_id?: number | null
          priority_level?: number | null
          recommendation_type?: string | null
          specific_recommendations?: string | null
          status?: string | null
          target_completion_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "player_development_recommendations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_development_recommendations_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "current_squad"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_development_recommendations_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "enhanced_player_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_development_recommendations_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_season_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_development_recommendations_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      player_disciplinary: {
        Row: {
          card_type: string | null
          competition: string | null
          created_at: string | null
          id: number
          match_date: string | null
          player_id: number | null
        }
        Insert: {
          card_type?: string | null
          competition?: string | null
          created_at?: string | null
          id?: number
          match_date?: string | null
          player_id?: number | null
        }
        Update: {
          card_type?: string | null
          competition?: string | null
          created_at?: string | null
          id?: number
          match_date?: string | null
          player_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "player_disciplinary_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "current_squad"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_disciplinary_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "enhanced_player_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_disciplinary_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_season_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_disciplinary_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      player_educational_progress: {
        Row: {
          academic_support_needed: boolean | null
          academic_year: string | null
          attendance_percentage: number | null
          behavioral_notes: string | null
          created_at: string | null
          education_level: string | null
          id: number
          player_id: number | null
          subjects_grades: Json | null
          tutor_assigned: boolean | null
          updated_at: string | null
        }
        Insert: {
          academic_support_needed?: boolean | null
          academic_year?: string | null
          attendance_percentage?: number | null
          behavioral_notes?: string | null
          created_at?: string | null
          education_level?: string | null
          id?: number
          player_id?: number | null
          subjects_grades?: Json | null
          tutor_assigned?: boolean | null
          updated_at?: string | null
        }
        Update: {
          academic_support_needed?: boolean | null
          academic_year?: string | null
          attendance_percentage?: number | null
          behavioral_notes?: string | null
          created_at?: string | null
          education_level?: string | null
          id?: number
          player_id?: number | null
          subjects_grades?: Json | null
          tutor_assigned?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "player_educational_progress_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "current_squad"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_educational_progress_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "enhanced_player_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_educational_progress_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_season_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_educational_progress_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      player_eligibility: {
        Row: {
          id: number
          is_eligible: boolean | null
          notes: string | null
          player_id: number | null
          registration_date: string | null
          registration_expires: string | null
          suspension_until: string | null
        }
        Insert: {
          id?: number
          is_eligible?: boolean | null
          notes?: string | null
          player_id?: number | null
          registration_date?: string | null
          registration_expires?: string | null
          suspension_until?: string | null
        }
        Update: {
          id?: number
          is_eligible?: boolean | null
          notes?: string | null
          player_id?: number | null
          registration_date?: string | null
          registration_expires?: string | null
          suspension_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "player_eligibility_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "current_squad"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_eligibility_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "enhanced_player_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_eligibility_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_season_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_eligibility_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      player_fitness_status: {
        Row: {
          created_at: string | null
          fitness_level: number | null
          id: number
          last_assessment_date: string | null
          notes: string | null
          player_id: number | null
          return_to_full_training_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          fitness_level?: number | null
          id?: number
          last_assessment_date?: string | null
          notes?: string | null
          player_id?: number | null
          return_to_full_training_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          fitness_level?: number | null
          id?: number
          last_assessment_date?: string | null
          notes?: string | null
          player_id?: number | null
          return_to_full_training_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "player_fitness_status_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "current_squad"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_fitness_status_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "enhanced_player_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_fitness_status_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_season_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_fitness_status_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      player_guardian_communications: {
        Row: {
          communication_date: string
          communication_type: string | null
          content: string | null
          created_at: string | null
          follow_up_date: string | null
          follow_up_required: boolean | null
          guardian_email: string | null
          guardian_name: string | null
          guardian_phone: string | null
          id: number
          player_id: number | null
          staff_member_id: string | null
          subject: string | null
        }
        Insert: {
          communication_date: string
          communication_type?: string | null
          content?: string | null
          created_at?: string | null
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          guardian_email?: string | null
          guardian_name?: string | null
          guardian_phone?: string | null
          id?: number
          player_id?: number | null
          staff_member_id?: string | null
          subject?: string | null
        }
        Update: {
          communication_date?: string
          communication_type?: string | null
          content?: string | null
          created_at?: string | null
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          guardian_email?: string | null
          guardian_name?: string | null
          guardian_phone?: string | null
          id?: number
          player_id?: number | null
          staff_member_id?: string | null
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "player_guardian_communications_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "current_squad"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_guardian_communications_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "enhanced_player_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_guardian_communications_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_season_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_guardian_communications_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_guardian_communications_staff_member_id_fkey"
            columns: ["staff_member_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      player_identity_changes: {
        Row: {
          authorized_by: string | null
          change_type: string
          created_at: string | null
          effective_date: string | null
          id: number
          match_id: number | null
          new_value: string | null
          old_value: string | null
          player_id: number | null
          reason: string | null
        }
        Insert: {
          authorized_by?: string | null
          change_type: string
          created_at?: string | null
          effective_date?: string | null
          id?: number
          match_id?: number | null
          new_value?: string | null
          old_value?: string | null
          player_id?: number | null
          reason?: string | null
        }
        Update: {
          authorized_by?: string | null
          change_type?: string
          created_at?: string | null
          effective_date?: string | null
          id?: number
          match_id?: number | null
          new_value?: string | null
          old_value?: string | null
          player_id?: number | null
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "player_identity_changes_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "match_player_context"
            referencedColumns: ["match_id"]
          },
          {
            foreignKeyName: "player_identity_changes_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_identity_changes_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "current_squad"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_identity_changes_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "enhanced_player_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_identity_changes_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_season_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_identity_changes_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      player_injuries: {
        Row: {
          body_part: string | null
          created_at: string | null
          expected_return_date: string | null
          id: number
          injury_date: string | null
          injury_type: string | null
          notes: string | null
          player_id: number | null
          severity: string | null
          status: string | null
        }
        Insert: {
          body_part?: string | null
          created_at?: string | null
          expected_return_date?: string | null
          id?: number
          injury_date?: string | null
          injury_type?: string | null
          notes?: string | null
          player_id?: number | null
          severity?: string | null
          status?: string | null
        }
        Update: {
          body_part?: string | null
          created_at?: string | null
          expected_return_date?: string | null
          id?: number
          injury_date?: string | null
          injury_type?: string | null
          notes?: string | null
          player_id?: number | null
          severity?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "player_injuries_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "current_squad"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_injuries_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "enhanced_player_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_injuries_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_season_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_injuries_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      player_match_performance: {
        Row: {
          aerial_duels_attempted: number | null
          aerial_duels_won: number | null
          assists: number | null
          average_position_x: number | null
          average_position_y: number | null
          captain: boolean | null
          clearances: number | null
          corners_taken: number | null
          created_at: string | null
          crosses_attempted: number | null
          crosses_completed: number | null
          distance_covered: number | null
          dribbles_attempted: number | null
          dribbles_successful: number | null
          fouls_committed: number | null
          fouls_suffered: number | null
          goals: number | null
          id: number
          interceptions: number | null
          match_id: number
          match_rating: number | null
          max_speed: number | null
          minutes_played: number | null
          pass_accuracy: number | null
          passes_attempted: number | null
          passes_completed: number | null
          player_id: number
          player_of_match: boolean | null
          possession_lost: number | null
          possession_won: number | null
          red_cards: number | null
          shots_on_target: number | null
          shots_total: number | null
          sprint_distance: number | null
          substituted_in: number | null
          substituted_out: number | null
          tackles_attempted: number | null
          tackles_won: number | null
          touches: number | null
          updated_at: string | null
          yellow_cards: number | null
        }
        Insert: {
          aerial_duels_attempted?: number | null
          aerial_duels_won?: number | null
          assists?: number | null
          average_position_x?: number | null
          average_position_y?: number | null
          captain?: boolean | null
          clearances?: number | null
          corners_taken?: number | null
          created_at?: string | null
          crosses_attempted?: number | null
          crosses_completed?: number | null
          distance_covered?: number | null
          dribbles_attempted?: number | null
          dribbles_successful?: number | null
          fouls_committed?: number | null
          fouls_suffered?: number | null
          goals?: number | null
          id?: number
          interceptions?: number | null
          match_id: number
          match_rating?: number | null
          max_speed?: number | null
          minutes_played?: number | null
          pass_accuracy?: number | null
          passes_attempted?: number | null
          passes_completed?: number | null
          player_id: number
          player_of_match?: boolean | null
          possession_lost?: number | null
          possession_won?: number | null
          red_cards?: number | null
          shots_on_target?: number | null
          shots_total?: number | null
          sprint_distance?: number | null
          substituted_in?: number | null
          substituted_out?: number | null
          tackles_attempted?: number | null
          tackles_won?: number | null
          touches?: number | null
          updated_at?: string | null
          yellow_cards?: number | null
        }
        Update: {
          aerial_duels_attempted?: number | null
          aerial_duels_won?: number | null
          assists?: number | null
          average_position_x?: number | null
          average_position_y?: number | null
          captain?: boolean | null
          clearances?: number | null
          corners_taken?: number | null
          created_at?: string | null
          crosses_attempted?: number | null
          crosses_completed?: number | null
          distance_covered?: number | null
          dribbles_attempted?: number | null
          dribbles_successful?: number | null
          fouls_committed?: number | null
          fouls_suffered?: number | null
          goals?: number | null
          id?: number
          interceptions?: number | null
          match_id?: number
          match_rating?: number | null
          max_speed?: number | null
          minutes_played?: number | null
          pass_accuracy?: number | null
          passes_attempted?: number | null
          passes_completed?: number | null
          player_id?: number
          player_of_match?: boolean | null
          possession_lost?: number | null
          possession_won?: number | null
          red_cards?: number | null
          shots_on_target?: number | null
          shots_total?: number | null
          sprint_distance?: number | null
          substituted_in?: number | null
          substituted_out?: number | null
          tackles_attempted?: number | null
          tackles_won?: number | null
          touches?: number | null
          updated_at?: string | null
          yellow_cards?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_player_match_performance_match"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "match_player_context"
            referencedColumns: ["match_id"]
          },
          {
            foreignKeyName: "fk_player_match_performance_match"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_player_match_performance_player"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "current_squad"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_player_match_performance_player"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "enhanced_player_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_player_match_performance_player"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_season_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_player_match_performance_player"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      player_match_positions: {
        Row: {
          avg_x_position: number
          avg_y_position: number
          created_at: string | null
          id: number
          match_id: number
          player_id: number
        }
        Insert: {
          avg_x_position: number
          avg_y_position: number
          created_at?: string | null
          id?: number
          match_id: number
          player_id: number
        }
        Update: {
          avg_x_position?: number
          avg_y_position?: number
          created_at?: string | null
          id?: number
          match_id?: number
          player_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "player_match_positions_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "match_player_context"
            referencedColumns: ["match_id"]
          },
          {
            foreignKeyName: "player_match_positions_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_match_positions_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "current_squad"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_match_positions_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "enhanced_player_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_match_positions_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_season_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_match_positions_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      player_match_registrations: {
        Row: {
          created_at: string | null
          id: number
          jersey_number: number
          match_id: number | null
          player_id: number | null
          position: string | null
          registration_status: string | null
          veo_player_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          jersey_number: number
          match_id?: number | null
          player_id?: number | null
          position?: string | null
          registration_status?: string | null
          veo_player_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          jersey_number?: number
          match_id?: number | null
          player_id?: number | null
          position?: string | null
          registration_status?: string | null
          veo_player_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "player_match_registrations_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "match_player_context"
            referencedColumns: ["match_id"]
          },
          {
            foreignKeyName: "player_match_registrations_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_match_registrations_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "current_squad"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_match_registrations_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "enhanced_player_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_match_registrations_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_season_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_match_registrations_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      player_status_classifications: {
        Row: {
          assigned_by: string | null
          assignment_date: string | null
          commercial_value: number | null
          id: number
          international_caps: number | null
          is_captain: boolean | null
          is_vice_captain: boolean | null
          notes: string | null
          player_id: number | null
          seniority_years: number | null
          status_tier: string
          transfer_value_millions: number | null
        }
        Insert: {
          assigned_by?: string | null
          assignment_date?: string | null
          commercial_value?: number | null
          id?: number
          international_caps?: number | null
          is_captain?: boolean | null
          is_vice_captain?: boolean | null
          notes?: string | null
          player_id?: number | null
          seniority_years?: number | null
          status_tier: string
          transfer_value_millions?: number | null
        }
        Update: {
          assigned_by?: string | null
          assignment_date?: string | null
          commercial_value?: number | null
          id?: number
          international_caps?: number | null
          is_captain?: boolean | null
          is_vice_captain?: boolean | null
          notes?: string | null
          player_id?: number | null
          seniority_years?: number | null
          status_tier?: string
          transfer_value_millions?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "player_status_classifications_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "current_squad"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_status_classifications_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "enhanced_player_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_status_classifications_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_season_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_status_classifications_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      player_team_assignments: {
        Row: {
          assignment_date: string | null
          created_at: string | null
          id: number
          player_id: number | null
          status: string | null
          youth_team_id: number | null
        }
        Insert: {
          assignment_date?: string | null
          created_at?: string | null
          id?: number
          player_id?: number | null
          status?: string | null
          youth_team_id?: number | null
        }
        Update: {
          assignment_date?: string | null
          created_at?: string | null
          id?: number
          player_id?: number | null
          status?: string | null
          youth_team_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "player_team_assignments_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "current_squad"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_team_assignments_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "enhanced_player_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_team_assignments_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_season_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_team_assignments_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_team_assignments_youth_team_id_fkey"
            columns: ["youth_team_id"]
            isOneToOne: false
            referencedRelation: "youth_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      player_training_attendance: {
        Row: {
          attended: boolean | null
          created_at: string | null
          id: number
          notes: string | null
          performance_rating: number | null
          player_id: number | null
          training_session_id: number | null
        }
        Insert: {
          attended?: boolean | null
          created_at?: string | null
          id?: number
          notes?: string | null
          performance_rating?: number | null
          player_id?: number | null
          training_session_id?: number | null
        }
        Update: {
          attended?: boolean | null
          created_at?: string | null
          id?: number
          notes?: string | null
          performance_rating?: number | null
          player_id?: number | null
          training_session_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "player_training_attendance_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "current_squad"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_training_attendance_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "enhanced_player_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_training_attendance_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_season_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_training_attendance_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_training_attendance_training_session_id_fkey"
            columns: ["training_session_id"]
            isOneToOne: false
            referencedRelation: "training_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          aerial_duels_attempted: number | null
          aerial_duels_won: number | null
          assists: number | null
          clean_sheets: number | null
          clearances: number | null
          corners_taken: number | null
          created_at: string | null
          crosses_attempted: number | null
          crosses_completed: number | null
          distance_covered: number | null
          dribbles_attempted: number | null
          dribbles_successful: number | null
          fouls_committed: number | null
          fouls_suffered: number | null
          goals: number | null
          heatmapUrl: string | null
          id: number
          interceptions: number | null
          last_match_date: string | null
          match_rating: number | null
          matches: number | null
          maxSpeed: number | null
          minutes_played: number | null
          name: string | null
          number: number | null
          pass_accuracy: number | null
          passCompletionPct: number | null
          passes_attempted: number | null
          passes_completed: number | null
          position: string | null
          reportUrl: string | null
          saves: number | null
          season: string | null
          shots_on_target: number | null
          shots_total: number | null
          sprintDistance: number | null
          tackles_attempted: number | null
          tackles_won: number | null
          updated_at: string | null
        }
        Insert: {
          aerial_duels_attempted?: number | null
          aerial_duels_won?: number | null
          assists?: number | null
          clean_sheets?: number | null
          clearances?: number | null
          corners_taken?: number | null
          created_at?: string | null
          crosses_attempted?: number | null
          crosses_completed?: number | null
          distance_covered?: number | null
          dribbles_attempted?: number | null
          dribbles_successful?: number | null
          fouls_committed?: number | null
          fouls_suffered?: number | null
          goals?: number | null
          heatmapUrl?: string | null
          id?: number
          interceptions?: number | null
          last_match_date?: string | null
          match_rating?: number | null
          matches?: number | null
          maxSpeed?: number | null
          minutes_played?: number | null
          name?: string | null
          number?: number | null
          pass_accuracy?: number | null
          passCompletionPct?: number | null
          passes_attempted?: number | null
          passes_completed?: number | null
          position?: string | null
          reportUrl?: string | null
          saves?: number | null
          season?: string | null
          shots_on_target?: number | null
          shots_total?: number | null
          sprintDistance?: number | null
          tackles_attempted?: number | null
          tackles_won?: number | null
          updated_at?: string | null
        }
        Update: {
          aerial_duels_attempted?: number | null
          aerial_duels_won?: number | null
          assists?: number | null
          clean_sheets?: number | null
          clearances?: number | null
          corners_taken?: number | null
          created_at?: string | null
          crosses_attempted?: number | null
          crosses_completed?: number | null
          distance_covered?: number | null
          dribbles_attempted?: number | null
          dribbles_successful?: number | null
          fouls_committed?: number | null
          fouls_suffered?: number | null
          goals?: number | null
          heatmapUrl?: string | null
          id?: number
          interceptions?: number | null
          last_match_date?: string | null
          match_rating?: number | null
          matches?: number | null
          maxSpeed?: number | null
          minutes_played?: number | null
          name?: string | null
          number?: number | null
          pass_accuracy?: number | null
          passCompletionPct?: number | null
          passes_attempted?: number | null
          passes_completed?: number | null
          position?: string | null
          reportUrl?: string | null
          saves?: number | null
          season?: string | null
          shots_on_target?: number | null
          shots_total?: number | null
          sprintDistance?: number | null
          tackles_attempted?: number | null
          tackles_won?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      positional_averages: {
        Row: {
          aerial_duels_won: number
          created_at: string | null
          finishing: number
          holdup_play: number
          id: number
          pace: number
          position: string
          updated_at: string | null
          work_rate_attacking: number
        }
        Insert: {
          aerial_duels_won: number
          created_at?: string | null
          finishing: number
          holdup_play: number
          id?: number
          pace: number
          position: string
          updated_at?: string | null
          work_rate_attacking: number
        }
        Update: {
          aerial_duels_won?: number
          created_at?: string | null
          finishing?: number
          holdup_play?: number
          id?: number
          pace?: number
          position?: string
          updated_at?: string | null
          work_rate_attacking?: number
        }
        Relationships: []
      }
      professional_jersey_tiers: {
        Row: {
          commercial_significance: number | null
          created_at: string | null
          historical_context: string | null
          id: number
          jersey_number: number
          position_preference: string | null
          requires_admin_approval: boolean | null
          tier: string
        }
        Insert: {
          commercial_significance?: number | null
          created_at?: string | null
          historical_context?: string | null
          id?: number
          jersey_number: number
          position_preference?: string | null
          requires_admin_approval?: boolean | null
          tier: string
        }
        Update: {
          commercial_significance?: number | null
          created_at?: string | null
          historical_context?: string | null
          id?: number
          jersey_number?: number
          position_preference?: string | null
          requires_admin_approval?: boolean | null
          tier?: string
        }
        Relationships: []
      }
      shots: {
        Row: {
          assisted_by: string | null
          created_at: string | null
          date: string
          distance: number | null
          id: number
          match_id: number
          match_name: string
          minute: number
          outcome: string
          period: string
          player_id: number
          x_coordinate: number
          y_coordinate: number
        }
        Insert: {
          assisted_by?: string | null
          created_at?: string | null
          date?: string
          distance?: number | null
          id?: number
          match_id: number
          match_name: string
          minute: number
          outcome: string
          period: string
          player_id: number
          x_coordinate: number
          y_coordinate: number
        }
        Update: {
          assisted_by?: string | null
          created_at?: string | null
          date?: string
          distance?: number | null
          id?: number
          match_id?: number
          match_name?: string
          minute?: number
          outcome?: string
          period?: string
          player_id?: number
          x_coordinate?: number
          y_coordinate?: number
        }
        Relationships: [
          {
            foreignKeyName: "shots_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "current_squad"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shots_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "enhanced_player_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shots_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_season_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shots_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      starting_eleven: {
        Row: {
          created_at: string | null
          formation: string | null
          id: number
          match_id: number | null
          player_id: number | null
          position_on_field: string | null
        }
        Insert: {
          created_at?: string | null
          formation?: string | null
          id?: number
          match_id?: number | null
          player_id?: number | null
          position_on_field?: string | null
        }
        Update: {
          created_at?: string | null
          formation?: string | null
          id?: number
          match_id?: number | null
          player_id?: number | null
          position_on_field?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "starting_eleven_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "match_player_context"
            referencedColumns: ["match_id"]
          },
          {
            foreignKeyName: "starting_eleven_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "starting_eleven_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "current_squad"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "starting_eleven_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "enhanced_player_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "starting_eleven_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_season_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "starting_eleven_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      team_admin_status: {
        Row: {
          admin_violations: string[] | null
          compliance_score: number | null
          id: number
          last_updated: string | null
          points_deducted: number | null
          season: string | null
        }
        Insert: {
          admin_violations?: string[] | null
          compliance_score?: number | null
          id?: number
          last_updated?: string | null
          points_deducted?: number | null
          season?: string | null
        }
        Update: {
          admin_violations?: string[] | null
          compliance_score?: number | null
          id?: number
          last_updated?: string | null
          points_deducted?: number | null
          season?: string | null
        }
        Relationships: []
      }
      training_sessions: {
        Row: {
          created_at: string | null
          duration_minutes: number | null
          id: number
          location: string | null
          session_date: string | null
          session_type: string | null
        }
        Insert: {
          created_at?: string | null
          duration_minutes?: number | null
          id?: number
          location?: string | null
          session_date?: string | null
          session_type?: string | null
        }
        Update: {
          created_at?: string | null
          duration_minutes?: number | null
          id?: number
          location?: string | null
          session_date?: string | null
          session_type?: string | null
        }
        Relationships: []
      }
      user_feedback: {
        Row: {
          created_at: string
          email: string | null
          feedback: string
          id: string
          page: string | null
          subject: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          feedback: string
          id?: string
          page?: string | null
          subject: string
        }
        Update: {
          created_at?: string
          email?: string | null
          feedback?: string
          id?: string
          page?: string | null
          subject?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      veo_analytics: {
        Row: {
          analytics_data: Json
          analytics_type: string
          created_at: string | null
          generated_at: string | null
          id: number
          match_id: number | null
          period: string | null
          player_id: number | null
        }
        Insert: {
          analytics_data: Json
          analytics_type: string
          created_at?: string | null
          generated_at?: string | null
          id?: number
          match_id?: number | null
          period?: string | null
          player_id?: number | null
        }
        Update: {
          analytics_data?: Json
          analytics_type?: string
          created_at?: string | null
          generated_at?: string | null
          id?: number
          match_id?: number | null
          period?: string | null
          player_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "veo_analytics_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "match_player_context"
            referencedColumns: ["match_id"]
          },
          {
            foreignKeyName: "veo_analytics_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "veo_analytics_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "current_squad"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "veo_analytics_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "enhanced_player_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "veo_analytics_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_season_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "veo_analytics_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      veo_events: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: number
          jersey_number: number | null
          match_id: number | null
          period: string | null
          processed: boolean | null
          team_assignment: string | null
          timestamp_seconds: number
          veo_event_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: number
          jersey_number?: number | null
          match_id?: number | null
          period?: string | null
          processed?: boolean | null
          team_assignment?: string | null
          timestamp_seconds: number
          veo_event_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: number
          jersey_number?: number | null
          match_id?: number | null
          period?: string | null
          processed?: boolean | null
          team_assignment?: string | null
          timestamp_seconds?: number
          veo_event_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "veo_events_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "match_player_context"
            referencedColumns: ["match_id"]
          },
          {
            foreignKeyName: "veo_events_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      youth_teams: {
        Row: {
          age_group: string | null
          created_at: string | null
          id: number
          level: number
          team_name: string
        }
        Insert: {
          age_group?: string | null
          created_at?: string | null
          id?: number
          level: number
          team_name: string
        }
        Update: {
          age_group?: string | null
          created_at?: string | null
          id?: number
          level?: number
          team_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      current_squad: {
        Row: {
          aerial_duels_attempted: number | null
          aerial_duels_won: number | null
          assists: number | null
          clean_sheets: number | null
          clearances: number | null
          corners_taken: number | null
          created_at: string | null
          crosses_attempted: number | null
          crosses_completed: number | null
          current_match_id: number | null
          current_number: number | null
          current_position: string | null
          distance_covered: number | null
          dribbles_attempted: number | null
          dribbles_successful: number | null
          fouls_committed: number | null
          fouls_suffered: number | null
          goals: number | null
          heatmapUrl: string | null
          id: number | null
          interceptions: number | null
          last_match_date: string | null
          match_rating: number | null
          matches: number | null
          maxSpeed: number | null
          minutes_played: number | null
          name: string | null
          number: number | null
          pass_accuracy: number | null
          passCompletionPct: number | null
          passes_attempted: number | null
          passes_completed: number | null
          position: string | null
          registration_status: string | null
          reportUrl: string | null
          saves: number | null
          season: string | null
          shots_on_target: number | null
          shots_total: number | null
          sprintDistance: number | null
          tackles_attempted: number | null
          tackles_won: number | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "player_match_registrations_match_id_fkey"
            columns: ["current_match_id"]
            isOneToOne: false
            referencedRelation: "match_player_context"
            referencedColumns: ["match_id"]
          },
          {
            foreignKeyName: "player_match_registrations_match_id_fkey"
            columns: ["current_match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      enhanced_player_info: {
        Row: {
          aerial_duels_attempted: number | null
          aerial_duels_won: number | null
          assists: number | null
          clean_sheets: number | null
          clearances: number | null
          corners_taken: number | null
          created_at: string | null
          crosses_attempted: number | null
          crosses_completed: number | null
          current_jersey_number: number | null
          current_position: string | null
          distance_covered: number | null
          dribbles_attempted: number | null
          dribbles_successful: number | null
          fouls_committed: number | null
          fouls_suffered: number | null
          goals: number | null
          heatmapUrl: string | null
          id: number | null
          interceptions: number | null
          last_match_date: string | null
          match_rating: number | null
          matches: number | null
          maxSpeed: number | null
          minutes_played: number | null
          name: string | null
          number: number | null
          pass_accuracy: number | null
          passCompletionPct: number | null
          passes_attempted: number | null
          passes_completed: number | null
          position: string | null
          registration_status: string | null
          reportUrl: string | null
          saves: number | null
          season: string | null
          shots_on_target: number | null
          shots_total: number | null
          sprintDistance: number | null
          tackles_attempted: number | null
          tackles_won: number | null
          updated_at: string | null
          veo_status: string | null
        }
        Relationships: []
      }
      match_player_context: {
        Row: {
          date: string | null
          jersey_number: number | null
          match_id: number | null
          opponent: string | null
          player_id: number | null
          player_name: string | null
          position: string | null
          registration_status: string | null
          veo_player_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "player_match_registrations_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "current_squad"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_match_registrations_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "enhanced_player_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_match_registrations_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_season_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_match_registrations_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      player_season_stats: {
        Row: {
          assists: number | null
          assists_per_match: number | null
          distance: number | null
          goal_contributions: number | null
          goals: number | null
          goals_per_match: number | null
          id: number | null
          last_match_date: string | null
          match_rating: number | null
          matches: number | null
          maxSpeed: number | null
          name: string | null
          number: number | null
          pass_completion_pct: number | null
          passes_attempted: number | null
          passes_completed: number | null
          position: string | null
          season: string | null
          shot_accuracy_pct: number | null
          shots_on_target: number | null
          shots_total: number | null
          sprintDistance: number | null
          tackle_success_pct: number | null
          tackles_attempted: number | null
          tackles_won: number | null
        }
        Insert: {
          assists?: number | null
          assists_per_match?: never
          distance?: number | null
          goal_contributions?: never
          goals?: number | null
          goals_per_match?: never
          id?: number | null
          last_match_date?: string | null
          match_rating?: number | null
          matches?: number | null
          maxSpeed?: number | null
          name?: string | null
          number?: number | null
          pass_completion_pct?: never
          passes_attempted?: number | null
          passes_completed?: number | null
          position?: string | null
          season?: string | null
          shot_accuracy_pct?: never
          shots_on_target?: number | null
          shots_total?: number | null
          sprintDistance?: number | null
          tackle_success_pct?: never
          tackles_attempted?: number | null
          tackles_won?: number | null
        }
        Update: {
          assists?: number | null
          assists_per_match?: never
          distance?: number | null
          goal_contributions?: never
          goals?: number | null
          goals_per_match?: never
          id?: number | null
          last_match_date?: string | null
          match_rating?: number | null
          matches?: number | null
          maxSpeed?: number | null
          name?: string | null
          number?: number | null
          pass_completion_pct?: never
          passes_attempted?: number | null
          passes_completed?: number | null
          position?: string | null
          season?: string | null
          shot_accuracy_pct?: never
          shots_on_target?: number | null
          shots_total?: number | null
          sprintDistance?: number | null
          tackle_success_pct?: never
          tackles_attempted?: number | null
          tackles_won?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      can_see_all_players: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      get_player_id: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_professional_jersey_suggestions: {
        Args: { player_position: string; exclude_taken_jerseys: number[] }
        Returns: {
          jersey_number: number
          tier: string
          priority_score: number
          requires_approval: boolean
        }[]
      }
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      requires_administrative_review: {
        Args: { requested_jersey: number; player_status?: string }
        Returns: boolean
      }
      resolve_player_conflict_simple: {
        Args: { p_name: string; p_jersey_number: number; p_match_id?: number }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
