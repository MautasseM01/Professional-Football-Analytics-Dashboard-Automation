
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";
import { SortableMetric, SortDirection } from '../types';
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

interface SortableHeaderProps {
  metric: SortableMetric;
  label: string;
  currentMetric: SortableMetric;
  currentDirection: SortDirection;
  onSort: (metric: SortableMetric) => void;
  icon?: React.ComponentType<{ className?: string }>;
  unit?: string;
  description?: string;
  className?: string;
}

export const SortableHeader = ({
  metric,
  label,
  currentMetric,
  currentDirection,
  onSort,
  icon: Icon,
  unit,
  description,
  className
}: SortableHeaderProps) => {
  const { theme } = useTheme();
  const isActive = currentMetric === metric;

  const getSortIcon = () => {
    if (!isActive) return null;
    return currentDirection === 'asc' ? 
      <ArrowUp className="w-3 h-3 text-club-gold" /> : 
      <ArrowDown className="w-3 h-3 text-club-gold" />;
  };

  return (
    <th className={cn(
      "text-center transition-all duration-200",
      isActive && "bg-club-gold/10 border-club-gold/30",
      className
    )}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onSort(metric)}
        className={cn(
          "h-auto p-1 font-semibold flex-col gap-0.5 w-full transition-all duration-200",
          "text-xs sm:text-sm lg:text-base",
          isActive && "bg-club-gold/20 text-club-gold"
        )}
        title={description}
      >
        <div className="flex items-center gap-1 justify-center">
          {Icon && (
            <Icon className={cn(
              "w-3 h-3 sm:w-4 sm:h-4",
              isActive ? "text-club-gold" : "text-club-gold/70"
            )} />
          )}
          <span className={cn(
            "font-medium truncate max-w-[80px]",
            isActive 
              ? "text-club-gold" 
              : theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
          )}>
            {label}
          </span>
          {getSortIcon()}
        </div>
        {unit && (
          <span className={cn(
            "text-xs",
            isActive ? "text-club-gold/80" : "text-gray-500"
          )}>
            ({unit || 'count'})
          </span>
        )}
      </Button>
    </th>
  );
};
