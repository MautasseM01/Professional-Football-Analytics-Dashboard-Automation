
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TrendData {
  direction: 'up' | 'down' | 'neutral';
  percentage?: number;
  label?: string;
}

interface HoverDetails {
  title: string;
  items: Array<{ label: string; value: string | number }>;
}

interface EnhancedStatCardProps {
  title: React.ReactNode;
  value: string | number;
  subValue?: string;
  icon?: React.ReactNode;
  className?: string;
  trend?: TrendData;
  hoverDetails?: HoverDetails;
  onClick?: () => void;
  animateCounter?: boolean;
  priority?: 'normal' | 'warning' | 'critical';
}

export const EnhancedStatCard = ({ 
  title, 
  value, 
  subValue, 
  icon, 
  className = "",
  trend,
  hoverDetails,
  onClick,
  animateCounter = false,
  priority = 'normal'
}: EnhancedStatCardProps) => {
  const [displayValue, setDisplayValue] = useState(animateCounter ? 0 : value);
  const [showHover, setShowHover] = useState(false);

  useEffect(() => {
    if (animateCounter && typeof value === 'number') {
      const duration = 1500;
      const steps = 30;
      const increment = value / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.round(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [value, animateCounter]);

  const getTrendIcon = () => {
    if (!trend) return null;
    
    switch (trend.direction) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-3 h-3 text-red-500" />;
      case 'neutral':
        return <Minus className="w-3 h-3 text-gray-400" />;
    }
  };

  const getPriorityStyles = () => {
    switch (priority) {
      case 'warning':
        return "border-orange-500/30 bg-orange-500/10 hover:border-orange-500/50";
      case 'critical':
        return "border-red-500/30 bg-red-500/10 hover:border-red-500/50";
      default:
        return "border-club-gold/20 bg-club-black hover:border-club-gold/40";
    }
  };

  return (
    <div className="relative">
      <Card 
        className={cn(`
          transition-all duration-300 ease-in-out
          hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
          group h-full cursor-pointer
          light:bg-white light:border-gray-200
          ${getPriorityStyles()}
          ${className}
        `)}
        onClick={onClick}
        onMouseEnter={() => setShowHover(true)}
        onMouseLeave={() => setShowHover(false)}
      >
        <CardContent className="p-4 sm:p-5 lg:p-6 h-full flex flex-col justify-between min-h-[140px]">
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="text-sm text-gray-300 light:text-gray-700 font-medium leading-tight min-w-0 flex-1">
                {title}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {trend && (
                  <div className="flex items-center gap-1">
                    {getTrendIcon()}
                    {trend.percentage && (
                      <span className={cn(
                        "text-xs font-medium",
                        trend.direction === 'up' ? "text-green-500" : 
                        trend.direction === 'down' ? "text-red-500" : "text-gray-400"
                      )}>
                        {trend.percentage}%
                      </span>
                    )}
                  </div>
                )}
                {icon && (
                  <div className="text-club-gold/50 light:text-yellow-600/60 flex-shrink-0 group-hover:text-club-gold light:group-hover:text-yellow-600 transition-colors duration-300">
                    <div className="w-4 h-4 sm:w-5 sm:h-5">
                      {icon}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold text-club-gold light:text-yellow-600 break-words leading-tight group-hover:text-club-gold/90 light:group-hover:text-yellow-600/90 transition-colors duration-300">
                {displayValue}
              </div>
              {subValue && (
                <div className="text-xs text-gray-400 light:text-gray-600 break-words leading-tight">
                  {subValue}
                </div>
              )}
              {trend?.label && (
                <div className="text-xs text-gray-500 light:text-gray-500">
                  {trend.label}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hover Details Tooltip */}
      {showHover && hoverDetails && (
        <div className="absolute z-50 top-full left-0 mt-2 w-64 p-3 bg-club-dark-gray light:bg-white border border-club-gold/20 light:border-gray-200 rounded-lg shadow-lg">
          <h4 className="text-sm font-semibold text-club-gold light:text-yellow-600 mb-2">
            {hoverDetails.title}
          </h4>
          <div className="space-y-1">
            {hoverDetails.items.map((item, index) => (
              <div key={index} className="flex justify-between text-xs">
                <span className="text-gray-300 light:text-gray-600">{item.label}</span>
                <span className="text-club-light-gray light:text-gray-900 font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
