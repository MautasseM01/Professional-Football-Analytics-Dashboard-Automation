
import { usePlayerData } from "@/hooks/use-player-data";
import { UserProfile } from "@/types";
import { PlayerStats } from "@/components/PlayerStats";
import { PlayerSelector } from "@/components/PlayerSelector";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, PieChart, TrendingUp, FileText, Download } from "lucide-react";
import { ResponsiveGrid } from "../ResponsiveLayout";

interface AnalystDashboardProps {
  profile: UserProfile;
}

export const AnalystDashboard = ({ profile }: AnalystDashboardProps) => {
  const { players, selectedPlayer, selectPlayer, loading } = usePlayerData();

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 lg:p-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-club-gold mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-xs sm:text-sm lg:text-base text-club-light-gray/70">
          Deep dive into player and team performance analytics
        </p>
      </div>

      {/* Analytics Overview Cards with Responsive Grid */}
      <ResponsiveGrid mobileCols={2} className="grid-cols-2 sm:grid-cols-2 md:grid-cols-4">
        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardHeader className="pb-2 p-3 sm:p-4">
            <CardTitle className="flex items-center text-club-gold text-xs sm:text-sm">
              <BarChart3 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Data Points</span>
              <span className="xs:hidden">Data</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-club-light-gray">15.2K</div>
            <p className="text-xs text-club-light-gray/70">This Season</p>
          </CardContent>
        </Card>

        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardHeader className="pb-2 p-3 sm:p-4">
            <CardTitle className="flex items-center text-club-gold text-xs sm:text-sm">
              <PieChart className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Metrics Tracked</span>
              <span className="xs:hidden">Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-club-light-gray">47</div>
            <p className="text-xs text-club-light-gray/70">Active KPIs</p>
          </CardContent>
        </Card>

        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardHeader className="pb-2 p-3 sm:p-4">
            <CardTitle className="flex items-center text-club-gold text-xs sm:text-sm">
              <TrendingUp className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Models Active</span>
              <span className="xs:hidden">Models</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-club-light-gray">8</div>
            <p className="text-xs text-club-light-gray/70">Predictive Models</p>
          </CardContent>
        </Card>

        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardHeader className="pb-2 p-3 sm:p-4">
            <CardTitle className="flex items-center text-club-gold text-xs sm:text-sm">
              <FileText className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-club-light-gray">23</div>
            <p className="text-xs text-club-light-gray/70">This Month</p>
          </CardContent>
        </Card>
      </ResponsiveGrid>

      {/* Advanced Analytics Tools */}
      <Card className="bg-club-dark-gray border-club-gold/20">
        <CardHeader className="p-3 sm:p-4">
          <CardTitle className="text-club-gold text-sm sm:text-base">Advanced Analytics Tools</CardTitle>
          <CardDescription className="text-club-light-gray/70 text-xs sm:text-sm">
            Generate comprehensive reports and analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 pt-0">
          <ResponsiveGrid mobileCols={1} className="grid-cols-1 sm:grid-cols-2">
            <Button variant="outline" className="border-club-gold/20 hover:bg-club-gold/10 flex items-center gap-2 justify-start text-xs sm:text-sm min-h-[44px]">
              <Download className="h-3 w-3 sm:h-4 sm:w-4" />
              Export Player Data
            </Button>
            <Button variant="outline" className="border-club-gold/20 hover:bg-club-gold/10 flex items-center gap-2 justify-start text-xs sm:text-sm min-h-[44px]">
              <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
              Generate Team Report
            </Button>
            <Button variant="outline" className="border-club-gold/20 hover:bg-club-gold/10 flex items-center gap-2 justify-start text-xs sm:text-sm min-h-[44px]">
              <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
              Performance Trends
            </Button>
            <Button variant="outline" className="border-club-gold/20 hover:bg-club-gold/10 flex items-center gap-2 justify-start text-xs sm:text-sm min-h-[44px]">
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
              Predictive Analysis
            </Button>
          </ResponsiveGrid>
        </CardContent>
      </Card>

      {/* Player Selector */}
      <PlayerSelector
        players={players}
        selectedPlayer={selectedPlayer}
        onPlayerSelect={selectPlayer}
        loading={loading}
      />

      {/* Player Stats Component */}
      {selectedPlayer && <PlayerStats player={selectedPlayer} />}
    </div>
  );
};
