
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types";
import { Users, Settings, Database, ClipboardList, Shield, AlertTriangle, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/StatCard";
import { useComplianceData } from "@/hooks/use-compliance-data";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminDashboardProps {
  profile: UserProfile;
}

export const AdminDashboard = ({ profile }: AdminDashboardProps) => {
  const { data: complianceData, isLoading: complianceLoading } = useComplianceData();

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

  const recentActivities = [
    { action: "User Added", details: "New analyst account created", time: "2 hours ago" },
    { action: "Role Changed", details: "T. Williams promoted to Coach", time: "1 day ago" },
    { action: "Data Import", details: "Match data imported successfully", time: "2 days ago" },
    { action: "System Update", details: "Dashboard v2.1 deployed", time: "4 days ago" }
  ];

  const dataImports = [
    { source: "Match Data Pipeline", status: "operational", lastUpdate: "Today 09:45" },
    { source: "Training Data Sync", status: "warning", lastUpdate: "Yesterday 18:30" },
    { source: "Video Analysis Feed", status: "operational", lastUpdate: "Today 10:15" },
    { source: "GPS Data Service", status: "error", lastUpdate: "3 days ago" }
  ];

  // Helper functions for compliance score styling
  const getComplianceScoreColor = (score: number) => {
    if (score > 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getComplianceScoreBackground = (score: number) => {
    if (score > 80) return "bg-green-500/10 border-green-500/20";
    if (score >= 60) return "bg-yellow-500/10 border-yellow-500/20";
    return "bg-red-500/10 border-red-500/20";
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-club-gold">
        Welcome back, {profile.full_name || "Administrator"}
      </h1>

      {/* Compliance Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {complianceLoading ? (
          <>
            <Skeleton className="h-24 bg-club-gold/10" />
            <Skeleton className="h-24 bg-club-gold/10" />
            <Skeleton className="h-24 bg-club-gold/10" />
          </>
        ) : (
          <>
            {/* Compliance Score Card */}
            <Card className={`border-club-gold/20 ${getComplianceScoreBackground(complianceData?.complianceScore || 0)}`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-club-light-gray/70">Compliance Score</p>
                    <p className={`text-2xl font-bold ${getComplianceScoreColor(complianceData?.complianceScore || 0)}`}>
                      {complianceData?.complianceScore || 0}%
                    </p>
                  </div>
                  <Shield className="h-8 w-8 text-club-gold/30" />
                </div>
              </CardContent>
            </Card>

            {/* High Risk Players Card */}
            <Card className={`border-club-gold/20 ${(complianceData?.highRiskCount || 0) > 0 ? 'bg-red-500/10 border-red-500/20' : 'bg-green-500/10 border-green-500/20'}`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-club-light-gray/70">High Risk Players</p>
                    <p className={`text-2xl font-bold ${(complianceData?.highRiskCount || 0) > 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {complianceData?.highRiskCount || 0}
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-club-gold/30" />
                </div>
              </CardContent>
            </Card>

            {/* Points Lost Card */}
            <Card className={`border-club-gold/20 ${(complianceData?.pointsDeducted || 0) > 0 ? 'bg-red-500/10 border-red-500/20' : 'bg-green-500/10 border-green-500/20'}`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-club-light-gray/70">Points Lost</p>
                    <p className={`text-2xl font-bold ${(complianceData?.pointsDeducted || 0) > 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {complianceData?.pointsDeducted || 0}
                    </p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-club-gold/30" />
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Management */}
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

        {/* System Settings & Audit Trail */}
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

        {/* Data Import/Export & System Status */}
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
                  <li key={index} className="flex justify-between bg-club-black/40 p-2 rounded">
                    <div>
                      <p className="text-club-light-gray">{service.source}</p>
                      <p className="text-xs text-club-light-gray/70">Last update: {service.lastUpdate}</p>
                    </div>
                    <Badge className={
                      service.status === 'operational' ? 'bg-green-600/80' : 
                      service.status === 'warning' ? 'bg-amber-600/80' : 
                      'bg-red-600/80'
                    }>
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
      </div>
    </div>
  );
};
