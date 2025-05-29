
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: React.ReactNode;
  value: string | number;
  subValue?: string;
  icon?: React.ReactNode;
}

export const StatCard = ({ title, value, subValue, icon }: StatCardProps) => {
  return (
    <Card className="border-club-gold/20 bg-club-dark-gray h-full w-full">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between h-full">
          <div className="min-w-0 flex-1">
            <p className="text-sm text-club-light-gray/70 flex items-center mb-2">{title}</p>
            <p className="text-xl sm:text-2xl font-bold text-club-gold break-words">{value}</p>
            {subValue && (
              <p className="text-xs text-club-light-gray/60 mt-1 break-words">{subValue}</p>
            )}
          </div>
          {icon && (
            <div className="text-club-gold/30 ml-2 flex-shrink-0">{icon}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
