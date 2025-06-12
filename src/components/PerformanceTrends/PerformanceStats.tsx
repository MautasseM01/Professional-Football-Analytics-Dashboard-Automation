
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface PerformanceStatsProps {
  stats: {
    avg: number;
    max: number;
    min: number;
    trend: string;
  };
  matchDataLength: number;
}

export const PerformanceStats = ({ stats, matchDataLength }: PerformanceStatsProps) => {
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "grid gap-3 p-4 rounded-2xl transition-all duration-300 animate-fade-in",
      isMobile ? "grid-cols-2" : "grid-cols-4",
      theme === 'dark' 
        ? "bg-club-black/30 border border-club-gold/10" 
        : "bg-gray-50/50 border border-club-gold/20"
    )}>
      <div className="text-center">
        <div className={cn(
          "text-lg font-bold transition-colors duration-200",
          theme === 'dark' ? "text-club-gold" : "text-club-gold"
        )}>
          {stats.avg.toFixed(1)}
        </div>
        <div className={cn(
          "text-xs",
          theme === 'dark' ? "text-club-light-gray/70" : "text-gray-600"
        )}>Average</div>
      </div>
      <div className="text-center">
        <div className={cn(
          "text-lg font-bold transition-colors duration-200",
          theme === 'dark' ? "text-green-400" : "text-green-600"
        )}>
          {stats.max}
        </div>
        <div className={cn(
          "text-xs",
          theme === 'dark' ? "text-club-light-gray/70" : "text-gray-600"
        )}>Best</div>
      </div>
      {!isMobile && (
        <>
          <div className="text-center">
            <div className={cn(
              "text-lg font-bold transition-colors duration-200",
              theme === 'dark' ? "text-red-400" : "text-red-600"
            )}>
              {stats.min}
            </div>
            <div className={cn(
              "text-xs",
              theme === 'dark' ? "text-club-light-gray/70" : "text-gray-600"
            )}>Worst</div>
          </div>
          <div className="text-center">
            <div className={cn(
              "text-lg font-bold transition-colors duration-200",
              theme === 'dark' ? "text-blue-400" : "text-blue-600"
            )}>
              {matchDataLength}
            </div>
            <div className={cn(
              "text-xs",
              theme === 'dark' ? "text-club-light-gray/70" : "text-gray-600"
            )}>Matches</div>
          </div>
        </>
      )}
    </div>
  );
};
