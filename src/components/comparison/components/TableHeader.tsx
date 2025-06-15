
import { SortableHeader } from './SortableHeader';
import { SortableMetric, SortDirection, MetricConfig } from '../types';
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { responsiveClasses } from '../utils/responsiveUtils';

interface TableHeaderProps {
  visibleMetrics: MetricConfig[];
  sortState: { metric: SortableMetric; direction: SortDirection };
  onSort: (metric: SortableMetric) => void;
}

export const TableHeader = ({ visibleMetrics, sortState, onSort }: TableHeaderProps) => {
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  return (
    <thead className="sticky top-0 z-20">
      <tr className={cn(
        "border-b transition-colors",
        theme === 'dark' 
          ? "border-club-gold/20 bg-club-black/95" 
          : "border-club-gold/30 bg-gray-50/95",
        "backdrop-blur-sm"
      )}>
        <SortableHeader
          metric="name"
          label="Player"
          currentMetric={sortState.metric}
          currentDirection={sortState.direction}
          onSort={onSort}
          className={cn(
            "text-left sticky left-0 z-30",
            responsiveClasses.cellPadding,
            "w-[140px] sm:w-[160px] lg:w-[180px]",
            theme === 'dark' 
              ? "text-club-light-gray bg-club-dark-gray/95" 
              : "text-gray-900 bg-white/95",
            "border-r border-club-gold/20"
          )}
        />
        
        {visibleMetrics.map((metric) => (
          <SortableHeader
            key={metric.key}
            metric={metric.key}
            label={isMobile ? metric.mobileLabel : 
                   window.innerWidth < 1024 ? metric.shortLabel : metric.label}
            currentMetric={sortState.metric}
            currentDirection={sortState.direction}
            onSort={onSort}
            icon={metric.icon}
            unit={metric.unit}
            description={metric.description}
            className={cn(
              responsiveClasses.cellPadding,
              "w-[100px] sm:w-[120px] lg:w-[140px]"
            )}
          />
        ))}
      </tr>
    </thead>
  );
};
