
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Player } from "@/types";

interface PerformanceStatsProps {
  player: Player;
  selectedKPI: string;
  selectedTimePeriod: string;
}

export const PerformanceStats = ({ player, selectedKPI, selectedTimePeriod }: PerformanceStatsProps) => {
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  // Calculate stats based on player data and selected KPI
  const calculateStats = () => {
    let value = 0;
    
    switch (selectedKPI) {
      case "distance":
        value = player.distance || 0;
        break;
      case "sprintDistance":
        value = player.sprintDistance || 0;
        break;
      case "passes_completed":
        value = player.passes_completed || 0;
        break;
      case "shots_on_target":
        value = player.shots_on_target || 0;
        break;
      case "tackles_won":
        value = player.tackles_won || 0;
        break;
      case "match_rating":
        value = 7.5; // Mock rating
        break;
      default:
        value = 0;
    }

    // Mock calculations for demo - in real app, these would come from match history
    const avg = value;
    const max = Math.round(value * 1.2);
    const min = Math.round(value * 0.8);
    const matchDataLength = player.matches || 5;

    return { avg, max, min, trend: 'up', matchDataLength };
  };

  const stats = calculateStats();

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
          {stats.avg.toFixed(1)}
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
              {stats.matchDataLength}
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
