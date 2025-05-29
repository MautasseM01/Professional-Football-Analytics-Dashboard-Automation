
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
    <Card className="bg-club-dark-gray border-club-gold/20">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-club-gold">
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
            <Button variant="outline" className="border-club-gold/20 hover:bg-club-gold/10">
              System Config
            </Button>
            <Button variant="outline" className="border-club-gold/20 hover:bg-club-gold/10">
              Permissions
            </Button>
            <Button variant="outline" className="border-club-gold/20 hover:bg-club-gold/10">
              Notifications
            </Button>
            <Button variant="outline" className="border-club-gold/20 hover:bg-club-gold/10">
              API Access
            </Button>
          </div>
        </div>
        
        {/* Audit trail */}
        <div>
          <h4 className="text-sm font-medium text-club-light-gray mb-2">Recent Activities</h4>
          <ul className="space-y-2">
            {recentActivities.map((activity, index) => (
              <li key={index} className="bg-club-black/40 p-2 rounded">
                <div className="flex justify-between text-xs text-club-light-gray/70">
                  <span>{activity.action}</span>
                  <span>{activity.time}</span>
                </div>
                <p className="text-sm text-club-light-gray">{activity.details}</p>
              </li>
            ))}
          </ul>
          <Button variant="ghost" size="sm" className="w-full mt-2 hover:bg-club-gold/10">
            View Full Audit Log
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
