
import { useState, useMemo } from "react";
import { Check, ChevronsUpDown, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Player } from "@/types";
import { PlayerAvatar } from "./PlayerAvatar";

interface MultiPlayerSelectProps {
  players: Player[];
  selectedPlayerIds: number[];
  onChange: (ids: number[]) => void;
  loading?: boolean;
  maxSelections?: number;
}

export function MultiPlayerSelect({
  players,
  selectedPlayerIds,
  onChange,
  loading = false,
  maxSelections = 4
}: MultiPlayerSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPlayers = useMemo(() => {
    if (!searchQuery.trim() || !players?.length) return players || [];
    
    const query = searchQuery.toLowerCase();
    return players.filter(player => 
      player.name?.toLowerCase().includes(query) ||
      player.position?.toLowerCase().includes(query) ||
      player.number?.toString().includes(query)
    );
  }, [players, searchQuery]);

  const selectedPlayersMap = useMemo(() => {
    const playerMap = new Map<number, Player>();
    
    if (players && players.length > 0) {
      players.forEach(player => {
        if (selectedPlayerIds.includes(player.id)) {
          playerMap.set(player.id, player);
        }
      });
    }
    
    return playerMap;
  }, [players, selectedPlayerIds]);

  const handleSelect = (playerId: number) => {
    if (selectedPlayerIds.includes(playerId)) {
      // Remove player if already selected
      onChange(selectedPlayerIds.filter(id => id !== playerId));
    } else if (selectedPlayerIds.length < maxSelections) {
      // Add player if under max selections
      onChange([...selectedPlayerIds, playerId]);
    }
    // Keep popover open for multiple selections
  };

  const handleRemovePlayer = (playerId: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    onChange(selectedPlayerIds.filter(id => id !== playerId));
  };

  const selectionCountText = `${selectedPlayerIds.length}/${maxSelections} selected`;

  if (loading) {
    return (
      <div className="w-full h-10 bg-club-black/40 light:bg-gray-100 rounded-md animate-pulse flex items-center justify-center">
        <span className="text-club-light-gray/70 light:text-gray-500 text-sm">Loading players...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-club-black/80 light:bg-white border-club-gold/30 light:border-gray-300 hover:border-club-gold/50 light:hover:border-yellow-600/60"
            disabled={loading}
          >
            {selectedPlayerIds.length === 0
              ? "Select players for comparison..."
              : selectionCountText}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-club-black light:bg-white border-club-gold/30 light:border-gray-200" align="start">
          <Command shouldFilter={false} className="bg-club-black light:bg-white">
            <div className="flex items-center border-b border-club-gold/20 light:border-gray-200 px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50 text-club-light-gray light:text-gray-500" />
              <CommandInput 
                placeholder="Search players by name, position, or number..." 
                value={searchQuery}
                onValueChange={setSearchQuery}
                className="bg-transparent text-club-light-gray light:text-gray-900 placeholder:text-club-light-gray/50 light:placeholder:text-gray-500"
              />
            </div>
            <CommandList className="bg-club-black light:bg-white">
              <CommandEmpty className="text-club-light-gray/70 light:text-gray-600">
                {players?.length === 0 ? "No players available" : "No players found"}
              </CommandEmpty>
              <CommandGroup>
                {filteredPlayers?.map((player) => {
                  if (!player?.id || !player?.name) return null;
                  
                  const isSelected = selectedPlayerIds.includes(player.id);
                  const isDisabled = selectedPlayerIds.length >= maxSelections && !isSelected;
                  
                  return (
                    <CommandItem
                      key={player.id}
                      value={`${player.id}`}
                      disabled={isDisabled}
                      onSelect={() => handleSelect(player.id)}
                      className="text-club-light-gray light:text-gray-900 hover:bg-club-gold/20 light:hover:bg-yellow-600/10 data-[selected]:bg-club-gold/20 light:data-[selected]:bg-yellow-600/10"
                    >
                      <Check
                        className={`mr-2 h-4 w-4 ${
                          isSelected ? "opacity-100 text-club-gold light:text-yellow-600" : "opacity-0"
                        }`}
                      />
                      <div className="flex flex-1 items-center justify-between">
                        <div className="flex items-center gap-2">
                          <PlayerAvatar player={player} size="sm" />
                          <div>
                            <span className="text-club-light-gray light:text-gray-900">{player.name}</span>
                            {player.position && (
                              <span className="ml-2 text-xs text-club-light-gray/70 light:text-gray-600">
                                ({player.position})
                              </span>
                            )}
                            {player.number && (
                              <span className="ml-2 text-xs text-club-gold/70 light:text-yellow-600/70">
                                #{player.number}
                              </span>
                            )}
                          </div>
                        </div>
                        {isDisabled && (
                          <span className="text-xs text-club-light-gray/50 light:text-gray-500">
                            Max {maxSelections} players
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected players badges */}
      {selectedPlayerIds.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {Array.from(selectedPlayersMap.values()).map(player => (
            <Badge 
              key={player.id} 
              variant="secondary" 
              className="px-3 py-1.5 flex items-center gap-2 bg-club-gold/20 light:bg-yellow-600/20 text-club-light-gray light:text-gray-900 border-club-gold/30 light:border-yellow-600/30"
            >
              <PlayerAvatar player={player} size="sm" />
              <span className="max-w-[100px] truncate">{player.name}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 ml-1 hover:bg-red-500/20 text-club-light-gray/70 light:text-gray-600 hover:text-red-500"
                onClick={(e) => handleRemovePlayer(player.id, e)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {player.name}</span>
              </Button>
            </Badge>
          ))}
        </div>
      )}
      
      {selectedPlayerIds.length > 0 && (
        <div className="text-xs text-club-light-gray/70 light:text-gray-600 mt-1">
          {selectedPlayerIds.length === maxSelections 
            ? `Maximum ${maxSelections} players selected` 
            : `Select up to ${maxSelections - selectedPlayerIds.length} more players`
          }
        </div>
      )}
    </div>
  );
}
