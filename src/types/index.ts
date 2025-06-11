export interface AuthUser {
  id: string;
  email: string;
  app_metadata?: {
    provider?: string;
  };
  user_metadata?: {
    name?: string;
    avatar_url?: string;
  };
}

export interface PlayerData {
  id: number;
  name: string;
  position: string;
  age: number;
  matches: number;
  goals: number;
  assists: number;
  yellow_cards: number;
  red_cards: number;
  shots_per_game: number;
  pass_success: number;
  aerials_won: number;
  rating: number;
  team: string;
  [key: string]: any;
}

export interface UserProfile {
  id: string;
  email?: string;
  role: UserRole;
  full_name?: string;
  created_at: string;
  updated_at: string;
}

export type UserRole = 'admin' | 'management' | 'performance_director' | 'analyst' | 'coach' | 'player' | 'unassigned';
