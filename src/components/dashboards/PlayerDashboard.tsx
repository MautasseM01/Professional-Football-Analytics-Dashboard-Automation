
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserProfile } from "@/types";
import { CalendarDays, Target, BarChart } from "lucide-react";

interface PlayerDashboardProps {
  profile: UserProfile;
}

export const PlayerDashboard = ({ profile }: PlayerDashboardProps) => {
  const fixtures = [
    { opponent: "FC Barcelona", date: "May 25, 2025", location: "Away" },
    { opponent: "Real Madrid", date: "June 2, 2025", location: "Home" }
  ];

  const developmentTargets = [
    { target: "Improve passing accuracy to 85%", progress: 78 },
    { target: "Increase defensive actions per game", progress: 65 }
  ];

  const recentPerformance = {
    match: "vs. Atletico Madrid (May 18, 2025)",
    minutesPlayed: 87,
    passAccuracy: 81,
    distanceCovered: 10.7,
    sprints: 18
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-club-gold">
        Welcome back, {profile.full_name || "Player"}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upcoming Fixtures */}
        <Card className="bg-club-dark-gray border-club-gold/20 col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-club-gold">
              <CalendarDays className="mr-2 h-5 w-5" />
              My Upcoming Fixtures
            </CardTitle>
            <CardDescription className="text-club-light-gray/70">
              Your next matches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {fixtures.map((fixture, index) => (
                <li key={index} className="bg-club-black/40 p-3 rounded-md">
                  <p className="font-medium text-club-light-gray">{fixture.opponent}</p>
                  <div className="flex justify-between text-sm text-club-light-gray/70">
                    <span>{fixture.date}</span>
                    <span>{fixture.location}</span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Development Targets */}
        <Card className="bg-club-dark-gray border-club-gold/20 col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-club-gold">
              <Target className="mr-2 h-5 w-5" />
              My Development Targets
            </CardTitle>
            <CardDescription className="text-club-light-gray/70">
              Areas of focus from coaching staff
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {developmentTargets.map((target, index) => (
                <li key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-club-light-gray">{target.target}</span>
                    <span className="text-club-gold">{target.progress}%</span>
                  </div>
                  <div className="w-full bg-club-black/60 rounded-full h-2">
                    <div 
                      className="bg-club-gold h-2 rounded-full" 
                      style={{ width: `${target.progress}%` }}
                    ></div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Recent Performance */}
        <Card className="bg-club-dark-gray border-club-gold/20 col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-club-gold">
              <BarChart className="mr-2 h-5 w-5" />
              Recent Performance
            </CardTitle>
            <CardDescription className="text-club-light-gray/70">
              {recentPerformance.match}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-club-light-gray">
              <li className="flex justify-between py-1 border-b border-club-gold/10">
                <span>Minutes Played:</span>
                <span className="font-medium">{recentPerformance.minutesPlayed}</span>
              </li>
              <li className="flex justify-between py-1 border-b border-club-gold/10">
                <span>Pass Accuracy:</span>
                <span className="font-medium">{recentPerformance.passAccuracy}%</span>
              </li>
              <li className="flex justify-between py-1 border-b border-club-gold/10">
                <span>Distance Covered:</span>
                <span className="font-medium">{recentPerformance.distanceCovered} km</span>
              </li>
              <li className="flex justify-between py-1">
                <span>Sprints:</span>
                <span className="font-medium">{recentPerformance.sprints}</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
