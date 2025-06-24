
import { StatCard } from "@/components/StatCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, Users, Activity } from "lucide-react";
import { ResponsiveGrid } from "@/components/ResponsiveLayout";

interface ComplianceMetricsCardsProps {
  complianceData: any;
  isLoading: boolean;
}

export const ComplianceMetricsCards = ({ complianceData, isLoading }: ComplianceMetricsCardsProps) => {
  if (isLoading) {
    return (
      <ResponsiveGrid minCardWidth="200px" className="grid-cols-1 md:grid-cols-3">
        <Skeleton className="h-32 bg-club-gold/10" />
        <Skeleton className="h-32 bg-club-gold/10" />
        <Skeleton className="h-32 bg-club-gold/10" />
      </ResponsiveGrid>
    );
  }

  return (
    <ResponsiveGrid minCardWidth="200px" className="grid-cols-1 md:grid-cols-3">
      {/* System Status Card */}
      <StatCard
        title="System Status"
        value="Online"
        subValue="All systems operational"
        icon={<Shield className="w-4 h-4 sm:w-5 sm:h-5" />}
        className="border-green-500/20 bg-green-500/10"
      />

      {/* Player Analytics Card */}
      <StatCard
        title="Player Analytics"
        value="Active"
        subValue="Data processing live"
        icon={<Users className="w-4 h-4 sm:w-5 sm:h-5" />}
        className="border-blue-500/20 bg-blue-500/10"
      />

      {/* Core Features Card */}
      <StatCard
        title="Core Features"
        value="Ready"
        subValue="All features enabled"
        icon={<Activity className="w-4 h-4 sm:w-5 sm:h-5" />}
        className="border-green-500/20 bg-green-500/10"
      />
    </ResponsiveGrid>
  );
};
