export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
            referencedRelation: "matches"
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
            referencedRelation: "matches"
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
            referencedRelation: "matches"
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
            referencedRelation: "matches"
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
            foreignKeyName: "player_match_performance_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_match_performance_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_season_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_match_performance_player_id_fkey"
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
            referencedRelation: "matches"
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
          distance: number | null
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
          distance?: number | null
          distance_covered?: number | null
          dribbles_attempted?: number | null
          dribbles_successful?: number | null
          fouls_committed?: number | null
          fouls_suffered?: number | null
          goals?: number | null
          heatmapUrl?: string | null
          id: number
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
          distance?: number | null
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
    }
    Views: {
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
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
