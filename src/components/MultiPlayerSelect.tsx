
import React, { useState, useRef, useEffect } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CheckIcon, ChevronDownIcon, SearchIcon } from "lucide-react";
import { Player } from "@/types";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface MultiPlayerSelectProps {
  players: Player[];
  selectedPlayerIds: number[];
  onChange: (ids: number[]) => void;
  loading?: boolean;
  max?: number;
}

export const MultiPlayerSelect: React.FC<MultiPlayerSelectProps> = ({
  players = [],
  selectedPlayerIds = [],
  onChange,
  loading = false,
  max = 4
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  const [inputValue, setInputValue] = useState("");
  
  // Ensure players is always an array
  const safePlayersArray = Array.isArray(players) ? players : [];
  // Ensure selectedPlayerIds is always an array
  const safeSelectedIds = Array.isArray(selectedPlayerIds) ? selectedPlayerIds : [];
  
  // Close dropdown when max selections reached
  useEffect(() => {
    if (safeSelectedIds.length >= max) {
      setOpen(false);
    }
  }, [safeSelectedIds, max]);

  // Toggle player selection
  const togglePlayer = (playerId: number) => {
    if (safeSelectedIds.includes(playerId)) {
      onChange(safeSelectedIds.filter(id => id !== playerId));
    } else {
      if (safeSelectedIds.length < max) {
        onChange([...safeSelectedIds, playerId]);
      }
    }
  };

  // Filter players based on search input - ensure we're filtering a valid array
  const filteredPlayers = safePlayersArray.filter(player => 
    player && player.name && player.name.toLowerCase().includes((inputValue || "").toLowerCase())
  );

  return (
    <div className="w-full">
      {loading ? (
        <Skeleton className="h-10 w-full bg-club-gold/10" />
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              ref={ref}
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between border-club-gold/30 bg-club-black text-club-light-gray hover:bg-club-gold/10 hover:text-club-gold"
            >
              {safeSelectedIds.length === 0
                ? "Select players..."
                : `${safeSelectedIds.length} player${safeSelectedIds.length === 1 ? "" : "s"} selected`}
              <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-full p-0 bg-club-dark-gray border-club-gold/30"
            style={{ width: ref.current ? `${ref.current.offsetWidth}px` : "100%" }}
          >
            <Command className="bg-transparent">
              <div className="flex items-center border-b border-club-gold/20 px-3">
                <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50 text-club-light-gray" />
                <CommandInput 
                  placeholder="Search players..." 
                  className="h-9 bg-transparent text-club-light-gray focus:outline-none placeholder:text-club-light-gray/50"
                  value={inputValue}
                  onValueChange={setInputValue}
                />
              </div>
              <CommandEmpty className="py-6 text-center text-club-light-gray/50">
                No players found.
              </CommandEmpty>
              {filteredPlayers.length > 0 && (
                <CommandGroup className="max-h-[300px] overflow-auto">
                  {filteredPlayers.map((player) => {
                    if (!player) return null;
                    
                    const isSelected = safeSelectedIds.includes(player.id);
                    const isDisabled = safeSelectedIds.length >= max && !isSelected;
                    
                    return (
                      <CommandItem
                        key={player.id}
                        value={String(player.id)}
                        onSelect={() => {
                          if (!isDisabled) {
                            togglePlayer(player.id);
                            setInputValue("");
                          }
                        }}
                        disabled={isDisabled}
                        data-selected={isSelected}
                        className={cn(
                          "flex items-center gap-2 text-club-light-gray",
                          isSelected ? "bg-club-gold/20 text-club-gold" : "",
                          isDisabled ? "opacity-50 pointer-events-none" : ""
                        )}
                      >
                        <div className={cn(
                          "flex h-4 w-4 items-center justify-center rounded-sm border border-club-gold/50",
                          isSelected ? "bg-club-gold border-club-gold" : "opacity-50"
                        )}>
                          {isSelected && <CheckIcon className="h-3 w-3 text-black" />}
                        </div>
                        <span>{player.name}</span>
                        <span className="ml-auto text-club-light-gray/50 text-xs">{player.position}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              )}
            </Command>
          </PopoverContent>
        </Popover>
      )}
      <p className="text-xs text-club-light-gray/50 mt-1.5">
        {safeSelectedIds.length}/{max} players selected
      </p>
    </div>
  );
};
