
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Player } from "@/types";

interface PerformanceTrendsHeaderProps {
  player: Player;
  stats: {
    trend: string;
  };
}

export const PerformanceTrendsHeader = ({
  player,
  stats
}: PerformanceTrendsHeaderProps) => {
  const { theme } = useTheme();

  return (
    <CardHeader className="pb-3 px-4 sm:px-6">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <CardTitle className={cn(
            "text-sm sm:text-base lg:text-lg font-semibold",
            theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
          )}>
            {player.name}'s Performance
          </CardTitle>
          <div className="flex items-center gap-2 mt-1">
            {stats.trend !== 'neutral' && (
              <div className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium animate-scale-in",
                stats.trend === 'up' 
                  ? "bg-club-gold/20 text-club-gold"
                  : "bg-red-500/20 text-red-400"
              )}>
                <TrendingUp 
                  size={10} 
                  className={cn(
                    "transition-transform duration-200",
                    stats.trend === 'down' && "rotate-180"
                  )} 
                />
                <span>
                  {stats.trend === 'up' ? 'Improving' : 'Declining'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </CardHeader>
  );
};
