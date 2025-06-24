
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export const SystemAdministrationCard = () => {
  const recentActivities = [
    { action: "User Added", details: "New analyst account created", time: "2 hours ago" },
    { action: "Role Changed", details: "T. Williams promoted to Coach", time: "1 day ago" },
    { action: "Data Import", details: "Match data imported successfully", time: "2 days ago" },
    { action: "System Update", details: "Dashboard v2.1 deployed", time: "4 days ago" }
  ];

  return (
    <Card className="bg-club-dark-gray border-club-gold/20 h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-club-gold text-lg">
          <Settings className="mr-2 h-5 w-5" />
          System Administration
        </CardTitle>
        <CardDescription className="text-club-light-gray/70">
          Configuration and audit trail
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick settings */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-club-light-gray">Quick Settings</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              className="border-club-gold/20 hover:bg-club-gold/10 min-h-[44px] text-sm"
            >
              System Config
            </Button>
            <Button 
              variant="outline" 
              className="border-club-gold/20 hover:bg-club-gold/10 min-h-[44px] text-sm"
            >
              Permissions
            </Button>
            <Button 
              variant="outline" 
              className="border-club-gold/20 hover:bg-club-gold/10 min-h-[44px] text-sm"
            >
              Notifications
            </Button>
            <Button 
              variant="outline" 
              className="border-club-gold/20 hover:bg-club-gold/10 min-h-[44px] text-sm"
            >
              API Access
            </Button>
          </div>
        </div>
        
        {/* Audit trail */}
        <div>
          <h4 className="text-sm font-medium text-club-light-gray mb-3">Recent Activities</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {recentActivities.map((activity, index) => (
              <div key={index} className="bg-club-black/40 p-3 rounded">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-medium text-club-gold">{activity.action}</span>
                  <span className="text-xs text-club-light-gray/70">{activity.time}</span>
                </div>
                <p className="text-sm text-club-light-gray leading-tight">{activity.details}</p>
              </div>
            ))}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-3 hover:bg-club-gold/10 min-h-[44px]"
          >
            View Full Audit Log
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
