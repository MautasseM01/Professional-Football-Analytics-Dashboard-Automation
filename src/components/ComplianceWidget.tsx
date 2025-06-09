
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ComplianceWidget = () => {
  return (
    <Card className="bg-white/95 dark:bg-club-dark-gray/95 backdrop-blur-md border border-white/30 dark:border-club-gold/10 shadow-lg shadow-black/5 dark:shadow-black/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-blue-600 dark:text-club-gold text-lg sm:text-xl font-semibold">System Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-3">
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-club-light-gray">
            ✅ Active
          </div>
          <p className="text-sm font-medium text-gray-600 dark:text-club-light-gray/70">
            Player Analytics Operational
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
