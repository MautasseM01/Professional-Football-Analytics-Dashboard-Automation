
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

export type NavigationItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  current: boolean;
};
