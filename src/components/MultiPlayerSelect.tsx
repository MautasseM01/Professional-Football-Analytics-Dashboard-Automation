
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
      player.position?.toLowerCase().includes(query)
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

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={loading}
          >
            {selectedPlayerIds.length === 0
              ? "Select players..."
              : selectionCountText}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command shouldFilter={false}>
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput 
                placeholder="Search players..." 
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
            </div>
            <CommandList>
              <CommandEmpty>No players found</CommandEmpty>
              <CommandGroup>
                {filteredPlayers?.map((player) => {
                  const isSelected = selectedPlayerIds.includes(player.id);
                  const isDisabled = selectedPlayerIds.length >= maxSelections && !isSelected;
                  
                  return (
                    <CommandItem
                      key={player.id}
                      value={`${player.id}`}
                      disabled={isDisabled}
                      onSelect={() => handleSelect(player.id)}
                    >
                      <Check
                        className={`mr-2 h-4 w-4 ${
                          isSelected ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      <div className="flex flex-1 items-center justify-between">
                        <div className="flex items-center gap-2">
                          <PlayerAvatar player={player} size="sm" />
                          <div>
                            <span>{player.name}</span>
                            {player.position && (
                              <span className="ml-2 text-xs text-muted-foreground">
                                ({player.position})
                              </span>
                            )}
                          </div>
                        </div>
                        {isDisabled && (
                          <span className="text-xs text-muted-foreground">
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
        <div className="flex flex-wrap sm:flex-nowrap gap-2 mt-2 sm:overflow-x-auto">
          {Array.from(selectedPlayersMap.values()).map(player => (
            <Badge key={player.id} variant="secondary" className="px-3 py-1.5 flex items-center gap-2 flex-shrink-0">
              <PlayerAvatar player={player} size="sm" />
              {player.name}
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 ml-1"
                onClick={(e) => handleRemovePlayer(player.id, e)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {player.name}</span>
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
