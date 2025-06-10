
import React, { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Player } from '@/types';
import { PlayerAvatar } from '@/components/PlayerAvatar';

interface PlayerHeatmapSelectorProps {
  players: Player[];
  selectedPlayer: Player | null;
  onPlayerSelect: (player: Player) => void;
  className?: string;
}

export const PlayerHeatmapSelector = ({
  players,
  selectedPlayer,
  onPlayerSelect,
  className = ""
}: PlayerHeatmapSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    player.position?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-2 border-gray-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all ${className}`}
        >
          {selectedPlayer ? (
            <div className="flex items-center gap-2">
              <PlayerAvatar player={selectedPlayer} size="sm" />
              <div className="text-left">
                <div className="font-medium text-gray-900 dark:text-white">
                  {selectedPlayer.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedPlayer.position} • #{selectedPlayer.number}
                </div>
              </div>
            </div>
          ) : (
            <span className="text-gray-500 dark:text-gray-400">Select a player...</span>
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-2 border-gray-200 dark:border-slate-600 shadow-2xl">
        <Command>
          <div className="flex items-center border-b border-gray-200 dark:border-slate-600 px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput 
              placeholder="Search players..." 
              value={searchValue}
              onValueChange={setSearchValue}
              className="border-0 focus:ring-0"
            />
          </div>
          <CommandList className="max-h-[300px]">
            <CommandEmpty>No players found.</CommandEmpty>
            <CommandGroup>
              {filteredPlayers.map((player) => (
                <CommandItem
                  key={player.id}
                  value={player.name}
                  onSelect={() => {
                    onPlayerSelect(player);
                    setOpen(false);
                  }}
                  className="flex items-center gap-3 p-3 hover:bg-blue-50 dark:hover:bg-slate-700 cursor-pointer"
                >
                  <PlayerAvatar player={player} size="sm" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {player.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {player.position} • #{player.number} • {player.matches} matches
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
