
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types";
import { BadgeCheck, FileText, LineChart, Database, ServerCrash } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AnalystDashboardProps {
  profile: UserProfile;
}

export const AnalystDashboard = ({ profile }: AnalystDashboardProps) => {
  const dataValidation = [
    { source: "Match Data (vs Barcelona)", status: "valid", timestamp: "May 20, 2025" },
    { source: "Training Data (Week 21)", status: "warning", timestamp: "May 19, 2025" },
    { source: "GPS Data Import", status: "valid", timestamp: "May 18, 2025" },
    { source: "Video Analysis Tags", status: "error", timestamp: "May 16, 2025" }
  ];

  const quickReports = [
    { name: "Post-Match Analysis", description: "Comprehensive review of latest match", type: "match" },
    { name: "Player Performance Trends", description: "Last 5 matches analysis", type: "player" },
    { name: "Tactical Breakdown", description: "Formation and positioning analysis", type: "tactical" },
    { name: "Opposition Report", description: "Next opponent analysis", type: "opponent" }
  ];

  const visualizations = [
    { name: "Passing Networks", description: "Team connection maps" },
    { name: "Shot Maps", description: "xG and shot locations" },
    { name: "Defensive Coverage", description: "Defensive actions heatmaps" },
    { name: "Physical Performance", description: "Distance and intensity charts" }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-club-gold">
        Welcome back, {profile.full_name || "Analyst"}
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Data Validation Status */}
        <Card className="bg-club-dark-gray border-club-gold/20 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-club-gold">
              <Database className="mr-2 h-5 w-5" />
              Data Validation Status
            </CardTitle>
            <CardDescription className="text-club-light-gray/70">
              Recent data imports and quality checks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {dataValidation.map((item, index) => (
                <li key={index} className="flex justify-between items-center p-2 bg-club-black/40 rounded">
                  <div>
                    <div className="flex items-center gap-2">
                      {item.status === 'valid' ? (
                        <BadgeCheck className="h-4 w-4 text-green-500" />
                      ) : item.status === 'warning' ? (
                        <ServerCrash className="h-4 w-4 text-amber-500" />
                      ) : (
                        <ServerCrash className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-club-light-gray">{item.source}</span>
                    </div>
                    <span className="text-xs text-club-light-gray/70">{item.timestamp}</span>
                  </div>
                  <Badge className={
                    item.status === 'valid' ? "bg-green-600/80" : 
                    item.status === 'warning' ? "bg-amber-600/80" : 
                    "bg-red-600/80"
                  }>
                    {item.status}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Quick Reports */}
        <Card className="bg-club-dark-gray border-club-gold/20 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-club-gold">
              <FileText className="mr-2 h-5 w-5" />
              Quick Reports
            </CardTitle>
            <CardDescription className="text-club-light-gray/70">
              Pre-configured report templates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {quickReports.map((report, index) => (
                <Button 
                  key={index}
                  variant="outline" 
                  className="border-club-gold/20 hover:bg-club-gold/10 justify-between h-auto py-2 px-3"
                >
                  <div className="text-left">
                    <p className="font-medium text-club-light-gray">{report.name}</p>
                    <p className="text-xs text-club-light-gray/70">{report.description}</p>
                  </div>
                  <Badge variant="outline" className="border-club-gold/30 text-club-light-gray ml-2 whitespace-nowrap">
                    {report.type}
                  </Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Advanced Visualizations & Custom Query */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-club-dark-gray border-club-gold/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-club-gold">
                <LineChart className="mr-2 h-5 w-5" />
                Advanced Visualizations
              </CardTitle>
              <CardDescription className="text-club-light-gray/70">
                Detailed data visualization tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                {visualizations.map((viz, index) => (
                  <Button 
                    key={index}
                    variant="ghost" 
                    className="justify-start h-auto py-2 hover:bg-club-gold/10 hover:text-club-gold"
                  >
                    <div className="text-left">
                      <p className="font-medium">{viz.name}</p>
                      <p className="text-xs text-club-light-gray/70">{viz.description}</p>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-club-dark-gray border-club-gold/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-club-gold">Custom Analysis Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-club-gold hover:bg-club-gold/90 text-club-black">
                <Database className="mr-2 h-4 w-4" />
                Create Custom Query
              </Button>
              <Button variant="outline" className="w-full border-club-gold/20 hover:bg-club-gold/10">
                <LineChart className="mr-2 h-4 w-4" />
                Chart Builder
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
