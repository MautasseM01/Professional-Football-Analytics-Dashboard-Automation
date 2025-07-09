
import { UserProfile } from "@/types";
import { useComplianceData } from "@/hooks/use-compliance-data";
import { usePlayersAtRisk } from "@/hooks/use-players-at-risk";
import { useLanguage } from "@/contexts/LanguageContext";
import { ComplianceAlertBanner } from "./admin/ComplianceAlertBanner";
import { ComplianceMetricsCards } from "./admin/ComplianceMetricsCards";
import { ComplianceOverviewCard } from "./admin/ComplianceOverviewCard";
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
  const { t } = useLanguage();

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-2">
          {t('admin.welcome')}, {profile.full_name || t('role.admin')}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          {t('admin.systemManagement')}
        </p>
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

      {/* Compliance Overview Card */}
      <ComplianceOverviewCard />

      {/* Players at Risk Section */}
      <PlayersAtRiskSection 
        playersAtRisk={playersAtRisk} 
        isLoading={playersLoading} 
      />
      
      {/* Administrative Cards */}
      <ResponsiveGrid 
        minCardWidth="320px"
        className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
      >
        <UserManagementCard />
        <SystemAdministrationCard />
        <DataPipelineCard />
      </ResponsiveGrid>
    </div>
  );
};
