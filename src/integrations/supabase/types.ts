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
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          date: string
          id: number
          location: string
          opponent: string
          result: string
        }
        Insert: {
          date: string
          id?: number
          location: string
          opponent: string
          result: string
        }
        Update: {
          date?: string
          id?: number
          location?: string
          opponent?: string
          result?: string
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
          aerial_duels_won: number
          created_at: string | null
          finishing: number
          holdup_play: number
          id: number
          pace: number
          player_id: number
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
          player_id: number
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
          player_id?: number
          updated_at?: string | null
          work_rate_attacking?: number
        }
        Relationships: [
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
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          distance: number | null
          heatmapUrl: string | null
          id: number
          matches: number | null
          maxSpeed: number | null
          name: string | null
          number: number | null
          passCompletionPct: number | null
          passes_attempted: number | null
          passes_completed: number | null
          position: string | null
          reportUrl: string | null
          shots_on_target: number | null
          shots_total: number | null
          sprintDistance: number | null
          tackles_attempted: number | null
          tackles_won: number | null
        }
        Insert: {
          distance?: number | null
          heatmapUrl?: string | null
          id: number
          matches?: number | null
          maxSpeed?: number | null
          name?: string | null
          number?: number | null
          passCompletionPct?: number | null
          passes_attempted?: number | null
          passes_completed?: number | null
          position?: string | null
          reportUrl?: string | null
          shots_on_target?: number | null
          shots_total?: number | null
          sprintDistance?: number | null
          tackles_attempted?: number | null
          tackles_won?: number | null
        }
        Update: {
          distance?: number | null
          heatmapUrl?: string | null
          id?: number
          matches?: number | null
          maxSpeed?: number | null
          name?: string | null
          number?: number | null
          passCompletionPct?: number | null
          passes_attempted?: number | null
          passes_completed?: number | null
          position?: string | null
          reportUrl?: string | null
          shots_on_target?: number | null
          shots_total?: number | null
          sprintDistance?: number | null
          tackles_attempted?: number | null
          tackles_won?: number | null
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
      [_ in never]: never
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
