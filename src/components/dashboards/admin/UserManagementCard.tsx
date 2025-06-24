
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

export const UserManagementCard = () => {
  const userManagement = {
    totalUsers: 127,
    activeUsers: 112,
    pendingUsers: 8,
    roles: [
      { role: "Player", count: 30 },
      { role: "Coach", count: 12 },
      { role: "Analyst", count: 15 },
      { role: "Performance", count: 8 },
      { role: "Management", count: 5 },
      { role: "Admin", count: 3 },
      { role: "Unassigned", count: 54 }
    ]
  };

  return (
    <Card className="bg-club-dark-gray border-club-gold/20 h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-club-gold text-lg">
          <Users className="mr-2 h-5 w-5" />
          User Management
        </CardTitle>
        <CardDescription className="text-club-light-gray/70">
          Account overview and statistics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* User count summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-club-black/40 rounded-lg p-3 text-center">
            <div className="text-club-gold font-bold text-lg">{userManagement.totalUsers}</div>
            <div className="text-xs text-club-light-gray/70">Total Users</div>
          </div>
          <div className="bg-club-black/40 rounded-lg p-3 text-center">
            <div className="text-club-gold font-bold text-lg">{userManagement.activeUsers}</div>
            <div className="text-xs text-club-light-gray/70">Active</div>
          </div>
          <div className="bg-club-black/40 rounded-lg p-3 text-center">
            <div className="text-club-gold font-bold text-lg">{userManagement.pendingUsers}</div>
            <div className="text-xs text-club-light-gray/70">Pending</div>
          </div>
        </div>
        
        {/* Role distribution */}
        <div>
          <h4 className="text-sm font-medium text-club-light-gray mb-3">User Roles</h4>
          <div className="grid grid-cols-2 gap-2">
            {userManagement.roles.map((role, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-club-black/40 rounded">
                <span className="text-club-light-gray text-sm">{role.role}</span>
                <Badge variant="outline" className="border-club-gold/30 text-club-light-gray text-xs">
                  {role.count}
                </Badge>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button 
            variant="outline" 
            className="border-club-gold/20 hover:bg-club-gold/10 min-h-[44px] text-sm"
          >
            Add User
          </Button>
          <Button 
            variant="outline" 
            className="border-club-gold/20 hover:bg-club-gold/10 min-h-[44px] text-sm"
          >
            Manage Roles
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
