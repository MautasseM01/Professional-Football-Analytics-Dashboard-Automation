
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, ClipboardList } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const DataPipelineCard = () => {
  const { t } = useLanguage();
  
  const dataImports = [
    { source: "Match Data Pipeline", status: "operational", lastUpdate: `${t('admin.today')} 09:45` },
    { source: "Training Data Sync", status: "warning", lastUpdate: "Hier 18:30" },
    { source: "Video Analysis Feed", status: "operational", lastUpdate: `${t('admin.today')} 10:15` },
    { source: "GPS Data Service", status: "error", lastUpdate: "Il y a 3 jours" }
  ];

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-600 text-white border-green-600';
      case 'warning':
        return 'bg-amber-600 text-white border-amber-600';
      case 'error':
        return 'bg-red-600 text-white border-red-600';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <Card className="bg-card border-border hover:border-border/60 transition-colors">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-primary text-lg">
          <Database className="mr-2 h-5 w-5" />
          {t('admin.dataPipeline')}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {t('admin.dataPipelineDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Data services status */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">{t('admin.dataServices')}</h4>
          <ul className="space-y-2">
            {dataImports.map((service, index) => (
              <li key={index} className="flex justify-between items-center bg-muted/30 p-3 rounded-lg touch-target-44">
                <div className="flex-1 min-w-0 mr-3">
                  <p className="text-foreground truncate text-sm">{service.source}</p>
                  <p className="text-xs text-muted-foreground">Dernière màj: {service.lastUpdate}</p>
                </div>
                <Badge 
                  className={`
                    min-w-[80px] h-8 flex items-center justify-center
                    text-xs font-medium rounded-md
                    flex-shrink-0
                    ${getStatusBadgeClass(service.status)}
                  `}
                >
                  <span className="truncate">{t(`admin.${service.status}`) || service.status}</span>
                </Badge>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Data operations */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="min-h-[48px] text-sm touch-target-44">
            {t('admin.scheduleImport')}
          </Button>
          <Button variant="outline" className="min-h-[48px] text-sm touch-target-44">
            {t('admin.exportData')}
          </Button>
        </div>
        
        {/* System diagnostics */}
        <div>
          <Card className="bg-muted/30 border-border/50">
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-sm flex items-center text-foreground">
                <ClipboardList className="mr-2 h-4 w-4 text-primary" />
                {t('admin.systemDiagnostics')}
              </CardTitle>
            </CardHeader>
            <CardContent className="py-3 px-4">
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-muted-foreground">{t('admin.databaseStatus')}:</span>
                  <span className="text-green-600">{t('admin.online')}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">{t('admin.apiServices')}:</span>
                  <span className="text-green-600">{t('admin.operational')}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">{t('admin.storage')}:</span>
                  <span className="text-amber-600">78% {t('admin.used')}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">{t('admin.lastBackup')}:</span>
                  <span className="text-foreground">{t('admin.today')} 03:00</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};
