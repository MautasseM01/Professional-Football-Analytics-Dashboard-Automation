
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronDown, ChevronUp, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Player } from "@/types";
import { KPI_OPTIONS, TIME_PERIOD_OPTIONS } from "./constants";
import { MobileControls } from "./MobileControls";
import { DesktopControls } from "./DesktopControls";
import { ChartRenderer } from "./ChartRenderer";
import { PerformanceStats } from "./PerformanceStats";

interface PerformanceTrendsCardProps {
  player: Player;
}

export const PerformanceTrendsCard = ({ player }: PerformanceTrendsCardProps) => {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [selectedKPI, setSelectedKPI] = useState("distance");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("last5");
  const [selectedChartView, setSelectedChartView] = useState("area");
  const [showMovingAverage, setShowMovingAverage] = useState(true);
  const [currentMetricIndex, setCurrentMetricIndex] = useState(0);

  const currentMetric = KPI_OPTIONS[currentMetricIndex];

  const nextMetric = () => {
    setCurrentMetricIndex((prev) => (prev + 1) % KPI_OPTIONS.length);
    setSelectedKPI(KPI_OPTIONS[(currentMetricIndex + 1) % KPI_OPTIONS.length].value);
  };

  const prevMetric = () => {
    setCurrentMetricIndex((prev) => (prev - 1 + KPI_OPTIONS.length) % KPI_OPTIONS.length);
    setSelectedKPI(KPI_OPTIONS[(currentMetricIndex - 1 + KPI_OPTIONS.length) % KPI_OPTIONS.length].value);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleStats = () => {
    setShowStats(!showStats);
  };

  // Mock data generation for chart
  const generateMockData = () => {
    const matches = ['Match 1', 'Match 2', 'Match 3', 'Match 4', 'Match 5'];
    return matches.map((match, index) => {
      const baseValue = Math.random() * 100 + 50;
      return {
        match,
        value: Math.round(baseValue),
        movingAvg: index >= 2 ? Math.round((baseValue + Math.random() * 20 - 10)) : null
      };
    });
  };

  const mockData = generateMockData();
  const selectedKPILabel = KPI_OPTIONS.find(option => option.value === selectedKPI)?.label || "Distance";

  const getChartConfig = () => ({
    value: {
      label: selectedKPILabel,
      color: "#D4AF37",
    },
    movingAvg: {
      label: "3-Match Average",
      color: "#9CA3AF",
    },
  });

  return (
    <Card className={cn(
      "w-full overflow-hidden transition-all duration-300",
      theme === 'dark' 
        ? "bg-club-dark-gray/60 border-club-gold/20" 
        : "bg-white/80 border-club-gold/30"
    )}>
      <CardHeader className="p-4 sm:p-5 lg:p-6 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-xl transition-all duration-300",
              theme === 'dark' 
                ? "bg-club-gold/20" 
                : "bg-club-gold/10"
            )}>
              <BarChart3 className="h-5 w-5 text-club-gold" />
            </div>
            <div>
              <h3 className={cn(
                "text-lg sm:text-xl font-bold",
                theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
              )}>
                {player.name}'s Performance
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="px-2 py-1 rounded-full bg-club-gold/20 text-club-gold text-xs font-medium">
                  Improving
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isExpanded && !isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleStats}
                className="text-club-gold hover:bg-club-gold/10"
              >
                {showStats ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                Show Statistics
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleExpanded}
              className="text-club-gold hover:bg-club-gold/10"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Controls */}
        {isMobile && (
          <div className="flex items-center justify-between mt-4">
            <MobileControls
              currentMetricIndex={currentMetricIndex}
              selectedTimePeriod={selectedTimePeriod}
              currentMetric={currentMetric}
              prevMetric={prevMetric}
              nextMetric={nextMetric}
            />
          </div>
        )}

        {/* Desktop Controls */}
        {!isMobile && isExpanded && (
          <DesktopControls
            selectedKPI={selectedKPI}
            selectedTimePeriod={selectedTimePeriod}
            chartView={selectedChartView}
            showMovingAverage={showMovingAverage}
            setSelectedKPI={setSelectedKPI}
            setSelectedTimePeriod={setSelectedTimePeriod}
            setChartView={setSelectedChartView}
            setShowMovingAverage={setShowMovingAverage}
          />
        )}
      </CardHeader>

      {isExpanded && (
        <CardContent className="p-4 sm:p-5 lg:p-6 pt-0 space-y-4">
          {/* Performance Statistics */}
          {showStats && (
            <PerformanceStats 
              player={player}
              selectedKPI={selectedKPI}
              selectedTimePeriod={selectedTimePeriod}
            />
          )}

          {/* Chart Renderer */}
          <ChartRenderer
            chartView={selectedChartView}
            matchData={mockData}
            selectedKPI={selectedKPI}
            selectedKPILabel={selectedKPILabel}
            showMovingAverage={showMovingAverage}
            getChartConfig={getChartConfig}
          />
        </CardContent>
      )}
    </Card>
  );
};
