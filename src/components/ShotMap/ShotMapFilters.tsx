import { ShotFilters, ShotOutcome } from "@/types/shot";
import { Player } from "@/types";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ShotMapFiltersProps {
  players: Player[];
  matches: { id: number; name: string }[];
  filters: ShotFilters;
  onApplyFilters: (filters: Partial<ShotFilters>) => void;
  onResetFilters: () => void;
}

export const ShotMapFilters = ({
  players,
  matches,
  filters,
  onApplyFilters,
  onResetFilters
}: ShotMapFiltersProps) => {
  const periods = ["First Half", "Second Half", "Extra Time", "Penalties"];
  const outcomes: ShotOutcome[] = ["Goal", "Shot on Target", "Shot Off Target", "Blocked Shot"];

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          Shot Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Player
            </label>
            <Select
              value={filters.playerId?.toString() || ""}
              onValueChange={(value) => 
                onApplyFilters({ playerId: value !== "all-players" ? parseInt(value) : null })
              }
            >
              <SelectTrigger className="bg-background border-border text-foreground">
                <SelectValue placeholder="All players" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                <SelectItem value="all-players">All players</SelectItem>
                {players.map((player) => (
                  <SelectItem key={player.id} value={player.id.toString()}>
                    <div className="flex items-center gap-2">
                      <PlayerAvatar player={player} size="sm" />
                      <span>{player.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Match
            </label>
            <Select
              value={filters.matchId?.toString() || ""}
              onValueChange={(value) => 
                onApplyFilters({ matchId: value !== "all-matches" ? parseInt(value) : null })
              }
            >
              <SelectTrigger className="bg-background border-border text-foreground">
                <SelectValue placeholder="All matches" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                <SelectItem value="all-matches">All matches</SelectItem>
                {matches.map((match) => (
                  <SelectItem key={match.id} value={match.id.toString()}>
                    {match.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Period
            </label>
            <Select
              value={filters.period || ""}
              onValueChange={(value) => 
                onApplyFilters({ period: value !== "all-periods" ? value : null })
              }
            >
              <SelectTrigger className="bg-background border-border text-foreground">
                <SelectValue placeholder="All periods" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                <SelectItem value="all-periods">All periods</SelectItem>
                {periods.map((period) => (
                  <SelectItem key={period} value={period}>
                    {period}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Outcome
            </label>
            <Select
              value={filters.outcome?.toString() || ""}
              onValueChange={(value) => 
                onApplyFilters({ outcome: value !== "all-outcomes" ? value as ShotOutcome : null })
              }
            >
              <SelectTrigger className="bg-background border-border text-foreground">
                <SelectValue placeholder="All outcomes" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                <SelectItem value="all-outcomes">All outcomes</SelectItem>
                {outcomes.map((outcome) => (
                  <SelectItem key={outcome} value={outcome}>
                    {outcome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-center gap-2 pt-4 border-t border-border">
          <button
            onClick={onResetFilters}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border border-border rounded-md hover:bg-muted"
          >
            Reset Filters
          </button>
          <div className="text-xs text-muted-foreground">
            {filters.playerId || filters.matchId || filters.period || filters.outcome ? 
              "Filters applied" : "No filters applied"
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
};