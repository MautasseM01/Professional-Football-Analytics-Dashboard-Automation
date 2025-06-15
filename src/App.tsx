
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
import TeamTacticalAnalysis from "./pages/TeamTacticalAnalysis";
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
                <Route path="/team-performance" element={<TeamOverview />} />
                <Route path="/team-performance/tactical-analysis" element={<TeamTacticalAnalysis />} />
                <Route path="/reports" element={<Dashboard />} />
                <Route path="/settings" element={<Dashboard />} />
                
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
