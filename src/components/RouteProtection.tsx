
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserProfile } from '@/hooks/use-user-profile';
import { canAccessRoute, getDefaultRouteForRole } from '@/utils/roleAccess';
import { toast } from '@/components/ui/use-toast';

interface RouteProtectionProps {
  children: React.ReactNode;
}

export const RouteProtection = ({ children }: RouteProtectionProps) => {
  const { profile, loading } = useUserProfile();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;

    if (!profile) {
      navigate('/login');
      return;
    }

    const hasAccess = canAccessRoute(location.pathname, profile.role);
    
    if (!hasAccess) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      
      const defaultRoute = getDefaultRouteForRole(profile.role);
      navigate(defaultRoute, { replace: true });
    }
  }, [profile, loading, location.pathname, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-club-black">
        <div className="animate-spin w-8 h-8 border-4 border-club-gold border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const hasAccess = canAccessRoute(location.pathname, profile.role);
  
  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
};
