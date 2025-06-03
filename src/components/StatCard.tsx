
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
    <Card className={`
      border-club-gold/20 bg-club-dark-gray 
      transition-all duration-300 ease-in-out
      hover:border-club-gold/40 hover:shadow-lg 
      hover:scale-[1.02] active:scale-[0.98]
      group ${className}
    `}>
      <CardContent className="p-responsive-4 min-h-[140px] flex flex-col justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="text-responsive-sm text-club-light-gray/70 font-medium leading-tight">
            {title}
          </div>
          <div className="space-y-1">
            <div className="text-responsive-2xl font-bold text-club-gold break-words leading-tight group-hover:text-club-gold/90 transition-colors duration-300">
              {value}
            </div>
            {subValue && (
              <div className="text-responsive-xs text-club-light-gray/60 break-words leading-tight">
                {subValue}
              </div>
            )}
          </div>
        </div>
        {icon && (
          <div className="text-club-gold/30 flex-shrink-0 group-hover:text-club-gold/50 transition-colors duration-300 ml-2 flex items-center justify-center">
            <div className="w-5 h-5 transition-all duration-300 ease-in-out">
              {icon}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
