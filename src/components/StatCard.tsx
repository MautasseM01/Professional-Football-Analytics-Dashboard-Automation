
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
    <Card className={`border-club-gold/20 bg-club-dark-gray transition-all duration-200 hover:border-club-gold/40 hover:shadow-lg group ${className}`}>
      <CardContent className="h-[140px] xs:h-[130px] sm:h-[140px] md:h-[150px] lg:h-[140px] p-3 xs:p-4 sm:p-5 flex flex-col justify-between">
        <div className="flex items-start justify-between h-full">
          <div className="min-w-0 flex-1 space-y-2 xs:space-y-2 sm:space-y-3 flex flex-col justify-center">
            <div className="text-club-light-gray/70 font-medium leading-tight text-xs xs:text-xs sm:text-sm lg:text-sm xl:text-sm">
              {title}
            </div>
            <div className="space-y-1">
              <div className="font-bold text-club-gold break-words leading-tight group-hover:text-club-gold/90 transition-colors text-lg xs:text-xl sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl">
                {value}
              </div>
              {subValue && (
                <div className="text-club-light-gray/60 break-words leading-tight text-xs xs:text-xs sm:text-sm lg:text-sm">
                  {subValue}
                </div>
              )}
            </div>
          </div>
          {icon && (
            <div className="text-club-gold/30 flex-shrink-0 group-hover:text-club-gold/50 transition-colors ml-2 xs:ml-3 sm:ml-4 flex items-center justify-center">
              <div className="w-4 h-4 xs:w-5 xs:h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6">
                {icon}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
