
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
    <Card className={`border-club-gold/20 bg-club-dark-gray transition-all duration-200 hover:border-club-gold/40 hover:shadow-lg group ${className} ${
      isMobile ? 'w-full' : ''
    }`}>
      <CardContent className={`h-[140px] p-5 flex flex-col justify-between`}>
        <div className="flex items-start justify-between h-full">
          <div className="min-w-0 flex-1 space-y-3 flex flex-col justify-center">
            <div className={`text-club-light-gray/70 font-medium leading-tight ${
              isMobile ? 'text-sm' : 'text-xs sm:text-sm'
            }`}>
              {title}
            </div>
            <div className="space-y-1">
              <div className={`font-bold text-club-gold break-words leading-tight group-hover:text-club-gold/90 transition-colors ${
                isMobile 
                  ? 'text-xl' 
                  : 'text-xl sm:text-2xl lg:text-3xl'
              }`}>
                {value}
              </div>
              {subValue && (
                <div className={`text-club-light-gray/60 break-words leading-tight ${
                  isMobile ? 'text-sm' : 'text-xs sm:text-sm'
                }`}>
                  {subValue}
                </div>
              )}
            </div>
          </div>
          {icon && (
            <div className={`text-club-gold/30 flex-shrink-0 group-hover:text-club-gold/50 transition-colors ${
              isMobile ? 'ml-3' : 'ml-4'
            } flex items-center justify-center`}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
