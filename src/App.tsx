
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Dashboard from "./pages/Dashboard";
import PlayerComparison from "./pages/PlayerComparison";
import PlayerStats from "./pages/PlayerStats";
import PlayerDevelopment from "./pages/PlayerDevelopment";
import TeamOverview from "./pages/TeamOverview";
import ShotMap from "./pages/ShotMap";
import GoalsAssistsAnalysis from "./pages/GoalsAssistsAnalysis";
import TeamTacticalAnalysis from "./pages/TeamTacticalAnalysis";
import MatchDataImport from "./pages/MatchDataImport";
import PointsDeductionTracker from "./pages/PointsDeductionTracker";
import AIAnalytics from "./pages/AIAnalytics";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { AccessDenied } from "./components/AccessDenied";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/access-denied" element={<AccessDenied />} />
                
                {/* All routes now publicly accessible for demo */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/player-analysis" element={<PlayerStats />} />
                <Route path="/player-analysis/stats" element={<PlayerStats />} />
                <Route path="/player-analysis/comparison" element={<PlayerComparison />} />
                <Route path="/player-analysis/development" element={<PlayerDevelopment />} />
                <Route path="/player-analysis/shot-map" element={<ShotMap />} />
                <Route path="/player-analysis/goals-assists" element={<GoalsAssistsAnalysis />} />
                
                {/* Team Performance routes - redirect base path to overview */}
                <Route path="/team-performance" element={<Navigate to="/team-performance/overview" replace />} />
                <Route path="/team-performance/overview" element={<TeamOverview />} />
                <Route path="/team-performance/tactical-analysis" element={<TeamTacticalAnalysis />} />
                <Route path="/team-performance/points-deductions" element={<PointsDeductionTracker />} />
                
                <Route path="/analytics" element={<AIAnalytics />} />
                <Route path="/reports" element={<Dashboard />} />
                <Route path="/settings" element={<Dashboard />} />
                <Route path="/match-data-import" element={<MatchDataImport />} />
                
                {/* 404 Not Found */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
