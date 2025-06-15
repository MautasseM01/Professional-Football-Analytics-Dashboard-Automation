
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MultiPlayerSelect } from "@/components/MultiPlayerSelect";
import { UserRound } from "lucide-react";
import { Player } from "@/types";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

interface PlayerSelectionCardProps {
  players: Player[];
  selectedPlayerIds: number[];
  onChange: (playerIds: number[]) => void;
  loading: boolean;
}

export const PlayerSelectionCard = ({
  players,
  selectedPlayerIds,
  onChange,
  loading
}: PlayerSelectionCardProps) => {
  const { theme } = useTheme();

  return (
    <Card className={cn(
      "border-club-gold/20 overflow-hidden backdrop-blur-sm transition-all duration-300",
      theme === 'dark' 
        ? "bg-club-dark-gray/60" 
        : "bg-white/80",
      "shadow-xl"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <UserRound className="h-5 w-5 text-club-gold" />
          <div>
            <CardTitle className={cn(
              "text-lg font-semibold",
              theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
            )}>
              Player Selection
            </CardTitle>
            <CardDescription className={cn(
              "text-sm",
              theme === 'dark' ? "text-club-light-gray/60" : "text-gray-600"
            )}>
              Select 2 to 4 players to compare their performance metrics
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <MultiPlayerSelect 
          players={players}
          selectedPlayerIds={selectedPlayerIds}
          onChange={onChange}
          loading={loading}
          maxSelections={4}
        />
      </CardContent>
    </Card>
  );
};
