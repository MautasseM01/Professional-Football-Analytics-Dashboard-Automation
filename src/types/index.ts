
export interface Player {
  id: number;
  name: string;
  position: string;
  matches: number;
  distance_covered: number; // Updated to use distance_covered consistently
  passes_attempted: number;
  passes_completed: number;
  shots_total: number;
  shots_on_target: number;
  tackles_attempted: number;
  tackles_won: number;
  heatmapUrl: string;
  reportUrl: string;
  maxSpeed?: number;
  number?: number;
  sprintDistance?: number;
  // Enhanced properties from database
  goals?: number;
  assists?: number;
  match_rating?: number;
  pass_accuracy?: number;
  minutes_played?: number;
  last_match_date?: string;
  aerial_duels_won?: number;
  aerial_duels_attempted?: number;
  clearances?: number;
  interceptions?: number;
  dribbles_successful?: number;
  dribbles_attempted?: number;
  crosses_completed?: number;
  crosses_attempted?: number;
  corners_taken?: number;
  fouls_suffered?: number;
  fouls_committed?: number;
  clean_sheets?: number;
  saves?: number;
  season?: string;
  // New fields from database updates
  touches?: number;
  possession_won?: number;
  possession_lost?: number;
}

export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
  };
}

export type UserRole = 'player' | 'coach' | 'analyst' | 'performance_director' | 'management' | 'admin' | 'unassigned';

export interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  role?: UserRole;
  created_at?: string;
  updated_at?: string;
}

export type NavigationItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  current: boolean;
};

// Re-export the Shot types for backwards compatibility
export * from './shot';
