
import { useIsMobile } from "@/hooks/use-mobile";
import { MetricConfig } from '../types';

interface TableFooterProps {
  visibleMetrics: MetricConfig[];
  totalMetrics: number;
}

export const TableFooter = ({ visibleMetrics, totalMetrics }: TableFooterProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="absolute bottom-2 right-2 flex items-center gap-2">
      {isMobile && (
        <div className="bg-club-gold/20 text-club-gold px-2 py-1 rounded text-xs backdrop-blur-sm flex items-center gap-1">
          <span>← Scroll →</span>
        </div>
      )}
      {visibleMetrics.length < totalMetrics && (
        <div className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs backdrop-blur-sm">
          {totalMetrics - visibleMetrics.length} more on larger screen
        </div>
      )}
    </div>
  );
};
