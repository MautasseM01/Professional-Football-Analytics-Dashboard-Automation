
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
    <div className="space-y-2 xs:space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6">
      <h1 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-club-gold px-1">
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
        minCardWidth="280px"
        className="grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3"
      >
        <UserManagementCard />
        <SystemAdministrationCard />
        <DataPipelineCard />
      </ResponsiveGrid>
    </div>
  );
};
