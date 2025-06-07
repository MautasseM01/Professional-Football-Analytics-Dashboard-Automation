
import { useState } from "react";
import { Player } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ChevronDown, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PlayerAvatar } from "./PlayerAvatar";
import { cn } from "@/lib/utils";

interface MobilePlayerSelectorProps {
  players: Player[];
  selectedPlayer: Player | null;
  onPlayerSelect: (player: Player) => void;
}

export const MobilePlayerSelector = ({
  players,
  selectedPlayer,
  onPlayerSelect
}: MobilePlayerSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePlayerSelect = (player: Player) => {
    onPlayerSelect(player);
    setOpen(false);
    setSearchTerm("");
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between h-12 px-4 bg-club-dark-gray border-club-gold/20",
            "text-club-light-gray hover:text-club-gold hover:bg-club-gold/5",
            "touch-manipulation"
          )}
        >
          <div className="flex items-center gap-3">
            {selectedPlayer ? (
              <>
                <PlayerAvatar player={selectedPlayer} size="sm" />
                <div className="text-left">
                  <div className="font-medium">{selectedPlayer.name}</div>
                  <div className="text-xs text-club-light-gray/60">
                    {selectedPlayer.position} • #{selectedPlayer.number}
                  </div>
                </div>
              </>
            ) : (
              <>
                <User className="h-5 w-5" />
                <span>Select a player</span>
              </>
            )}
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DrawerTrigger>
      
      <DrawerContent className="bg-club-black border-club-gold/20 max-h-[80vh]">
        <DrawerHeader className="pb-4">
          <DrawerTitle className="text-club-gold">Select Player</DrawerTitle>
          <DrawerDescription className="text-club-light-gray/70">
            Choose a player to view their statistics
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="px-4 pb-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-club-light-gray/50" />
            <Input
              placeholder="Search players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-club-dark-gray border-club-gold/20 text-club-light-gray placeholder:text-club-light-gray/50"
            />
          </div>
          
          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredPlayers.map((player) => (
              <Button
                key={player.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start h-auto p-4 rounded-lg",
                  "hover:bg-club-gold/5 active:bg-club-gold/10",
                  "touch-manipulation transition-colors",
                  selectedPlayer?.id === player.id && "bg-club-gold/10 text-club-gold"
                )}
                onClick={() => handlePlayerSelect(player)}
              >
                <div className="flex items-center gap-3 w-full">
                  <PlayerAvatar player={player} size="sm" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">{player.name}</div>
                    <div className="text-sm text-club-light-gray/60">
                      {player.position} • #{player.number} • {player.matches} matches
                    </div>
                  </div>
                </div>
              </Button>
            ))}
            
            {filteredPlayers.length === 0 && (
              <div className="text-center py-8 text-club-light-gray/60">
                No players found matching "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
