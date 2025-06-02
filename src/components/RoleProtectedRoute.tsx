
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/use-user-profile";
import { UserRole } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { useEffect } from "react";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const RoleProtectedRoute = ({ children, allowedRoles }: RoleProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const location = useLocation();

  const isLoading = authLoading || profileLoading;

  useEffect(() => {
    // Only show access denied message after loading is complete and user is authenticated
    if (!isLoading && user && profile && !allowedRoles.includes(profile.role)) {
      toast({
        title: "Access Denied",
        description: `You don't have permission to access this page. Your current role (${profile.role}) doesn't allow access to this feature.`,
        variant: "destructive",
      });
    }
  }, [isLoading, user, profile, allowedRoles]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-club-black">
        <div className="animate-spin w-8 h-8 border-4 border-club-gold border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to dashboard if role not allowed
  if (profile && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Show content if user is authenticated and has required role
  return <>{children}</>;
};
