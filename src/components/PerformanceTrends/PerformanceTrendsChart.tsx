
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChartRenderer } from "./ChartRenderer";

interface PerformanceTrendsChartProps {
  chartView: string;
  matchData: any[];
  selectedKPI: string;
  selectedKPILabel: string;
  showMovingAverage: boolean;
  getChartConfig: () => any;
}

export const PerformanceTrendsChart = ({
  chartView,
  matchData,
  selectedKPI,
  selectedKPILabel,
  showMovingAverage,
  getChartConfig
}: PerformanceTrendsChartProps) => {
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  // Calculate dynamic height based on content and screen size
  const calculateContainerHeight = () => {
    if (isMobile) {
      return Math.max(380, 300 + (matchData.length * 2));
    }
    return Math.max(500, 420 + (matchData.length * 3));
  };

  // Asymmetric padding to position chart towards bottom-left
  const getContainerPadding = () => {
    if (isMobile) {
      return "pt-6 pr-6 pb-2 pl-2"; // More top/right, less bottom/left
    }
    return "pt-8 pr-8 pb-2 pl-2"; // More pronounced on desktop
  };

  return (
    <div className="px-4 sm:px-6 pb-6">
      <div 
        className={cn(
          "w-full rounded-2xl transition-all duration-300 overflow-hidden",
          "flex justify-start items-end", // Position content to bottom-left
          getContainerPadding(),
          theme === 'dark' 
            ? "bg-club-black/20 border border-club-gold/10" 
            : "bg-gray-50/30 border border-club-gold/20"
        )}
        style={{ 
          height: `${calculateContainerHeight()}px`,
          contain: 'layout style paint'
        }}
      >
        <div className="w-full h-full">
          <ChartRenderer
            chartView={chartView}
            matchData={matchData}
            selectedKPI={selectedKPI}
            selectedKPILabel={selectedKPILabel}
            showMovingAverage={showMovingAverage}
            getChartConfig={getChartConfig}
          />
        </div>
      </div>
    </div>
  );
};
