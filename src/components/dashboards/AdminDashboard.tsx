
import { UserProfile } from "@/types";
import { useComplianceData } from "@/hooks/use-compliance-data";
import { usePlayersAtRisk } from "@/hooks/use-players-at-risk";
import { ComplianceAlertBanner } from "./admin/ComplianceAlertBanner";
import { ComplianceMetricsCards } from "./admin/ComplianceMetricsCards";
import { PlayersAtRiskSection } from "./admin/PlayersAtRiskSection";
import { UserManagementCard } from "./admin/UserManagementCard";
import { SystemAdministrationCard } from "./admin/SystemAdministrationCard";
import { DataPipelineCard } from "./admin/DataPipelineCard";
import { ResponsiveGrid } from "../ResponsiveLayout";

interface AdminDashboardProps {
  profile: UserProfile;
}

export const AdminDashboard = ({ profile }: AdminDashboardProps) => {
  const { data: complianceData, isLoading: complianceLoading } = useComplianceData();
  const { data: playersAtRisk, isLoading: playersLoading } = usePlayersAtRisk();

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold text-club-gold">
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
      
      {/* Administrative Cards with Responsive Grid */}
      <ResponsiveGrid 
        minCardWidth="300px"
        className="grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
      >
        <UserManagementCard />
        <SystemAdministrationCard />
        <DataPipelineCard />
      </ResponsiveGrid>
    </div>
  );
};
