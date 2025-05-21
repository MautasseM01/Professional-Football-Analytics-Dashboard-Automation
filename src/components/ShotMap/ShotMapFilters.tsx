
import { 
  Player
} from "@/types";
import { 
  ShotFilters,
  Shot,
  ShotOutcome
} from "@/types/shot";
import { Filter, CalendarDays, User } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-club-gold flex items-center gap-2">
          <Filter size={20} />
          Filters
        </h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onResetFilters}
          className="border-club-gold/30 text-club-gold hover:bg-club-gold/10"
        >
          Reset Filters
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm flex items-center gap-1 text-club-light-gray/70">
            <User size={16} />
            Player
          </label>
          <Select
            value={filters.playerId?.toString() || ""}
            onValueChange={(value) => 
              onApplyFilters({ playerId: value ? Number(value) : null })
            }
          >
            <SelectTrigger className="bg-club-black border-club-gold/30 text-club-light-gray">
              <SelectValue placeholder="All players" />
            </SelectTrigger>
            <SelectContent className="bg-club-black border-club-gold/30 text-club-light-gray">
              <SelectItem value="">All players</SelectItem>
              {players.map((player) => (
                <SelectItem key={player.id} value={player.id.toString()}>
                  {player.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm flex items-center gap-1 text-club-light-gray/70">
            <CalendarDays size={16} />
            Match
          </label>
          <Select
            value={filters.matchId?.toString() || ""}
            onValueChange={(value) => 
              onApplyFilters({ matchId: value ? Number(value) : null })
            }
          >
            <SelectTrigger className="bg-club-black border-club-gold/30 text-club-light-gray">
              <SelectValue placeholder="All matches" />
            </SelectTrigger>
            <SelectContent className="bg-club-black border-club-gold/30 text-club-light-gray">
              <SelectItem value="">All matches</SelectItem>
              {matches.map((match) => (
                <SelectItem key={match.id} value={match.id.toString()}>
                  {match.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm flex items-center gap-1 text-club-light-gray/70">
            Period
          </label>
          <Select
            value={filters.period?.toString() || ""}
            onValueChange={(value) => 
              onApplyFilters({ period: value || null })
            }
          >
            <SelectTrigger className="bg-club-black border-club-gold/30 text-club-light-gray">
              <SelectValue placeholder="All periods" />
            </SelectTrigger>
            <SelectContent className="bg-club-black border-club-gold/30 text-club-light-gray">
              <SelectItem value="">All periods</SelectItem>
              {periods.map((period) => (
                <SelectItem key={period} value={period}>
                  {period}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm flex items-center gap-1 text-club-light-gray/70">
            Outcome
          </label>
          <Select
            value={filters.outcome?.toString() || ""}
            onValueChange={(value) => 
              onApplyFilters({ outcome: value as ShotOutcome || null })
            }
          >
            <SelectTrigger className="bg-club-black border-club-gold/30 text-club-light-gray">
              <SelectValue placeholder="All outcomes" />
            </SelectTrigger>
            <SelectContent className="bg-club-black border-club-gold/30 text-club-light-gray">
              <SelectItem value="">All outcomes</SelectItem>
              {outcomes.map((outcome) => (
                <SelectItem key={outcome} value={outcome}>
                  {outcome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
