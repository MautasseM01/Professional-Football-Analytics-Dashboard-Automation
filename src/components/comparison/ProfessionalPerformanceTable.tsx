import { useMemo, useRef, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { TrendingUp, BarChart3, Medal, Target, ChevronLeft, ChevronRight } from "lucide-react";
import { Player } from "@/types";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { TableLoadingSkeleton } from "@/components/LoadingStates";
import { getPassCompletionPercentage, getHighestValuesInRow, formatPercentage } from "@/utils/comparisonUtils";
import { useSorting } from "./hooks/useSorting";
import { SortControls } from "./components/SortControls";
import { SortableHeader } from "./components/SortableHeader";
import { MetricConfig, SortableMetric } from "./types";
interface ProfessionalPerformanceTableProps {
  selectedPlayers: Player[];
  loading: boolean;
}
export const ProfessionalPerformanceTable = ({
  selectedPlayers,
  loading
}: ProfessionalPerformanceTableProps) => {
  const {
    theme
  } = useTheme();
  const isMobile = useIsMobile();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [showScrollHints, setShowScrollHints] = useState(false);
  const metrics: MetricConfig[] = [{
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
  }, {
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
  }, {
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
  }, {
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
  }];
  const visibleMetrics = metrics;
  const {
    sortState,
    handleSort,
    clearSort,
    sortedPlayers
  } = useSorting({
    players: selectedPlayers,
    metrics: visibleMetrics
  });
  const highestValues = useMemo(() => {
    return visibleMetrics.reduce((acc, metric) => {
      acc[metric.key] = getHighestValuesInRow(selectedPlayers, metric.getValue);
      return acc;
    }, {} as Record<string, Record<number, boolean>>);
  }, [selectedPlayers, visibleMetrics]);
  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const {
        scrollLeft,
        scrollWidth,
        clientWidth
      } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
      setShowScrollHints(scrollWidth > clientWidth);
    }
  };
  useEffect(() => {
    checkScrollability();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollability);
      const resizeObserver = new ResizeObserver(checkScrollability);
      resizeObserver.observe(container);
      return () => {
        container.removeEventListener('scroll', checkScrollability);
        resizeObserver.disconnect();
      };
    }
  }, [selectedPlayers]);
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -200,
        behavior: 'smooth'
      });
    }
  };
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    }
  };
  const getPerformanceLevel = (value: number | null, metric: MetricConfig, allValues: number[]) => {
    if (value === null || value === undefined) return 'none';
    if (allValues.length <= 1) return 'average';
    const sortedValues = [...allValues].sort((a, b) => b - a);
    const valueIndex = sortedValues.indexOf(value);
    const percentile = (sortedValues.length - valueIndex - 1) / (sortedValues.length - 1) * 100;
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
  return <>
      <Card className={cn("border-club-gold/20 overflow-hidden backdrop-blur-sm transition-all duration-300", theme === 'dark' ? "bg-club-dark-gray/60" : "bg-white/80", "shadow-xl animate-fade-in")}>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-club-gold flex-shrink-0" />
              <CardTitle className={cn("text-xl font-bold", theme === 'dark' ? "text-club-light-gray" : "text-gray-900")}>
                Professional Performance Analysis
              </CardTitle>
            </div>
            
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className={cn("text-sm", theme === 'dark' ? "text-club-light-gray/70" : "text-gray-600")}>
                Comprehensive performance metrics and statistical analysis
              </p>
              
              <SortControls currentMetric={sortState.metric} currentDirection={sortState.direction} metrics={visibleMetrics} onSort={handleSort} onClear={clearSort} />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {loading ? <div className="p-6">
              <TableLoadingSkeleton rows={6} columns={selectedPlayers.length + 1} />
            </div> : <div className="relative">
              {/* Scroll Hint Buttons */}
              {showScrollHints && canScrollLeft}
              
              {showScrollHints && canScrollRight}

              {/* Left fade gradient */}
              {canScrollLeft && <div className={cn("absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none", "bg-gradient-to-r", theme === 'dark' ? "from-club-dark-gray/80 to-transparent" : "from-white/80 to-transparent")} />}

              {/* Right fade gradient */}
              {canScrollRight && <div className={cn("absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none", "bg-gradient-to-l", theme === 'dark' ? "from-club-dark-gray/80 to-transparent" : "from-white/80 to-transparent")} />}

              {/* Horizontal scroll container */}
              <div ref={scrollContainerRef} className={cn("w-full overflow-x-auto overflow-y-hidden", "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-club-gold/40", "hover:scrollbar-thumb-club-gold/60", "scroll-smooth")} style={{
            maxHeight: `${Math.min(500, (sortedPlayers.length + 1) * 70)}px`,
            scrollbarWidth: 'thin',
            scrollbarColor: '#D4AF37 transparent'
          }}>
                <table className="w-full border-separate border-spacing-0" style={{
              minWidth: '800px'
            }}>
                  <thead className={cn("sticky top-0 z-10", theme === 'dark' ? "bg-club-black/95" : "bg-gray-50/95", "backdrop-blur-sm")}>
                    <tr>
                      <SortableHeader metric={'name' as SortableMetric} label="Player" currentMetric={sortState.metric} currentDirection={sortState.direction} onSort={handleSort} className={cn("sticky left-0 z-20 border-b border-club-gold/20 py-3 px-4", theme === 'dark' ? "bg-club-dark-gray/95" : "bg-white/95")} style={{
                    minWidth: '200px',
                    width: '200px'
                  }} />
                      {visibleMetrics.map(metric => <SortableHeader key={metric.key} metric={metric.key} label={metric.label} currentMetric={sortState.metric} currentDirection={sortState.direction} onSort={handleSort} icon={metric.icon} unit={metric.unit} description={metric.description} className="text-center border-b border-club-gold/20 py-3 px-4" style={{
                    minWidth: '140px',
                    width: '140px'
                  }} />)}
                    </tr>
                  </thead>
                  
                  <tbody>
                    {sortedPlayers.map((player, index) => {
                  const isEvenRow = index % 2 === 0;
                  return <tr key={player.id} className={cn("transition-all duration-200 h-16", "border-b border-club-gold/10", theme === 'dark' ? isEvenRow ? "bg-club-black/20 hover:bg-club-black/40" : "bg-club-dark-gray/20 hover:bg-club-dark-gray/40" : isEvenRow ? "bg-gray-50/30 hover:bg-gray-50/60" : "bg-white/50 hover:bg-white/80")}>
                          <td className={cn("sticky left-0 z-10 py-3 px-4 border-r border-club-gold/10", theme === 'dark' ? "bg-club-dark-gray/95" : "bg-white/95")} style={{
                      minWidth: '200px',
                      width: '200px'
                    }}>
                            <div className="flex items-center gap-3">
                              <PlayerAvatar player={player} size="sm" />
                              <div className="min-w-0 flex-1">
                                <div className={cn("font-semibold text-sm truncate", theme === 'dark' ? "text-club-light-gray" : "text-gray-900")}>
                                  {player.name}
                                </div>
                                <div className="text-xs text-gray-500 truncate">
                                  {player.position || 'N/A'}
                                </div>
                              </div>
                            </div>
                          </td>
                          
                          {visibleMetrics.map(metric => {
                      const value = metric.getValue(player);
                      const isHighest = highestValues[metric.key]?.[player.id];
                      const allValues = selectedPlayers.map(p => metric.getValue(p)).filter(v => v !== null && v !== undefined) as number[];
                      const level = getPerformanceLevel(value, metric, allValues);
                      const styles = getPerformanceLevelStyles(level, isHighest);
                      return <td key={`${player.id}-${metric.key}`} className={cn("text-center py-3 px-4 transition-all duration-200 h-16", styles.bg, styles.border, "border-l border-r")} style={{
                        minWidth: '140px',
                        width: '140px'
                      }}>
                                <div className="flex flex-col items-center justify-center h-full gap-1">
                                  <div className={cn("font-bold text-base", styles.text)}>
                                    {metric.format(value)}
                                  </div>
                                  
                                  {(isHighest || level !== 'none' && value !== null) && <Badge variant="outline" className={cn("text-xs font-medium px-2 py-0", isHighest ? "bg-club-gold/20 text-club-gold border-club-gold/40" : cn(styles.bg, styles.text, styles.border))}>
                                      {isHighest ? <>
                                          <Medal className="w-3 h-3 mr-1" />
                                          Best
                                        </> : level.charAt(0).toUpperCase() + level.slice(1)}
                                    </Badge>}
                                </div>
                              </td>;
                    })}
                        </tr>;
                })}
                  </tbody>
                </table>
              </div>
            </div>}
        </CardContent>
      </Card>

      {/* Custom scrollbar styling */}
      <style>{`
        .scroll-smooth::-webkit-scrollbar {
          height: 6px;
        }
        .scroll-smooth::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 3px;
        }
        .scroll-smooth::-webkit-scrollbar-thumb {
          background: #D4AF37;
          border-radius: 3px;
          box-shadow: 0 0 4px rgba(212, 175, 55, 0.3);
        }
        .scroll-smooth::-webkit-scrollbar-thumb:hover {
          background: #B8941F;
          box-shadow: 0 0 6px rgba(212, 175, 55, 0.5);
        }
      `}</style>
    </>;
};