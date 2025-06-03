
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
      <CardContent className={`h-full flex flex-col justify-between ${
        isMobile 
          ? 'p-4 min-h-[100px]' 
          : 'p-4 sm:p-5 lg:p-6 min-h-[120px]'
      }`}>
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1 space-y-1.5 sm:space-y-2 lg:space-y-3">
            <div className={`text-club-light-gray/70 font-medium leading-tight ${
              isMobile ? 'text-xs' : 'text-xs sm:text-sm'
            }`}>
              {title}
            </div>
            <div className="space-y-1">
              <div className={`font-bold text-club-gold break-words leading-tight group-hover:text-club-gold/90 transition-colors ${
                isMobile 
                  ? 'text-lg' 
                  : 'text-xl sm:text-2xl lg:text-3xl'
              }`}>
                {value}
              </div>
              {subValue && (
                <div className={`text-club-light-gray/60 break-words leading-tight ${
                  isMobile ? 'text-xs' : 'text-xs sm:text-sm'
                }`}>
                  {subValue}
                </div>
              )}
            </div>
          </div>
          {icon && (
            <div className={`text-club-gold/30 flex-shrink-0 group-hover:text-club-gold/50 transition-colors ${
              isMobile ? 'ml-2' : 'ml-3 sm:ml-4'
            }`}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
