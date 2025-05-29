
import { UserProfile } from "@/types";
import { useComplianceData } from "@/hooks/use-compliance-data";
import { usePlayersAtRisk } from "@/hooks/use-players-at-risk";
import { ComplianceAlertBanner } from "./admin/ComplianceAlertBanner";
import { ComplianceMetricsCards } from "./admin/ComplianceMetricsCards";
import { PlayersAtRiskSection } from "./admin/PlayersAtRiskSection";
import { UserManagementCard } from "./admin/UserManagementCard";
import { SystemAdministrationCard } from "./admin/SystemAdministrationCard";
import { DataPipelineCard } from "./admin/DataPipelineCard";

interface AdminDashboardProps {
  profile: UserProfile;
}

export const AdminDashboard = ({ profile }: AdminDashboardProps) => {
  const { data: complianceData, isLoading: complianceLoading } = useComplianceData();
  const { data: playersAtRisk, isLoading: playersLoading } = usePlayersAtRisk();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-club-gold">
        Welcome back, {profile.full_name || "Administrator"}
      </h1>

      {/* Compliance Alert Banner */}
      <ComplianceAlertBanner 
        complianceData={complianceData} 
        isLoading={complianceLoading} 
      />

      {/* Compliance Metrics Cards */}
      <ComplianceMetricsCards 
        complianceData={complianceData} 
        isLoading={complianceLoading} 
      />

      {/* Players at Risk Section */}
      <PlayersAtRiskSection 
        playersAtRisk={playersAtRisk} 
        isLoading={playersLoading} 
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Management */}
        <UserManagementCard />

        {/* System Settings & Audit Trail */}
        <SystemAdministrationCard />

        {/* Data Import/Export & System Status */}
        <DataPipelineCard />
      </div>
    </div>
  );
};
