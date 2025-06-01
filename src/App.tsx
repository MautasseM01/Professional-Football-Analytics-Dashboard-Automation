
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { DevAuthProvider } from "./contexts/DevAuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import PlayerComparison from "./pages/PlayerComparison";
import PlayerStats from "./pages/PlayerStats";
import ShotMap from "./pages/ShotMap";
import TeamTacticalAnalysis from "./pages/TeamTacticalAnalysis";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <BrowserRouter>
        {/* En développement, on wrap avec DevAuthProvider, sinon AuthProvider normal */}
        {process.env.NODE_ENV === 'development' ? (
          <DevAuthProvider>
            <ThemeProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                {/* En mode dev, on affiche directement les routes protégées */}
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/login" element={<Login />} />
                  
                  {/* Main dashboard route */}
                  <Route path="/dashboard" element={<Dashboard />} />
                  
                  {/* Player Analysis routes */}
                  <Route path="/player-analysis" element={<PlayerStats />} />
                  <Route path="/player-analysis/stats" element={<PlayerStats />} />
                  <Route path="/player-analysis/comparison" element={<PlayerComparison />} />
                  <Route path="/player-analysis/development" element={<PlayerStats />} />
                  <Route path="/player-analysis/shot-map" element={<ShotMap />} />
                  
                  {/* Team Performance routes */}
                  <Route path="/team-performance" element={<TeamTacticalAnalysis />} />
                  <Route path="/team-performance/tactical-analysis" element={<TeamTacticalAnalysis />} />
                  
                  {/* Reports and Settings routes */}
                  <Route path="/reports" element={<Dashboard />} />
                  <Route path="/settings" element={<Dashboard />} />
                  
                  {/* 404 Not Found */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </TooltipProvider>
            </ThemeProvider>
          </DevAuthProvider>
        ) : (
          <AuthProvider>
            <ThemeProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/login" element={<Login />} />
                  
                  {/* Main dashboard route */}
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Player Analysis routes */}
                  <Route 
                    path="/player-analysis" 
                    element={
                      <ProtectedRoute>
                        <PlayerStats />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/player-analysis/stats" 
                    element={
                      <ProtectedRoute>
                        <PlayerStats />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/player-analysis/comparison" 
                    element={
                      <ProtectedRoute>
                        <PlayerComparison />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/player-analysis/development" 
                    element={
                      <ProtectedRoute>
                        <PlayerStats />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Shot Map route */}
                  <Route 
                    path="/player-analysis/shot-map" 
                    element={
                      <ProtectedRoute>
                        <ShotMap />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Team Performance routes */}
                  <Route 
                    path="/team-performance" 
                    element={
                      <ProtectedRoute>
                        <TeamTacticalAnalysis />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Team Tactical Analysis route */}
                  <Route 
                    path="/team-performance/tactical-analysis" 
                    element={
                      <ProtectedRoute>
                        <TeamTacticalAnalysis />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Reports route */}
                  <Route 
                    path="/reports" 
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Settings route */}
                  <Route 
                    path="/settings" 
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* 404 Not Found */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </TooltipProvider>
            </ThemeProvider>
          </AuthProvider>
        )}
      </BrowserRouter>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
