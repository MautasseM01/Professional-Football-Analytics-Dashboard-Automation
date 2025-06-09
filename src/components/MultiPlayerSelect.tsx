
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
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Player } from "@/types";
import { PlayerAvatar } from "./PlayerAvatar";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

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
      onChange(selectedPlayerIds.filter(id => id !== playerId));
    } else if (selectedPlayerIds.length < maxSelections) {
      onChange([...selectedPlayerIds, playerId]);
    }
  };

  const handleRemovePlayer = (playerId: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    onChange(selectedPlayerIds.filter(id => id !== playerId));
  };

  const selectionCountText = `${selectedPlayerIds.length}/${maxSelections} selected`;

  // Mobile player selection content
  const PlayerSelectionContent = () => (
    <>
      <div className={`flex items-center ${isMobile ? 'border-b px-4 py-3' : 'border-b px-3'}`}>
        <Search className={`${isMobile ? 'mr-3 h-5 w-5' : 'mr-2 h-4 w-4'} shrink-0 opacity-50`} />
        <CommandInput 
          placeholder="Search players..." 
          value={searchQuery}
          onValueChange={setSearchQuery}
          className={isMobile ? "text-base" : ""}
        />
      </div>
      <CommandList className={isMobile ? "max-h-[60vh]" : ""}>
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
                className={isMobile ? "px-4 py-4 min-h-[64px] text-base" : ""}
              >
                <Check
                  className={`${isMobile ? 'mr-3 h-5 w-5' : 'mr-2 h-4 w-4'} ${
                    isSelected ? "opacity-100" : "opacity-0"
                  }`}
                />
                <div className="flex flex-1 items-center justify-between">
                  <div className="flex items-center gap-3">
                    <PlayerAvatar player={player} size={isMobile ? "md" : "sm"} />
                    <div>
                      <span className={isMobile ? "text-base font-medium" : ""}>{player.name}</span>
                      {player.position && (
                        <span className={`${isMobile ? 'block text-sm' : 'ml-2 text-xs'} text-muted-foreground`}>
                          {player.position}
                        </span>
                      )}
                    </div>
                  </div>
                  {isDisabled && (
                    <span className={`${isMobile ? 'text-sm' : 'text-xs'} text-muted-foreground`}>
                      Max {maxSelections} players
                    </span>
                  )}
                </div>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </>
  );

  const TriggerButton = () => (
    <Button
      variant="outline"
      role="combobox"
      aria-expanded={open}
      className={`w-full justify-between ${isMobile ? 'h-12 text-base' : ''}`}
      disabled={loading}
    >
      {selectedPlayerIds.length === 0
        ? "Select players..."
        : selectionCountText}
      <ChevronsUpDown className={`${isMobile ? 'ml-3 h-5 w-5' : 'ml-2 h-4 w-4'} shrink-0 opacity-50`} />
    </Button>
  );

  return (
    <div className="flex flex-col gap-3">
      {isMobile ? (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <TriggerButton />
          </DrawerTrigger>
          <DrawerContent className="max-h-[85vh]">
            <DrawerHeader className="pb-4">
              <DrawerTitle>Select Players</DrawerTitle>
              <DrawerDescription>
                Choose up to {maxSelections} players to compare
              </DrawerDescription>
            </DrawerHeader>
            <Command shouldFilter={false} className="flex-1">
              <PlayerSelectionContent />
            </Command>
          </DrawerContent>
        </Drawer>
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <TriggerButton />
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command shouldFilter={false}>
              <PlayerSelectionContent />
            </Command>
          </PopoverContent>
        </Popover>
      )}

      {/* Selected players badges */}
      {selectedPlayerIds.length > 0 && (
        <div className={`flex flex-wrap gap-2 ${isMobile ? 'mt-1' : 'mt-2'}`}>
          {Array.from(selectedPlayersMap.values()).map(player => (
            <Badge 
              key={player.id} 
              variant="secondary" 
              className={`${isMobile ? 'px-4 py-2 text-sm' : 'px-3 py-1.5'} flex items-center gap-2`}
            >
              <PlayerAvatar player={player} size="sm" />
              {player.name}
              <Button
                variant="ghost"
                size="sm"
                className={`${isMobile ? 'h-6 w-6 p-0 ml-2' : 'h-5 w-5 p-0 ml-1'}`}
                onClick={(e) => handleRemovePlayer(player.id, e)}
              >
                <X className={`${isMobile ? 'h-4 w-4' : 'h-3 w-3'}`} />
                <span className="sr-only">Remove {player.name}</span>
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
