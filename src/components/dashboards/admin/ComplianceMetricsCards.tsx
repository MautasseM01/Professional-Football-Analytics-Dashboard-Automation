
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, Users, Activity } from "lucide-react";

interface ComplianceMetricsCardsProps {
  complianceData: any;
  isLoading: boolean;
}

export const ComplianceMetricsCards = ({ complianceData, isLoading }: ComplianceMetricsCardsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-24 bg-club-gold/10" />
        <Skeleton className="h-24 bg-club-gold/10" />
        <Skeleton className="h-24 bg-club-gold/10" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* System Status Card */}
      <Card className="border-club-gold/20 bg-green-500/10 border-green-500/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-club-light-gray/70">System Status</p>
              <p className="text-2xl font-bold text-green-500">Online</p>
            </div>
            <Shield className="h-8 w-8 text-club-gold/30" />
          </div>
        </CardContent>
      </Card>

      {/* Player Analytics Card */}
      <Card className="border-club-gold/20 bg-blue-500/10 border-blue-500/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-club-light-gray/70">Player Analytics</p>
              <p className="text-2xl font-bold text-blue-500">Active</p>
            </div>
            <Users className="h-8 w-8 text-club-gold/30" />
          </div>
        </CardContent>
      </Card>

      {/* Core Features Card */}
      <Card className="border-club-gold/20 bg-green-500/10 border-green-500/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-club-light-gray/70">Core Features</p>
              <p className="text-2xl font-bold text-green-500">Ready</p>
            </div>
            <Activity className="h-8 w-8 text-club-gold/30" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
