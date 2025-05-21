
import { Player } from "./index";

export type ShotOutcome = "Goal" | "Shot on Target" | "Shot Off Target" | "Blocked Shot";

export interface Shot {
  id: number;
  player_id: number;
  player_name?: string;
  match_id: number;
  match_name: string;
  x_coordinate: number; // 0-1050 range for the pitch
  y_coordinate: number; // 0-680 range for the pitch
  minute: number;
  period: "First Half" | "Second Half" | "Extra Time" | "Penalties";
  outcome: ShotOutcome;
  assisted_by?: string;
  distance?: number;
  date: string;
}

export interface ShotFilters {
  playerId?: number | null;
  matchId?: number | null;
  period?: string | null;
  outcome?: ShotOutcome | null;
}
