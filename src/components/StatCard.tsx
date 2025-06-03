
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useOrientation, useResponsiveBreakpoint } from "@/hooks/use-orientation";

interface StatCardProps {
  title: React.ReactNode;
  value: string | number;
  subValue?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const StatCard = ({ title, value, subValue, icon, className = "" }: StatCardProps) => {
  const isMobile = useIsMobile();
  const orientation = useOrientation();
  const breakpoint = useResponsiveBreakpoint();
  
  // Intelligent height calculation based on breakpoint and orientation
  const getCardHeight = () => {
    if (breakpoint === 'mobile') {
      return orientation === 'landscape' ? 'h-[120px]' : 'h-[140px]';
    }
    if (breakpoint === 'tablet-portrait') {
      return 'h-[130px]';
    }
    if (breakpoint === 'tablet-landscape') {
      return 'h-[140px]';
    }
    return 'h-[140px] lg:h-[150px]';
  };

  // Responsive padding based on breakpoint
  const getPadding = () => {
    if (breakpoint === 'mobile') {
      return 'p-3';
    }
    if (breakpoint === 'tablet-portrait') {
      return 'p-4';
    }
    return 'p-4 sm:p-5';
  };

  // Responsive text sizes with smooth transitions
  const getTitleSize = () => {
    if (breakpoint === 'mobile') {
      return orientation === 'landscape' ? 'text-xs' : 'text-xs';
    }
    if (breakpoint === 'tablet-portrait') {
      return 'text-sm';
    }
    return 'text-sm lg:text-sm xl:text-sm';
  };

  const getValueSize = () => {
    if (breakpoint === 'mobile') {
      return orientation === 'landscape' ? 'text-lg' : 'text-xl';
    }
    if (breakpoint === 'tablet-portrait') {
      return 'text-xl';
    }
    if (breakpoint === 'tablet-landscape') {
      return 'text-xl md:text-2xl';
    }
    return 'text-2xl lg:text-2xl xl:text-3xl';
  };

  const getIconSize = () => {
    if (breakpoint === 'mobile') {
      return 'w-4 h-4';
    }
    if (breakpoint === 'tablet-portrait') {
      return 'w-5 h-5';
    }
    return 'w-5 h-5 lg:w-6 lg:h-6';
  };

  // Layout direction intelligence
  const getLayoutDirection = () => {
    if (breakpoint === 'mobile' && orientation === 'landscape') {
      return 'flex-row items-center';
    }
    return 'flex-col justify-between';
  };

  return (
    <Card className={`
      border-club-gold/20 bg-club-dark-gray 
      transition-all duration-300 ease-in-out
      hover:border-club-gold/40 hover:shadow-lg 
      hover:scale-[1.02] active:scale-[0.98]
      group ${className}
    `}>
      <CardContent className={`
        ${getCardHeight()} ${getPadding()} 
        flex ${getLayoutDirection()}
        transition-all duration-300 ease-in-out
      `}>
        <div className={`
          min-w-0 flex-1 space-y-2 
          ${breakpoint === 'mobile' && orientation === 'landscape' ? 'space-y-1' : 'space-y-2 sm:space-y-3'}
          ${getLayoutDirection().includes('flex-row') ? 'flex flex-col justify-center' : 'flex flex-col justify-center'}
          transition-all duration-300 ease-in-out
        `}>
          <div className={`
            text-club-light-gray/70 font-medium leading-tight 
            ${getTitleSize()}
            transition-all duration-300 ease-in-out
          `}>
            {title}
          </div>
          <div className="space-y-1">
            <div className={`
              font-bold text-club-gold break-words leading-tight 
              group-hover:text-club-gold/90 transition-colors duration-300
              ${getValueSize()}
            `}>
              {value}
            </div>
            {subValue && (
              <div className={`
                text-club-light-gray/60 break-words leading-tight 
                ${breakpoint === 'mobile' ? 'text-xs' : 'text-xs sm:text-sm lg:text-sm'}
                transition-all duration-300 ease-in-out
              `}>
                {subValue}
              </div>
            )}
          </div>
        </div>
        {icon && (
          <div className={`
            text-club-gold/30 flex-shrink-0 
            group-hover:text-club-gold/50 transition-colors duration-300
            ${getLayoutDirection().includes('flex-row') ? 'ml-3' : 'ml-2 xs:ml-3 sm:ml-4'}
            flex items-center justify-center
          `}>
            <div className={`${getIconSize()} transition-all duration-300 ease-in-out`}>
              {icon}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
