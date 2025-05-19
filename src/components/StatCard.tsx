
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: React.ReactNode;
  value: string | number;
  subValue?: string;
  icon?: React.ReactNode;
}

export const StatCard = ({ title, value, subValue, icon }: StatCardProps) => {
  return (
    <Card className="border-club-gold/20 bg-club-dark-gray">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-club-light-gray/70 flex items-center">{title}</p>
            <p className="text-2xl font-bold text-club-gold">{value}</p>
            {subValue && (
              <p className="text-xs text-club-light-gray/60 mt-1">{subValue}</p>
            )}
          </div>
          {icon && (
            <div className="text-club-gold/30">{icon}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
