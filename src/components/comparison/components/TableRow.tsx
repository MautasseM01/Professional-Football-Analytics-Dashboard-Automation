
import { Badge } from "@/components/ui/badge";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { Medal } from "lucide-react";
import { Player } from "@/types";
import { MetricConfig } from '../types';
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { responsiveClasses } from '../utils/responsiveUtils';
import { getPerformanceLevel, getPerformanceLevelColor } from '../utils/performanceUtils';

interface TableRowProps {
  player: Player;
  index: number;
  visibleMetrics: MetricConfig[];
  highestValues: Record<string, Record<number, boolean>>;
  selectedPlayers: Player[];
}

export const TableRow = ({ 
  player, 
  index, 
  visibleMetrics, 
  highestValues, 
  selectedPlayers 
}: TableRowProps) => {
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  return (
    <tr
      className={cn(
        "transition-all duration-200 hover:shadow-md border-b",
        theme === 'dark' 
          ? "border-club-gold/10 hover:bg-club-black/20 even:bg-club-black/10" 
          : "border-club-gold/20 hover:bg-gray-50/50 even:bg-gray-25/25",
        index % 2 === 0 && "bg-opacity-50"
      )}
    >
      <td className={cn(
        "sticky left-0 z-10 border-r",
        responsiveClasses.cellPadding,
        "w-[140px] sm:w-[160px] lg:w-[180px]",
        theme === 'dark' 
          ? "bg-club-dark-gray/95 border-club-gold/10" 
          : "bg-white/95 border-club-gold/20"
      )}>
        <div className="flex items-center gap-1 sm:gap-2">
          <PlayerAvatar 
            player={player} 
            size={isMobile ? "xs" : "sm"} 
          />
          <div className="min-w-0 flex-1">
            <div className={cn(
              "font-medium truncate",
              responsiveClasses.fontSize,
              theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
            )}>
              {player.name}
            </div>
            <div className={cn(
              "text-gray-500 truncate",
              "text-xs"
            )}>
              {player.position || 'N/A'}
            </div>
          </div>
        </div>
      </td>
      
      {visibleMetrics.map((metric) => {
        const value = metric.getValue(player);
        const isHighest = highestValues[metric.key]?.[player.id];
        const level = getPerformanceLevel(value, metric, selectedPlayers);
        
        return (
          <td
            key={`${player.id}-${metric.key}`}
            className={cn(
              "text-center transition-all duration-200 relative",
              responsiveClasses.cellPadding,
              isHighest && "bg-club-gold/10 border-club-gold/20"
            )}
          >
            <div className="space-y-0.5 sm:space-y-1">
              <div className={cn(
                "font-bold",
                responsiveClasses.fontSize,
                isHighest 
                  ? "text-club-gold" 
                  : getPerformanceLevelColor(level)
              )}>
                {metric.format(value)}
              </div>
              
              {isHighest && (
                <Badge 
                  variant="outline" 
                  className={cn(
                    "bg-club-gold/20 text-club-gold border-club-gold/30",
                    "text-xs px-1 py-0"
                  )}
                >
                  <Medal className="w-2 h-2 mr-0.5 sm:w-3 sm:h-3 sm:mr-1" />
                  <span className="hidden sm:inline">Best</span>
                  <span className="sm:hidden">★</span>
                </Badge>
              )}
              
              {!isHighest && value !== null && !isMobile && (
                <div className={cn(
                  "text-xs opacity-60",
                  getPerformanceLevelColor(level)
                )}>
                  {level}
                </div>
              )}
            </div>
            
            {value !== null && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-200">
                <div 
                  className={cn(
                    "h-full transition-all duration-300",
                    isHighest ? "bg-club-gold" : getPerformanceLevelColor(level).replace('text-', 'bg-')
                  )}
                  style={{
                    width: `${Math.min(100, Math.max(10, (value / Math.max(...selectedPlayers.map(p => metric.getValue(p) || 0))) * 100))}%`
                  }}
                />
              </div>
            )}
          </td>
        );
      })}
    </tr>
  );
};
