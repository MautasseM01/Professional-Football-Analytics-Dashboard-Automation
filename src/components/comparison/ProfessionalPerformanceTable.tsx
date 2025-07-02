import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { TrendingUp, BarChart3, Medal, Target, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Player } from "@/types";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { TableLoadingSkeleton } from "@/components/LoadingStates";
import { getPassCompletionPercentage, getHighestValuesInRow, formatPercentage } from "@/utils/comparisonUtils";
import { useSorting } from "./hooks/useSorting";
import { SortControls } from "./components/SortControls";
import { MetricConfig, SortableMetric } from "./types";

interface ProfessionalPerformanceTableProps {
  selectedPlayers: Player[];
  loading: boolean;
}

export const ProfessionalPerformanceTable = ({
  selectedPlayers,
  loading
}: ProfessionalPerformanceTableProps) => {
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  const metrics: MetricConfig[] = [
    {
      key: 'distance' as SortableMetric,
      label: 'Total Distance',
      shortLabel: 'Distance',
      mobileLabel: 'Dist',
      getValue: player => player.distance || null,
      format: value => value ? `${value.toFixed(1)} km` : 'N/A',
      unit: 'km',
      icon: TrendingUp,
      description: 'Total distance covered during the match',
      priority: 1
    },
    {
      key: 'passCompletion' as SortableMetric,
      label: 'Pass Completion',
      shortLabel: 'Pass %',
      mobileLabel: 'Pass',
      getValue: player => player.passes_attempted && player.passes_attempted > 0 ? getPassCompletionPercentage(player) : null,
      format: value => value ? formatPercentage(value) : 'N/A',
      unit: '%',
      icon: Target,
      description: 'Percentage of successful passes',
      priority: 1
    },
    {
      key: 'shots' as SortableMetric,
      label: 'Shots on Target',
      shortLabel: 'Shots',
      mobileLabel: 'SOT',
      getValue: player => player.shots_on_target || null,
      format: value => value !== null ? value.toString() : 'N/A',
      unit: '',
      icon: BarChart3,
      description: 'Number of shots that were on target',
      priority: 2
    },
    {
      key: 'tackles' as SortableMetric,
      label: 'Tackles Won',
      shortLabel: 'Tackles',
      mobileLabel: 'Tack',
      getValue: player => player.tackles_won || null,
      format: value => value !== null ? value.toString() : 'N/A',
      unit: '',
      icon: Medal,
      description: 'Number of successful tackles',
      priority: 2
    }
  ];

  // Responsive metric filtering
  const visibleMetrics = useMemo(() => {
    if (typeof window === 'undefined') return metrics;
    const screenWidth = window.innerWidth;
    if (screenWidth < 640) {
      return metrics.filter(m => m.priority === 1);
    }
    if (screenWidth < 1024) {
      return metrics.filter(m => m.priority <= 2);
    }
    return metrics;
  }, [typeof window !== 'undefined' ? window.innerWidth : 0]);

  // Use the sorting hook
  const {
    sortState,
    handleSort,
    clearSort,
    sortedPlayers
  } = useSorting({
    players: selectedPlayers,
    metrics: visibleMetrics
  });

  // Calculate highest values for each metric
  const highestValues = useMemo(() => {
    return visibleMetrics.reduce((acc, metric) => {
      acc[metric.key] = getHighestValuesInRow(selectedPlayers, metric.getValue);
      return acc;
    }, {} as Record<string, Record<number, boolean>>);
  }, [selectedPlayers, visibleMetrics]);

  // Performance level calculation with better thresholds
  const getPerformanceLevel = (value: number | null, metric: MetricConfig, allValues: number[]) => {
    if (value === null || value === undefined) return 'none';
    
    if (allValues.length <= 1) return 'average';
    
    const sortedValues = [...allValues].sort((a, b) => b - a);
    const valueIndex = sortedValues.indexOf(value);
    const percentile = ((sortedValues.length - valueIndex - 1) / (sortedValues.length - 1)) * 100;
    
    if (percentile >= 80) return 'excellent';
    if (percentile >= 60) return 'good';
    if (percentile >= 40) return 'average';
    return 'poor';
  };

  const getPerformanceLevelStyles = (level: string, isHighest: boolean = false) => {
    if (isHighest) {
      return {
        text: 'text-club-gold',
        bg: 'bg-club-gold/10',
        border: 'border-club-gold/30'
      };
    }
    
    switch (level) {
      case 'excellent':
        return {
          text: 'text-green-400',
          bg: 'bg-green-500/5',
          border: 'border-green-500/20'
        };
      case 'good':
        return {
          text: 'text-blue-400',
          bg: 'bg-blue-500/5',
          border: 'border-blue-500/20'
        };
      case 'average':
        return {
          text: 'text-gray-400',
          bg: 'bg-gray-500/5',
          border: 'border-gray-500/20'
        };
      case 'poor':
        return {
          text: 'text-red-400',
          bg: 'bg-red-500/5',
          border: 'border-red-500/20'
        };
      default:
        return {
          text: 'text-gray-500',
          bg: 'bg-transparent',
          border: 'border-transparent'
        };
    }
  };

  const getSortIcon = (columnKey: SortableMetric) => {
    if (sortState.metric !== columnKey) {
      return <ArrowUpDown className="w-3 h-3 text-gray-400" />;
    }
    return sortState.direction === 'asc' 
      ? <ArrowUp className="w-3 h-3 text-club-gold" />
      : <ArrowDown className="w-3 h-3 text-club-gold" />;
  };

  const SortableHeader = ({ 
    metric, 
    label, 
    icon: Icon, 
    className = "" 
  }: { 
    metric: SortableMetric; 
    label: string; 
    icon?: any; 
    className?: string; 
  }) => (
    <th 
      className={cn(
        "text-left font-semibold cursor-pointer transition-all duration-200",
        "hover:bg-club-gold/5 hover:text-club-gold",
        "border-b border-club-gold/20 py-4 px-4",
        sortState.metric === metric && "text-club-gold bg-club-gold/5",
        className
      )}
      onClick={() => handleSort(metric)}
    >
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4" />}
        <span className="select-none">{label}</span>
        {getSortIcon(metric)}
      </div>
    </th>
  );

  return (
    <Card className={cn(
      "border-club-gold/20 overflow-hidden backdrop-blur-sm transition-all duration-300",
      theme === 'dark' ? "bg-club-dark-gray/60" : "bg-white/80",
      "shadow-xl animate-fade-in"
    )}>
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-club-gold flex-shrink-0" />
            <CardTitle className={cn(
              "text-xl font-bold",
              theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
            )}>
              Professional Performance Analysis
            </CardTitle>
          </div>
          
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className={cn(
              "text-sm",
              theme === 'dark' ? "text-club-light-gray/70" : "text-gray-600"
            )}>
              Comprehensive performance metrics and statistical analysis
            </p>
            
            <SortControls 
              currentMetric={sortState.metric} 
              currentDirection={sortState.direction} 
              metrics={visibleMetrics} 
              onSort={handleSort} 
              onClear={clearSort} 
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {loading ? (
          <div className="p-6">
            <TableLoadingSkeleton rows={6} columns={selectedPlayers.length + 1} />
          </div>
        ) : (
          <div className="relative">
            <div className={cn(
              "w-full overflow-x-auto",
              "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-club-gold/30",
              "hover:scrollbar-thumb-club-gold/50"
            )}>
              <table className="w-full border-separate border-spacing-0 min-w-[800px]">
                <thead className={cn(
                  "sticky top-0 z-10",
                  theme === 'dark' ? "bg-club-black/95" : "bg-gray-50/95",
                  "backdrop-blur-sm"
                )}>
                  <tr>
                    <SortableHeader 
                      metric={'name' as SortableMetric}
                      label="Player" 
                      className={cn(
                        "sticky left-0 z-20 min-w-[180px]",
                        theme === 'dark' ? "bg-club-dark-gray/95" : "bg-white/95"
                      )}
                    />
                    {visibleMetrics.map(metric => (
                      <SortableHeader 
                        key={metric.key}
                        metric={metric.key}
                        label={isMobile ? metric.mobileLabel : metric.label}
                        icon={metric.icon}
                        className="text-center min-w-[120px]"
                      />
                    ))}
                  </tr>
                </thead>
                
                <tbody>
                  {sortedPlayers.map((player, index) => {
                    const isEvenRow = index % 2 === 0;
                    return (
                      <tr 
                        key={player.id} 
                        className={cn(
                          "transition-all duration-200 hover:scale-[1.01] hover:shadow-lg",
                          "border-b border-club-gold/10",
                          theme === 'dark' 
                            ? isEvenRow 
                              ? "bg-club-black/20 hover:bg-club-black/40" 
                              : "bg-club-dark-gray/20 hover:bg-club-dark-gray/40"
                            : isEvenRow 
                              ? "bg-gray-50/30 hover:bg-gray-50/60" 
                              : "bg-white/50 hover:bg-white/80"
                        )}
                      >
                        <td className={cn(
                          "sticky left-0 z-10 py-4 px-4 border-r border-club-gold/10",
                          theme === 'dark' ? "bg-club-dark-gray/95" : "bg-white/95"
                        )}>
                          <div className="flex items-center gap-3">
                            <PlayerAvatar player={player} size="md" />
                            <div className="min-w-0 flex-1">
                              <div className={cn(
                                "font-semibold text-base",
                                theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
                              )}>
                                {player.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {player.position || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        {visibleMetrics.map(metric => {
                          const value = metric.getValue(player);
                          const isHighest = highestValues[metric.key]?.[player.id];
                          const allValues = selectedPlayers
                            .map(p => metric.getValue(p))
                            .filter(v => v !== null && v !== undefined) as number[];
                          const level = getPerformanceLevel(value, metric, allValues);
                          const styles = getPerformanceLevelStyles(level, isHighest);
                          
                          return (
                            <td 
                              key={`${player.id}-${metric.key}`} 
                              className={cn(
                                "text-center py-4 px-4 transition-all duration-200",
                                styles.bg,
                                styles.border,
                                "border-l border-r"
                              )}
                            >
                              <div className="space-y-2">
                                <div className={cn(
                                  "font-bold text-lg",
                                  styles.text
                                )}>
                                  {metric.format(value)}
                                </div>
                                
                                {(isHighest || level !== 'none') && (
                                  <div className="flex justify-center">
                                    {isHighest ? (
                                      <Badge 
                                        variant="outline" 
                                        className="bg-club-gold/20 text-club-gold border-club-gold/40 text-xs font-semibold"
                                      >
                                        <Medal className="w-3 h-3 mr-1" />
                                        Best
                                      </Badge>
                                    ) : (
                                      <Badge 
                                        variant="outline" 
                                        className={cn(
                                          "text-xs font-medium",
                                          styles.bg,
                                          styles.text,
                                          styles.border
                                        )}
                                      >
                                        {level.charAt(0).toUpperCase() + level.slice(1)}
                                      </Badge>
                                    )}
                                  </div>
                                )}
                                
                                {/* Performance bar */}
                                {value !== null && allValues.length > 1 && (
                                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                                    <div 
                                      className={cn(
                                        "h-1 rounded-full transition-all duration-300",
                                        isHighest ? "bg-club-gold" : styles.text.replace('text-', 'bg-')
                                      )}
                                      style={{ 
                                        width: `${Math.min(100, Math.max(10, (value / Math.max(...allValues)) * 100))}%` 
                                      }}
                                    />
                                  </div>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Mobile indicator */}
            {visibleMetrics.length < metrics.length && (
              <div className="absolute bottom-4 right-4">
                <Badge 
                  variant="outline" 
                  className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs"
                >
                  {metrics.length - visibleMetrics.length} more metrics on desktop
                </Badge>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
