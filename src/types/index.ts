
export interface Player {
  id: number;
  name: string;
  position: string;
  matches: number;
  distance: number;
  passes_attempted: number;
  passes_completed: number;
  shots_total: number;
  shots_on_target: number;
  tackles_attempted: number;
  tackles_won: number;
  heatmapUrl: string;
  reportUrl: string;
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
