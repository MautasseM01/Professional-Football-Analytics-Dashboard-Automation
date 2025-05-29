
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
    <Card className="bg-club-dark-gray border-club-gold/20">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-club-gold">
          <Users className="mr-2 h-5 w-5" />
          User Management
        </CardTitle>
        <CardDescription className="text-club-light-gray/70">
          Account overview and statistics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* User count summary */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-club-black/40 rounded p-2 text-center">
            <div className="text-club-gold font-bold">{userManagement.totalUsers}</div>
            <div className="text-xs text-club-light-gray/70">Total Users</div>
          </div>
          <div className="bg-club-black/40 rounded p-2 text-center">
            <div className="text-club-gold font-bold">{userManagement.activeUsers}</div>
            <div className="text-xs text-club-light-gray/70">Active</div>
          </div>
          <div className="bg-club-black/40 rounded p-2 text-center">
            <div className="text-club-gold font-bold">{userManagement.pendingUsers}</div>
            <div className="text-xs text-club-light-gray/70">Pending</div>
          </div>
        </div>
        
        {/* Role distribution */}
        <div>
          <h4 className="text-sm font-medium text-club-light-gray mb-2">User Roles</h4>
          <div className="grid grid-cols-2 gap-2">
            {userManagement.roles.map((role, index) => (
              <div key={index} className="flex justify-between p-2 bg-club-black/40 rounded">
                <span className="text-club-light-gray">{role.role}</span>
                <Badge variant="outline" className="border-club-gold/30 text-club-light-gray">
                  {role.count}
                </Badge>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between space-x-2">
          <Button variant="outline" className="flex-1 border-club-gold/20 hover:bg-club-gold/10">
            Add User
          </Button>
          <Button variant="outline" className="flex-1 border-club-gold/20 hover:bg-club-gold/10">
            Manage Roles
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
