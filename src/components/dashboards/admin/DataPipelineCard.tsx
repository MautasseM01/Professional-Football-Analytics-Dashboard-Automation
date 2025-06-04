
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
      <CardHeader className="pb-2 p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 sm:pb-2">
        <CardTitle className="flex items-center text-club-gold text-xs xs:text-sm sm:text-base md:text-lg">
          <Database className="mr-2 h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5" />
          Data Pipeline Status
        </CardTitle>
        <CardDescription className="text-club-light-gray/70 text-xs xs:text-sm md:text-base">
          Import/export operations and system health
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 xs:space-y-3 sm:space-y-4 p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6">
        {/* Data services status */}
        <div>
          <h4 className="text-xs xs:text-sm md:text-base font-medium text-club-light-gray mb-2">Data Services</h4>
          <ul className="space-y-2">
            {dataImports.map((service, index) => (
              <li key={index} className="flex justify-between items-center bg-club-black/40 p-2 xs:p-3 md:p-4 rounded">
                <div className="flex-1 min-w-0 mr-2 xs:mr-3">
                  <p className="text-club-light-gray truncate text-xs xs:text-sm md:text-base">{service.source}</p>
                  <p className="text-xs md:text-sm text-club-light-gray/70">Last update: {service.lastUpdate}</p>
                </div>
                <Badge 
                  className={`
                    w-20 h-8 flex items-center justify-center
                    text-xs md:text-sm font-medium rounded-md
                    flex-shrink-0
                    ${getStatusBadgeClass(service.status)}
                  `}
                >
                  <span className="truncate">{service.status}</span>
                </Badge>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Data operations */}
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
          <Button variant="outline" className="border-club-gold/20 hover:bg-club-gold/10 text-xs xs:text-sm md:text-base h-8 xs:h-9 md:h-10 touch-target-44">
            Schedule Import
          </Button>
          <Button variant="outline" className="border-club-gold/20 hover:bg-club-gold/10 text-xs xs:text-sm md:text-base h-8 xs:h-9 md:h-10 touch-target-44">
            Export Data
          </Button>
        </div>
        
        {/* System diagnostics */}
        <div className="mt-2 xs:mt-3 sm:mt-4">
          <Card className="bg-club-black/40 border-club-gold/10">
            <CardHeader className="py-2 px-2 xs:px-3 md:px-4">
              <CardTitle className="text-xs xs:text-sm md:text-base flex items-center text-club-light-gray">
                <ClipboardList className="mr-2 h-3 w-3 xs:h-4 xs:w-4 text-club-gold" />
                System Diagnostics
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2 px-2 xs:px-3 md:px-4">
              <ul className="space-y-1 text-xs md:text-sm">
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
