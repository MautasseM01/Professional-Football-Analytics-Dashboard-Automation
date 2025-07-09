
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const SystemAdministrationCard = () => {
  const { t } = useLanguage();
  
  const recentActivities = [
    { action: t('admin.userAdded'), details: t('admin.newAnalystAccount'), time: `2 ${t('admin.hoursAgo')}` },
    { action: t('admin.roleChanged'), details: t('admin.promotedToCoach'), time: `1 ${t('admin.dayAgo')}` },
    { action: t('admin.dataImport'), details: t('admin.matchDataImported'), time: `2 ${t('admin.daysAgo')}` },
    { action: t('admin.systemUpdate'), details: t('admin.dashboardDeployed'), time: `4 ${t('admin.daysAgo')}` }
  ];

  return (
    <Card className="bg-card border-border h-full hover:border-border/60 transition-colors">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-primary text-lg">
          <Settings className="mr-2 h-5 w-5" />
          {t('admin.systemAdmin')}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {t('admin.systemAdminDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick settings */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">{t('admin.quickSettings')}</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              className="min-h-[48px] text-sm touch-target-44"
            >
              {t('admin.systemConfig')}
            </Button>
            <Button 
              variant="outline" 
              className="min-h-[48px] text-sm touch-target-44"
            >
              {t('admin.permissions')}
            </Button>
            <Button 
              variant="outline" 
              className="min-h-[48px] text-sm touch-target-44"
            >
              {t('admin.notifications')}
            </Button>
            <Button 
              variant="outline" 
              className="min-h-[48px] text-sm touch-target-44"
            >
              {t('admin.apiAccess')}
            </Button>
          </div>
        </div>
        
        {/* Audit trail */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">{t('admin.recentActivities')}</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {recentActivities.map((activity, index) => (
              <div key={index} className="bg-muted/30 p-3 rounded-lg touch-target-44">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-medium text-primary">{activity.action}</span>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
                <p className="text-sm text-foreground leading-tight">{activity.details}</p>
              </div>
            ))}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-3 min-h-[48px] touch-target-44"
          >
            {t('admin.viewAuditLog')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
