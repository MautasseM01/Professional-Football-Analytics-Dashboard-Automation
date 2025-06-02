
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RoleProtectedRoute } from "./components/RoleProtectedRoute";
import Dashboard from "./pages/Dashboard";
import PlayerComparison from "./pages/PlayerComparison";
import PlayerStats from "./pages/PlayerStats";
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
                
                {/* Dashboard - accessible to all authenticated users */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={['admin', 'management', 'performance_director', 'analyst', 'coach', 'player', 'unassigned']}>
                        <Dashboard />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  } 
                />
                
                {/* Player Analysis - Individual Stats (accessible to all roles except unassigned) */}
                <Route 
                  path="/player-analysis" 
                  element={
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={['admin', 'management', 'performance_director', 'analyst', 'coach', 'player']}>
                        <PlayerStats />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/player-analysis/stats" 
                  element={
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={['admin', 'management', 'performance_director', 'analyst', 'coach', 'player']}>
                        <PlayerStats />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  } 
                />
                
                {/* Player Analysis - Comparison (not accessible to players) */}
                <Route 
                  path="/player-analysis/comparison" 
                  element={
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={['admin', 'management', 'performance_director', 'analyst', 'coach']}>
                        <PlayerComparison />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  } 
                />
                
                {/* Player Analysis - Development (not accessible to players) */}
                <Route 
                  path="/player-analysis/development" 
                  element={
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={['admin', 'management', 'performance_director', 'analyst', 'coach']}>
                        <PlayerStats />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  } 
                />
                
                {/* Shot Map (not accessible to players) */}
                <Route 
                  path="/player-analysis/shot-map" 
                  element={
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={['admin', 'management', 'performance_director', 'analyst', 'coach']}>
                        <ShotMap />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  } 
                />
                
                {/* Team Performance - Overview (not accessible to analysts and players) */}
                <Route 
                  path="/team-performance" 
                  element={
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={['admin', 'management', 'performance_director', 'coach']}>
                        <TeamTacticalAnalysis />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  } 
                />
                
                {/* Team Tactical Analysis (accessible to more roles including analysts) */}
                <Route 
                  path="/team-performance/tactical-analysis" 
                  element={
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={['admin', 'management', 'performance_director', 'analyst', 'coach']}>
                        <TeamTacticalAnalysis />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  } 
                />
                
                {/* Reports (higher-level roles only) */}
                <Route 
                  path="/reports" 
                  element={
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={['admin', 'management', 'performance_director', 'analyst']}>
                        <Dashboard />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  } 
                />
                
                {/* Settings (accessible to all except unassigned) */}
                <Route 
                  path="/settings" 
                  element={
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={['admin', 'management', 'performance_director', 'analyst', 'coach', 'player']}>
                        <Dashboard />
                      </RoleProtectedRoute>
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
