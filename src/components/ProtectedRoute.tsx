
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  // Check for demo mode
  const isDemoMode = localStorage.getItem("demoMode") === "true";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-club-black">
        <div className="animate-spin w-8 h-8 border-4 border-club-gold border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user && !isDemoMode) {
    // Store the current location for redirecting back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
