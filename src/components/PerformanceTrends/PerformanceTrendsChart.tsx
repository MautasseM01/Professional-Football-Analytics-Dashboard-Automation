
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

  // Calculate dynamic height based on content and screen size with improved spacing
  const calculateContainerHeight = () => {
    if (isMobile) {
      return Math.max(380, 300 + (matchData.length * 2)); // Increased minimum height for better spacing
    }
    return Math.max(500, 420 + (matchData.length * 3)); // Increased minimum height for desktop
  };

  // Responsive padding based on screen size - adjusted for down and left positioning
  const getContainerPadding = () => {
    if (isMobile) {
      return "pt-6 pb-3 pl-6 pr-3"; // More top and left padding, less bottom and right
    }
    return "pt-8 pb-6 pl-10 pr-6"; // More generous top and left padding on larger screens
  };

  return (
    <div className="pl-6 sm:pl-8 pr-2 sm:pr-4 pb-6"> {/* Adjusted outer container - more left, less right padding */}
      <div 
        className={cn(
          "w-full rounded-2xl transition-all duration-300 overflow-hidden",
          "flex flex-col justify-start items-start", // Changed from justify-center to justify-start and added items-start
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
        <div className="w-full h-full flex items-start justify-start pt-4 pl-2"> {/* Added top and left offsets */}
          <div className="w-full h-full" style={{ 
            maxHeight: '100%',
            minHeight: isMobile ? '280px' : '360px' // Ensure minimum chart area
          }}>
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
    </div>
  );
};
