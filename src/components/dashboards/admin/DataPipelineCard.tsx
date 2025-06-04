
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, ClipboardList } from "lucide-react";

export const DataPipelineCard = () => {
  const dataImports = [
    { source: "Match Data Pipeline", status: "operational", lastUpdate: "Today 09:45" },
    { source: "Training Data Sync", status: "warning", lastUpdate: "Yesterday 18:30" },
    { source: "Video Analysis Feed", status: "operational", lastUpdate: "Today 10:15" },
    { source: "GPS Data Service", status: "error", lastUpdate: "3 days ago" }
  ];

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-600/80 text-white border-green-600/80';
      case 'warning':
        return 'bg-amber-600/80 text-white border-amber-600/80';
      case 'error':
        return 'bg-red-600/80 text-white border-red-600/80';
      default:
        return 'bg-gray-600/80 text-white border-gray-600/80';
    }
  };

  return (
    <Card className="bg-club-dark-gray border-club-gold/20">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-club-gold">
          <Database className="mr-2 h-5 w-5" />
          Data Pipeline Status
        </CardTitle>
        <CardDescription className="text-club-light-gray/70">
          Import/export operations and system health
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Data services status */}
        <div>
          <h4 className="text-sm font-medium text-club-light-gray mb-2">Data Services</h4>
          <ul className="space-y-2">
            {dataImports.map((service, index) => (
              <li key={index} className="flex justify-between items-center bg-club-black/40 p-3 rounded">
                <div className="flex-1 min-w-0 mr-3">
                  <p className="text-club-light-gray truncate">{service.source}</p>
                  <p className="text-xs text-club-light-gray/70">Last update: {service.lastUpdate}</p>
                </div>
                <Badge 
                  className={`
                    w-20 h-8 flex items-center justify-center
                    text-xs font-medium rounded-md
                    flex-shrink-0
                    ${getStatusBadgeClass(service.status)}
                  `}
                >
                  {service.status}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Data operations */}
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" className="border-club-gold/20 hover:bg-club-gold/10">
            Schedule Import
          </Button>
          <Button variant="outline" className="border-club-gold/20 hover:bg-club-gold/10">
            Export Data
          </Button>
        </div>
        
        {/* System diagnostics */}
        <div className="mt-4">
          <Card className="bg-club-black/40 border-club-gold/10">
            <CardHeader className="py-2 px-3">
              <CardTitle className="text-sm flex items-center text-club-light-gray">
                <ClipboardList className="mr-2 h-4 w-4 text-club-gold" />
                System Diagnostics
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2 px-3">
              <ul className="space-y-1 text-xs">
                <li className="flex justify-between">
                  <span className="text-club-light-gray/70">Database Status:</span>
                  <span className="text-green-400">Online</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-club-light-gray/70">API Services:</span>
                  <span className="text-green-400">Operational</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-club-light-gray/70">Storage:</span>
                  <span className="text-amber-400">78% Used</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-club-light-gray/70">Last Backup:</span>
                  <span className="text-club-light-gray">Today 03:00</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};
