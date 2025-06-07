
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
      bg-white/95 dark:bg-club-dark-gray/95 backdrop-blur-md
      border border-white/30 dark:border-club-gold/10 
      shadow-lg shadow-black/5 dark:shadow-black/20
      transition-all duration-300 ease-out
      hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30
      hover:scale-[1.02] active:scale-[0.98]
      group h-full ${className}
    `}>
      <CardContent className="p-4 sm:p-5 lg:p-6 h-full flex flex-col justify-between min-h-[140px]">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="text-sm sm:text-base font-medium leading-tight min-w-0 flex-1 text-gray-700 dark:text-club-light-gray/80">
              {title}
            </div>
            {icon && (
              <div className="text-blue-500 dark:text-club-gold/40 flex-shrink-0 group-hover:text-blue-600 dark:group-hover:text-club-gold/60 transition-colors duration-300">
                <div className="w-5 h-5 sm:w-6 sm:h-6">
                  {icon}
                </div>
              </div>
            )}
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-club-gold break-words leading-none group-hover:text-gray-800 dark:group-hover:text-club-gold/90 transition-colors duration-300">
              {value}
            </div>
            {subValue && (
              <div className="text-sm sm:text-base text-gray-500 dark:text-club-light-gray/60 break-words leading-tight font-medium">
                {subValue}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
