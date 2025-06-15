
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { Player } from "@/types";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { TableLoadingSkeleton } from "@/components/LoadingStates";
import { getHighestValuesInRow } from "@/utils/comparisonUtils";
import { useSorting } from "./hooks/useSorting";
import { SortControls } from "./components/SortControls";
import { TableHeader } from "./components/TableHeader";
import { TableRow } from "./components/TableRow";
import { TableFooter } from "./components/TableFooter";
import { metrics } from "./config/metricsConfig";
import { useResponsiveMetrics, responsiveClasses } from "./utils/responsiveUtils";

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

  // Responsive metric filtering
  const visibleMetrics = useResponsiveMetrics(metrics);

  // Use the sorting hook
  const { sortState, handleSort, clearSort, sortedPlayers } = useSorting({
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

  return (
    <Card className={cn(
      "border-club-gold/20 overflow-hidden backdrop-blur-sm transition-all duration-300",
      theme === 'dark' 
        ? "bg-club-dark-gray/60" 
        : "bg-white/80",
      "shadow-xl animate-fade-in"
    )}>
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <TrendingUp className={cn(responsiveClasses.iconSize, "text-club-gold")} />
            <CardTitle className={cn(
              responsiveClasses.headerText,
              theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
            )}>
              Professional Performance Analysis
            </CardTitle>
          </div>
          
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {isMobile && (
              <Badge variant="outline" className="text-xs bg-club-gold/10 border-club-gold/30 text-club-gold">
                Swipe → to see more metrics
              </Badge>
            )}
            
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
          <div className="p-3 sm:p-6">
            <TableLoadingSkeleton rows={6} columns={selectedPlayers.length + 1} />
          </div>
        ) : (
          <div className="relative">
            <div className={cn(
              "w-full overflow-x-auto",
              "scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-club-gold/30",
              "hover:scrollbar-thumb-club-gold/50",
              "[&::-webkit-scrollbar]:h-3",
              "[&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-track]:rounded-full",
              "[&::-webkit-scrollbar-thumb]:bg-club-gold/30 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-clip-content",
              "[&::-webkit-scrollbar-thumb:hover]:bg-club-gold/50",
              "scrollbar-width-thin scrollbar-color-club-gold/30 scrollbar-color-transparent",
              theme === 'dark' && [
                "[&::-webkit-scrollbar-track]:bg-club-dark-gray/50",
                "[&::-webkit-scrollbar-thumb]:bg-club-gold/40"
              ]
            )}
            style={{
              scrollbarWidth: 'thin',
              msOverflowStyle: 'scrollbar'
            }}
            >
              <table className={cn(
                "w-full border-separate border-spacing-0",
                "min-w-[500px]",
                "sm:min-w-[600px]",
                "lg:min-w-[800px]"
              )}>
                <TableHeader
                  visibleMetrics={visibleMetrics}
                  sortState={sortState}
                  onSort={handleSort}
                />
                
                <tbody>
                  {sortedPlayers.map((player, index) => (
                    <TableRow
                      key={player.id}
                      player={player}
                      index={index}
                      visibleMetrics={visibleMetrics}
                      highestValues={highestValues}
                      selectedPlayers={selectedPlayers}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            
            <TableFooter
              visibleMetrics={visibleMetrics}
              totalMetrics={metrics.length}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
