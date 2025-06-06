
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
import { useIsMobile } from "@/hooks/use-mobile";

interface AdminDashboardProps {
  profile: UserProfile;
}

export const AdminDashboard = ({ profile }: AdminDashboardProps) => {
  const { data: complianceData, isLoading: complianceLoading } = useComplianceData();
  const { data: playersAtRisk, isLoading: playersLoading } = usePlayersAtRisk();
  const isMobile = useIsMobile();

  return (
    <div className={`space-y-3 sm:space-y-4 lg:space-y-6 ${isMobile ? 'p-2' : 'p-3 sm:p-4 lg:p-6'} w-full max-w-7xl mx-auto`}>
      {/* Welcome Header */}
      <div className="flex flex-col gap-1 sm:gap-2">
        <h1 className={`font-bold text-club-gold px-1 ${isMobile ? 'text-lg' : 'text-lg sm:text-xl lg:text-2xl xl:text-3xl'}`}>
          Welcome back, {profile.full_name || "Administrator"}
        </h1>
      </div>

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
        mobileCols={1}
        className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      >
        <UserManagementCard />
        <SystemAdministrationCard />
        <DataPipelineCard />
      </ResponsiveGrid>
    </div>
  );
};
