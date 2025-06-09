
import { 
  Player
} from "@/types";
import { 
  ShotFilters,
  Shot,
  ShotOutcome
} from "@/types/shot";
import { Filter, CalendarDays, User } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
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
  const isMobile = useIsMobile();
  const periods = ["First Half", "Second Half", "Extra Time", "Penalties"];
  const outcomes: ShotOutcome[] = ["Goal", "Shot on Target", "Shot Off Target", "Blocked Shot"];
  
  return (
    <div className={`space-y-4 ${isMobile ? 'p-4' : ''}`}>
      <div className={`flex ${isMobile ? 'flex-col' : 'sm:flex-row'} ${isMobile ? 'items-start' : 'sm:items-center sm:justify-between'} gap-3`}>
        <h2 className={`font-semibold text-club-gold flex items-center gap-2 ${isMobile ? 'text-base' : 'text-lg sm:text-xl'}`}>
          <Filter size={isMobile ? 16 : 18} className="sm:size-5" />
          Filters
        </h2>
        <Button 
          variant="outline" 
          size={isMobile ? "default" : "sm"}
          onClick={onResetFilters}
          className={`border-club-gold/30 text-club-gold hover:bg-club-gold/10 ${isMobile ? 'w-full h-12' : 'w-full sm:w-auto'}`}
        >
          Reset Filters
        </Button>
      </div>
      
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'} gap-3 sm:gap-4`}>
        <div className="space-y-2">
          <label className={`flex items-center gap-1 text-club-light-gray/70 font-medium ${isMobile ? 'text-sm' : 'text-xs sm:text-sm'}`}>
            <User size={14} className="sm:size-4" />
            Player
          </label>
          <Select
            value={filters.playerId?.toString() || ""}
            onValueChange={(value) => 
              onApplyFilters({ playerId: value ? Number(value) : null })
            }
          >
            <SelectTrigger className={`bg-club-black border-club-gold/30 text-club-light-gray w-full focus:border-club-gold focus:ring-club-gold/20 ${isMobile ? 'h-12' : 'h-10 sm:h-9'}`}>
              <SelectValue placeholder="All players" />
            </SelectTrigger>
            <SelectContent className="bg-club-black border-club-gold/30 text-club-light-gray">
              <SelectItem value="all-players">All players</SelectItem>
              {players.map((player) => (
                <SelectItem key={player.id} value={player.id.toString()}>
                  {player.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className={`flex items-center gap-1 text-club-light-gray/70 font-medium ${isMobile ? 'text-sm' : 'text-xs sm:text-sm'}`}>
            <CalendarDays size={14} className="sm:size-4" />
            Match
          </label>
          <Select
            value={filters.matchId?.toString() || ""}
            onValueChange={(value) => 
              onApplyFilters({ matchId: value !== "all-matches" ? Number(value) : null })
            }
          >
            <SelectTrigger className={`bg-club-black border-club-gold/30 text-club-light-gray w-full focus:border-club-gold focus:ring-club-gold/20 ${isMobile ? 'h-12' : 'h-10 sm:h-9'}`}>
              <SelectValue placeholder="All matches" />
            </SelectTrigger>
            <SelectContent className="bg-club-black border-club-gold/30 text-club-light-gray">
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
          <label className={`flex items-center gap-1 text-club-light-gray/70 font-medium ${isMobile ? 'text-sm' : 'text-xs sm:text-sm'}`}>
            Period
          </label>
          <Select
            value={filters.period?.toString() || ""}
            onValueChange={(value) => 
              onApplyFilters({ period: value !== "all-periods" ? value : null })
            }
          >
            <SelectTrigger className={`bg-club-black border-club-gold/30 text-club-light-gray w-full focus:border-club-gold focus:ring-club-gold/20 ${isMobile ? 'h-12' : 'h-10 sm:h-9'}`}>
              <SelectValue placeholder="All periods" />
            </SelectTrigger>
            <SelectContent className="bg-club-black border-club-gold/30 text-club-light-gray">
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
          <label className={`flex items-center gap-1 text-club-light-gray/70 font-medium ${isMobile ? 'text-sm' : 'text-xs sm:text-sm'}`}>
            Outcome
          </label>
          <Select
            value={filters.outcome?.toString() || ""}
            onValueChange={(value) => 
              onApplyFilters({ outcome: value !== "all-outcomes" ? value as ShotOutcome : null })
            }
          >
            <SelectTrigger className={`bg-club-black border-club-gold/30 text-club-light-gray w-full focus:border-club-gold focus:ring-club-gold/20 ${isMobile ? 'h-12' : 'h-10 sm:h-9'}`}>
              <SelectValue placeholder="All outcomes" />
            </SelectTrigger>
            <SelectContent className="bg-club-black border-club-gold/30 text-club-light-gray">
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
    </div>
  );
};
