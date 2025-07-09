
import { StatCard } from "@/components/StatCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, Users, Activity } from "lucide-react";
import { ResponsiveGrid } from "@/components/ResponsiveLayout";
import { useLanguage } from "@/contexts/LanguageContext";

interface ComplianceMetricsCardsProps {
  complianceData: any;
  isLoading: boolean;
}

export const ComplianceMetricsCards = ({ complianceData, isLoading }: ComplianceMetricsCardsProps) => {
  const { t } = useLanguage();
  
  if (isLoading) {
    return (
      <ResponsiveGrid minCardWidth="240px" className="grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-32 bg-muted/50" />
        <Skeleton className="h-32 bg-muted/50" />
        <Skeleton className="h-32 bg-muted/50" />
      </ResponsiveGrid>
    );
  }

  return (
    <ResponsiveGrid minCardWidth="240px" className="grid-cols-1 md:grid-cols-3 gap-4">
      {/* System Status Card */}
      <StatCard
        title={t('admin.systemStatus')}
        value={t('admin.online')}
        subValue={t('admin.allSystems')}
        icon={<Shield className="w-4 h-4 sm:w-5 sm:h-5" />}
        className="border-green-500/30 bg-green-500/10 hover:border-green-500/50 transition-colors"
      />

      {/* Player Analytics Card */}
      <StatCard
        title={t('admin.playerAnalytics')}
        value="Actif"
        subValue={t('admin.dataProcessing')}
        icon={<Users className="w-4 h-4 sm:w-5 sm:h-5" />}
        className="border-blue-500/30 bg-blue-500/10 hover:border-blue-500/50 transition-colors"
      />

      {/* Core Features Card */}
      <StatCard
        title={t('admin.coreFeatures')}
        value="Prêt"
        subValue={t('admin.allFeatures')}
        icon={<Activity className="w-4 h-4 sm:w-5 sm:h-5" />}
        className="border-green-500/30 bg-green-500/10 hover:border-green-500/50 transition-colors"
      />
    </ResponsiveGrid>
  );
};
