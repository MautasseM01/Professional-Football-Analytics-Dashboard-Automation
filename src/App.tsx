
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
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
                
                {/* Reports route - using Dashboard for now since no Reports page exists */}
                <Route 
                  path="/reports" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Settings route - using Dashboard for now since no Settings page exists */}
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
      </BrowserRouter>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
