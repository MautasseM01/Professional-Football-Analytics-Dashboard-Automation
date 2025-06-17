
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types";
import { Trophy, DollarSign, AlertTriangle, Users, Target, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ManagementDashboardProps {
  profile: UserProfile;
}

export const ManagementDashboard = ({ profile }: ManagementDashboardProps) => {
  return (
    <div className="space-y-3 xs:space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8 p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8">
      {/* Welcome Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-club-gold px-1">
          Management Dashboard
        </h1>
        <p className="text-sm xs:text-base sm:text-lg text-club-light-gray/70 px-1">
          Strategic oversight and team management
        </p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        {/* Team Performance */}
        <Card className="bg-club-dark-gray border-club-gold/20 hover:bg-club-dark-gray/80 transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-club-gold text-base sm:text-lg">
              <Trophy className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Team Performance
            </CardTitle>
            <CardDescription className="text-club-light-gray/70 text-xs sm:text-sm">
              Current league standings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-club-gold">6th</div>
              <div className="text-xs sm:text-sm text-club-light-gray/70">League Position</div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-club-black/40 rounded py-2 px-1">
                <div className="text-lg font-bold text-club-gold">28</div>
                <div className="text-xs text-club-light-gray/70">Points</div>
              </div>
              <div className="bg-club-black/40 rounded py-2 px-1">
                <div className="text-lg font-bold text-club-gold">+6</div>
                <div className="text-xs text-club-light-gray/70">Goal Diff</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Squad Investment */}
        <Card className="bg-club-dark-gray border-club-gold/20 hover:bg-club-dark-gray/80 transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-club-gold text-base sm:text-lg">
              <DollarSign className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Squad Value
            </CardTitle>
            <CardDescription className="text-club-light-gray/70 text-xs sm:text-sm">
              Total investment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-club-gold">€150K</div>
              <div className="text-xs sm:text-sm text-club-light-gray/70">Squad Value</div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-club-black/40 rounded py-2 px-1">
                <div className="text-lg font-bold text-green-500">+8%</div>
                <div className="text-xs text-club-light-gray/70">YoY Growth</div>
              </div>
              <div className="bg-club-black/40 rounded py-2 px-1">
                <div className="text-lg font-bold text-amber-500">5</div>
                <div className="text-xs text-club-light-gray/70">Expiring</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Management */}
        <Card className="bg-club-dark-gray border-club-gold/20 hover:bg-club-dark-gray/80 transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-club-gold text-base sm:text-lg">
              <AlertTriangle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Risk Overview
            </CardTitle>
            <CardDescription className="text-club-light-gray/70 text-xs sm:text-sm">
              Administrative status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-500">3</div>
              <div className="text-xs sm:text-sm text-club-light-gray/70">Active Risks</div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-club-black/40 rounded py-2 px-1">
                <div className="text-lg font-bold text-red-500">1</div>
                <div className="text-xs text-club-light-gray/70">High Risk</div>
              </div>
              <div className="bg-club-black/40 rounded py-2 px-1">
                <div className="text-lg font-bold text-amber-500">2</div>
                <div className="text-xs text-club-light-gray/70">Medium Risk</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Management Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Season Objectives */}
        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardHeader>
            <CardTitle className="flex items-center text-club-gold">
              <Target className="mr-2 h-5 w-5" />
              Season Objectives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-club-black/40 p-3 rounded">
                <span className="text-club-light-gray">Mid-table Finish</span>
                <Badge className="bg-green-600/80">On Track</Badge>
              </div>
              <div className="flex justify-between items-center bg-club-black/40 p-3 rounded">
                <span className="text-club-light-gray">Regional Cup Quarter Final</span>
                <Badge className="bg-green-600/80">Achieved</Badge>
              </div>
              <div className="flex justify-between items-center bg-club-black/40 p-3 rounded">
                <span className="text-club-light-gray">Youth Development Program</span>
                <Badge className="bg-amber-600/80">On Track</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Management Actions */}
        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardHeader>
            <CardTitle className="flex items-center text-club-gold">
              <BarChart3 className="mr-2 h-5 w-5" />
              Management Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full border-club-gold/20 hover:bg-club-gold/10">
              View Financial Report
            </Button>
            <Button variant="outline" className="w-full border-club-gold/20 hover:bg-club-gold/10">
              Contract Management
            </Button>
            <Button variant="outline" className="w-full border-club-gold/20 hover:bg-club-gold/10">
              Administrative Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
