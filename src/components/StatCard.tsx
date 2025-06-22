
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
      border-club-gold/20 bg-club-black 
      transition-all duration-300 ease-in-out
      hover:border-club-gold/40 hover:shadow-lg 
      hover:scale-[1.02] active:scale-[0.98]
      group h-full
      light:bg-white light:border-gray-200 light:hover:border-yellow-600/50
      ${className}
    `}>
      <CardContent className="p-3 h-full">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="text-sm text-gray-300 light:text-gray-700 font-medium leading-tight min-w-0 flex-1">
              {title}
            </div>
            {icon && (
              <div className="text-club-gold/50 light:text-yellow-600/60 flex-shrink-0 group-hover:text-club-gold light:group-hover:text-yellow-600 transition-colors duration-300">
                <div className="w-4 h-4 sm:w-5 sm:h-5">
                  {icon}
                </div>
              </div>
            )}
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-bold text-club-gold light:text-yellow-600 break-words leading-tight group-hover:text-club-gold/90 light:group-hover:text-yellow-600/90 transition-colors duration-300">
              {value}
            </div>
            {subValue && (
              <div className="text-xs text-gray-400 light:text-gray-600 break-words leading-tight">
                {subValue}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
