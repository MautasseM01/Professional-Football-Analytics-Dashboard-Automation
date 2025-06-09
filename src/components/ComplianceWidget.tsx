
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ComplianceWidget = () => {
  return (
    <Card className="border-club-gold/20 bg-club-dark-gray">
      <CardHeader className="pb-3">
        <CardTitle className="text-club-gold text-lg">System Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <p className="text-club-light-gray">
            ✅ Player Analytics Active
          </p>
          <p className="text-xs text-club-light-gray/70 mt-2">
            Core features operational
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
