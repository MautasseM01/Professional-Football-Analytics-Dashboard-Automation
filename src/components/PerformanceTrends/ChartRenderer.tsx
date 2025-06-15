
import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, AreaChart, Area } from "recharts";
import { ChartTooltip } from "@/components/ui/chart";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { CustomTooltip } from "./CustomTooltip";

interface ChartRendererProps {
  chartView: string;
  matchData: any[];
  selectedKPI: string;
  selectedKPILabel: string;
  showMovingAverage: boolean;
  getChartConfig: () => any;
}

export const ChartRenderer = ({
  chartView,
  matchData,
  selectedKPI,
  selectedKPILabel,
  showMovingAverage,
  getChartConfig
}: ChartRendererProps) => {
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  // Calculate dynamic margins based on screen size and data
  const getMargins = () => {
    const baseBottom = isMobile ? 50 : 60;
    const hasLongLabels = matchData.some(item => item.match && item.match.length > 8);
    const additionalBottom = hasLongLabels ? (isMobile ? 20 : 30) : 0;
    
    return {
      top: isMobile ? 15 : 20,
      right: isMobile ? 15 : 20,
      bottom: baseBottom + additionalBottom,
      left: isMobile ? 15 : 20
    };
  };

  // Calculate tick interval based on data length and screen size
  const getTickInterval = () => {
    const dataLength = matchData.length;
    if (isMobile) {
      if (dataLength > 20) return 3;
      if (dataLength > 10) return 1;
      return 0;
    }
    if (dataLength > 25) return 2;
    if (dataLength > 15) return 1;
    return 0;
  };

  // Truncate long match names for display
  const truncateMatchName = (matchName: string) => {
    if (!matchName) return '';
    const maxLength = isMobile ? 6 : 8;
    return matchName.length > maxLength ? `${matchName.substring(0, maxLength)}...` : matchName;
  };

  // Process data to add truncated labels
  const processedData = matchData.map(item => ({
    ...item,
    displayMatch: truncateMatchName(item.match)
  }));

  const margins = getMargins();
  const tickInterval = getTickInterval();

  return (
    <ResponsiveContainer width="100%" height="100%">
      {chartView === 'line' ? (
        <RechartsLineChart data={processedData} margin={margins}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={theme === 'dark' ? "#333" : "#e5e7eb"} 
            opacity={0.3} 
          />
          <XAxis 
            dataKey="displayMatch"
            stroke={theme === 'dark' ? "#9CA3AF" : "#6B7280"}
            tick={{ 
              fill: theme === 'dark' ? "#9CA3AF" : "#6B7280", 
              fontSize: isMobile ? 9 : 11,
              textAnchor: 'end'
            }}
            tickLine={false}
            axisLine={false}
            angle={-45}
            interval={tickInterval}
            height={margins.bottom}
            tickMargin={8}
          />
          <YAxis 
            stroke={theme === 'dark' ? "#9CA3AF" : "#6B7280"}
            tick={{ 
              fill: theme === 'dark' ? "#9CA3AF" : "#6B7280", 
              fontSize: isMobile ? 9 : 11 
            }}
            tickLine={false}
            axisLine={false}
            width={margins.left + 10}
            tickMargin={5}
          />
          
          <ChartTooltip 
            content={
              <CustomTooltip 
                selectedKPI={selectedKPI} 
                selectedKPILabel={selectedKPILabel} 
                showMovingAverage={showMovingAverage} 
              />
            } 
          />
          
          <Line
            type="monotone"
            dataKey="value"
            name={selectedKPILabel}
            stroke="#D4AF37"
            strokeWidth={isMobile ? 2 : 2.5}
            dot={{ r: isMobile ? 3 : 4, strokeWidth: 2, fill: "#D4AF37" }}
            activeDot={{ r: isMobile ? 5 : 6, strokeWidth: 2, fill: "#D4AF37" }}
            connectNulls={false}
          />

          {showMovingAverage && !isMobile && (
            <Line
              type="monotone"
              dataKey="movingAvg"
              name="3-Match Average"
              stroke="#9CA3AF"
              strokeDasharray="5 5"
              strokeWidth={2}
              dot={false}
              connectNulls={false}
            />
          )}
        </RechartsLineChart>
      ) : (
        <AreaChart data={processedData} margin={margins}>
          <defs>
            <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={theme === 'dark' ? "#333" : "#e5e7eb"} 
            opacity={0.3} 
          />
          <XAxis 
            dataKey="displayMatch"
            stroke={theme === 'dark' ? "#9CA3AF" : "#6B7280"}
            tick={{ 
              fill: theme === 'dark' ? "#9CA3AF" : "#6B7280", 
              fontSize: isMobile ? 9 : 11,
              textAnchor: 'end'
            }}
            tickLine={false}
            axisLine={false}
            angle={-45}
            interval={tickInterval}
            height={margins.bottom}
            tickMargin={8}
          />
          <YAxis 
            stroke={theme === 'dark' ? "#9CA3AF" : "#6B7280"}
            tick={{ 
              fill: theme === 'dark' ? "#9CA3AF" : "#6B7280", 
              fontSize: isMobile ? 9 : 11 
            }}
            tickLine={false}
            axisLine={false}
            width={margins.left + 10}
            tickMargin={5}
          />
          
          <ChartTooltip 
            content={
              <CustomTooltip 
                selectedKPI={selectedKPI} 
                selectedKPILabel={selectedKPILabel} 
                showMovingAverage={showMovingAverage} 
              />
            } 
          />
          
          <Area
            type="monotone"
            dataKey="value"
            stroke="#D4AF37"
            strokeWidth={isMobile ? 2 : 2.5}
            fill="url(#metricGradient)"
            dot={{ fill: "#D4AF37", strokeWidth: 2, r: isMobile ? 3 : 4 }}
            activeDot={{ r: isMobile ? 5 : 6, stroke: "#D4AF37", strokeWidth: 2 }}
            connectNulls={false}
          />

          {showMovingAverage && !isMobile && (
            <Line
              type="monotone"
              dataKey="movingAvg"
              stroke="#9CA3AF"
              strokeDasharray="5 5"
              strokeWidth={2}
              dot={false}
              connectNulls={false}
            />
          )}
        </AreaChart>
      )}
    </ResponsiveContainer>
  );
};
