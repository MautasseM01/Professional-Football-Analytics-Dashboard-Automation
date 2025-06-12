
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Player } from "@/types";

interface PerformanceStatsProps {
  player: Player;
}

export const PerformanceStats = ({ player }: PerformanceStatsProps) => {
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  // Calculate basic stats from player data
  const calculateStats = () => {
    // Use actual player data to create meaningful stats
    const distance = player.distance || 0;
    const passes = player.passes_completed || 0;
    const shots = player.shots_on_target || 0;
    const tackles = player.tackles_won || 0;

    return {
      avg: Number(((distance + passes + shots + tackles) / 4).toFixed(1)),
      max: Math.max(distance, passes, shots, tackles),
      min: Math.min(distance, passes, shots, tackles),
      trend: 'up' // Default trend
    };
  };

  const stats = calculateStats();
  const matchDataLength = player.matches || 0;

  return (
    <div className={cn(
      "grid gap-3 p-4 rounded-2xl transition-all duration-300 animate-fade-in",
      isMobile ? "grid-cols-2" : "grid-cols-4",
      theme === 'dark' 
        ? "bg-club-black/30 border border-club-gold/10" 
        : "bg-gray-50/50 border border-club-gold/20"
    )}>
      <div className="text-center">
        <div className={cn(
          "text-lg font-bold transition-colors duration-200",
          theme === 'dark' ? "text-club-gold" : "text-club-gold"
        )}>
          {stats.avg}
        </div>
        <div className={cn(
          "text-xs",
          theme === 'dark' ? "text-club-light-gray/70" : "text-gray-600"
        )}>Average</div>
      </div>
      <div className="text-center">
        <div className={cn(
          "text-lg font-bold transition-colors duration-200",
          theme === 'dark' ? "text-green-400" : "text-green-600"
        )}>
          {stats.max}
        </div>
        <div className={cn(
          "text-xs",
          theme === 'dark' ? "text-club-light-gray/70" : "text-gray-600"
        )}>Best</div>
      </div>
      {!isMobile && (
        <>
          <div className="text-center">
            <div className={cn(
              "text-lg font-bold transition-colors duration-200",
              theme === 'dark' ? "text-red-400" : "text-red-600"
            )}>
              {stats.min}
            </div>
            <div className={cn(
              "text-xs",
              theme === 'dark' ? "text-club-light-gray/70" : "text-gray-600"
            )}>Worst</div>
          </div>
          <div className="text-center">
            <div className={cn(
              "text-lg font-bold transition-colors duration-200",
              theme === 'dark' ? "text-blue-400" : "text-blue-600"
            )}>
              {matchDataLength}
            </div>
            <div className={cn(
              "text-xs",
              theme === 'dark' ? "text-club-light-gray/70" : "text-gray-600"
            )}>Matches</div>
          </div>
        </>
      )}
    </div>
  );
};
