
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, BarChart3, Maximize2, Minimize2 } from "lucide-react";
import { Player } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChartRenderer } from "./ChartRenderer";
import { PerformanceStats } from "./PerformanceStats";
import { MobileControls } from "./MobileControls";
import { DesktopControls } from "./DesktopControls";

interface PerformanceTrendsCardProps {
  player: Player;
}

export const PerformanceTrendsCard = ({ player }: PerformanceTrendsCardProps) => {
  const [selectedMetric, setSelectedMetric] = useState("distance");
  const [timeRange, setTimeRange] = useState("last5");
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useIsMobile();

  const metrics = [
    { key: "distance", label: "Distance (km)", color: "#8B5CF6" },
    { key: "sprints", label: "Sprint Distance (km)", color: "#10B981" },
    { key: "passes", label: "Pass Completion (%)", color: "#F59E0B" },
    { key: "tackles", label: "Tackle Success (%)", color: "#EF4444" },
  ];

  const timeRanges = [
    { key: "last5", label: "Last 5 Matches" },
    { key: "last10", label: "Last 10 Matches" },
    { key: "season", label: "Full Season" },
    { key: "recent", label: "Recent Form" }
  ];

  const generateMockData = () => {
    return Array.from({ length: 10 }, (_, i) => ({
      match: `Match ${i + 1}`,
      distance: Math.random() * 5 + 8,
      sprints: Math.random() * 2 + 1,
      passes: Math.random() * 20 + 70,
      tackles: Math.random() * 30 + 50,
    }));
  };

  const data = generateMockData();
  const selectedMetricData = metrics.find(m => m.key === selectedMetric);

  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(metrics.length - 1, prev + 1));
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className="bg-club-dark-gray border-club-gold/20 w-full overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-club-gold/20 rounded-lg">
              <BarChart3 className="h-5 w-5 text-club-gold" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-club-light-gray">
                Performance Trends
              </CardTitle>
              <p className="text-sm text-club-light-gray/60 mt-1">
                {player.name} - {player.position}
              </p>
            </div>
          </div>
          
          {/* Expand/Collapse Toggle - Available on all screen sizes */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleExpanded}
            className="text-club-light-gray hover:text-club-gold hover:bg-club-gold/10"
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Performance Statistics */}
        <PerformanceStats player={player} />

        {/* Mobile Controls */}
        {isMobile ? (
          <MobileControls
            metrics={metrics}
            timeRanges={timeRanges}
            currentIndex={currentIndex}
            selectedMetric={selectedMetric}
            timeRange={timeRange}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onMetricChange={setSelectedMetric}
            onTimeRangeChange={setTimeRange}
            isExpanded={isExpanded}
          />
        ) : (
          <DesktopControls
            metrics={metrics}
            timeRanges={timeRanges}
            selectedMetric={selectedMetric}
            timeRange={timeRange}
            onMetricChange={setSelectedMetric}
            onTimeRangeChange={setTimeRange}
            isExpanded={isExpanded}
          />
        )}

        {/* Chart Renderer */}
        <ChartRenderer
          data={data}
          selectedMetric={selectedMetric}
          selectedMetricData={selectedMetricData}
          isExpanded={isExpanded}
          isMobile={isMobile}
        />
      </CardContent>
    </Card>
  );
};
