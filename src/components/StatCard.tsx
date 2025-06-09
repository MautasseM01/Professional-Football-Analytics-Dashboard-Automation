
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface StatCardProps {
  title: React.ReactNode;
  value: string | number;
  subValue?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const StatCard = ({ title, value, subValue, icon, className = "" }: StatCardProps) => {
  const isMobile = useIsMobile();

  return (
    <Card className={`
      border-club-gold/20 bg-club-dark-gray 
      transition-all duration-300 ease-in-out
      hover:border-club-gold/40 hover:shadow-lg 
      hover:scale-[1.02] active:scale-[0.98]
      group h-full touch-manipulation ${className}
    `}>
      <CardContent className={`
        ${isMobile ? 'p-4' : 'p-4 sm:p-5 lg:p-6'} 
        h-full flex flex-col justify-between 
        ${isMobile ? 'min-h-[120px]' : 'min-h-[140px]'}
      `}>
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className={`
              ${isMobile ? 'text-sm' : 'text-sm'} 
              text-club-light-gray/70 font-medium leading-tight min-w-0 flex-1
            `}>
              {title}
            </div>
            {icon && (
              <div className="text-club-gold/30 flex-shrink-0 group-hover:text-club-gold/50 transition-colors duration-300">
                <div className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4 sm:w-5 sm:h-5'}`}>
                  {icon}
                </div>
              </div>
            )}
          </div>
          <div className="space-y-1">
            <div className={`
              ${isMobile ? 'text-2xl' : 'text-2xl sm:text-3xl'} 
              font-bold text-club-gold break-words leading-tight 
              group-hover:text-club-gold/90 transition-colors duration-300
            `}>
              {value}
            </div>
            {subValue && (
              <div className={`
                ${isMobile ? 'text-xs' : 'text-xs'} 
                text-club-light-gray/60 break-words leading-tight
              `}>
                {subValue}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
