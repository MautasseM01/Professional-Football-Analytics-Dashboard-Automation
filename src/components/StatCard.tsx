
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: React.ReactNode;
  value: string | number;
  subValue?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const StatCard = ({ title, value, subValue, icon, className = "" }: StatCardProps) => {
  return (
    <Card className={`border-club-gold/20 bg-club-dark-gray transition-all duration-200 hover:border-club-gold/40 hover:shadow-lg group ${className}`}>
      <CardContent className="p-4 sm:p-5 lg:p-6 h-full min-h-[120px] flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1 space-y-2 sm:space-y-3">
            <div className="text-xs sm:text-sm text-club-light-gray/70 font-medium leading-tight">
              {title}
            </div>
            <div className="space-y-1">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-club-gold break-words leading-tight group-hover:text-club-gold/90 transition-colors">
                {value}
              </div>
              {subValue && (
                <div className="text-xs sm:text-sm text-club-light-gray/60 break-words leading-tight">
                  {subValue}
                </div>
              )}
            </div>
          </div>
          {icon && (
            <div className="text-club-gold/30 ml-3 sm:ml-4 flex-shrink-0 group-hover:text-club-gold/50 transition-colors">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
