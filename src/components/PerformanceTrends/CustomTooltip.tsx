
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { formatValue } from "./utils";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  selectedKPI: string;
  selectedKPILabel: string;
  showMovingAverage: boolean;
}

export const CustomTooltip = ({ 
  active, 
  payload, 
  label, 
  selectedKPI, 
  selectedKPILabel, 
  showMovingAverage 
}: CustomTooltipProps) => {
  const { theme } = useTheme();

  if (active && payload && payload.length) {
    const data = payload[0].payload;
    
    return (
      <div className={cn(
        "border rounded-xl shadow-2xl backdrop-blur-md max-w-[200px] p-3 transition-all duration-200",
        "animate-scale-in",
        theme === 'dark' 
          ? "bg-club-dark-gray/95 border-club-gold/30 text-club-light-gray" 
          : "bg-white/95 border-club-gold/40 text-gray-900"
      )}>
        <p className="font-semibold text-club-gold text-xs sm:text-sm">{data.match}</p>
        <p className={cn(
          "text-xs mb-1",
          theme === 'dark' ? "text-club-light-gray/80" : "text-gray-600"
        )}>{data.date}</p>
        <p className="text-club-gold font-medium text-xs sm:text-sm">
          {selectedKPILabel}: {formatValue(data.value, selectedKPI)}
        </p>
        {showMovingAverage && data.movingAvg !== null && (
          <p className={cn(
            "text-xs",
            theme === 'dark' ? "text-gray-400" : "text-gray-500"
          )}>
            3-Match Avg: {formatValue(data.movingAvg, selectedKPI)}
          </p>
        )}
      </div>
    );
  }
  return null;
};
