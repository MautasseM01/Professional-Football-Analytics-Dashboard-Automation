
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const UserManagementCard = () => {
  const { t } = useLanguage();
  
  const userManagement = {
    totalUsers: 127,
    activeUsers: 112,
    pendingUsers: 8,
    roles: [
      { role: t('role.player'), count: 30 },
      { role: t('role.coach'), count: 12 },
      { role: t('role.analyst'), count: 15 },
      { role: t('role.performanceDirector'), count: 8 },
      { role: t('role.management'), count: 5 },
      { role: t('role.admin'), count: 3 },
      { role: t('role.unassigned'), count: 54 }
    ]
  };

  return (
    <Card className="bg-card border-border h-full hover:border-border/60 transition-colors">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-primary text-lg">
          <Users className="mr-2 h-5 w-5" />
          {t('admin.userManagement')}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {t('admin.userManagementDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* User count summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-muted/50 rounded-lg p-3 text-center touch-target-44">
            <div className="text-primary font-bold text-lg">{userManagement.totalUsers}</div>
            <div className="text-xs text-muted-foreground">{t('admin.totalUsers')}</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center touch-target-44">
            <div className="text-primary font-bold text-lg">{userManagement.activeUsers}</div>
            <div className="text-xs text-muted-foreground">{t('admin.activeUsers')}</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center touch-target-44">
            <div className="text-primary font-bold text-lg">{userManagement.pendingUsers}</div>
            <div className="text-xs text-muted-foreground">{t('admin.pendingUsers')}</div>
          </div>
        </div>
        
        {/* Role distribution */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">{t('admin.userRoles')}</h4>
          <div className="grid grid-cols-2 gap-2">
            {userManagement.roles.map((role, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg touch-target-44">
                <span className="text-foreground text-sm">{role.role}</span>
                <Badge variant="secondary" className="text-xs font-medium">
                  {role.count}
                </Badge>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button 
            variant="outline" 
            className="min-h-[48px] text-sm touch-target-44"
          >
            {t('admin.addUser')}
          </Button>
          <Button 
            variant="outline" 
            className="min-h-[48px] text-sm touch-target-44"
          >
            {t('admin.manageRoles')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
