
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Player } from "@/types";
import { MobileControls } from "./MobileControls";
import { KPI_OPTIONS } from "./constants";

interface PerformanceTrendsHeaderProps {
  player: Player;
  stats: {
    trend: string;
  };
  currentMetricIndex: number;
  selectedTimePeriod: string;
  currentMetric: typeof KPI_OPTIONS[0];
  prevMetric: () => void;
  nextMetric: () => void;
}

export const PerformanceTrendsHeader = ({
  player,
  stats,
  currentMetricIndex,
  selectedTimePeriod,
  currentMetric,
  prevMetric,
  nextMetric
}: PerformanceTrendsHeaderProps) => {
  const { theme } = useTheme();
  const isMobile = useIsMobile();

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
        
        {/* Mobile navigation controls */}
        {isMobile && (
          <MobileControls
            currentMetricIndex={currentMetricIndex}
            selectedTimePeriod={selectedTimePeriod}
            currentMetric={currentMetric}
            prevMetric={prevMetric}
            nextMetric={nextMetric}
          />
        )}
      </div>
    </CardHeader>
  );
};
