
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfile, UserRole } from '@/types';
import { toast } from '@/components/ui/sonner';

// Demo mode: Use localStorage to persist role selection
const DEMO_ROLE_KEY = 'demo-user-role';

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false); // Changed to false for instant load
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Demo mode: Instantly create mock profile with role
    // Default to 'admin' for immediate full dashboard access
    const savedRole = localStorage.getItem(DEMO_ROLE_KEY) as UserRole || 'admin';
    
    const mockProfile: UserProfile = {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.name || 'Demo User',
      role: savedRole,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('Demo mode: Instant profile setup with role:', savedRole);
    setProfile(mockProfile);
    setLoading(false);

    // Listen for role changes from localStorage (for role testing)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === DEMO_ROLE_KEY && e.newValue) {
        const newRole = e.newValue as UserRole;
        setProfile(prev => prev ? { ...prev, role: newRole } : null);
        console.log('Demo mode: Role changed to:', newRole);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events for same-tab updates
    const handleRoleChange = (e: CustomEvent) => {
      const newRole = e.detail as UserRole;
      setProfile(prev => prev ? { ...prev, role: newRole } : null);
      console.log('Demo mode: Role changed to:', newRole);
    };

    window.addEventListener('demo-role-change', handleRoleChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('demo-role-change', handleRoleChange as EventListener);
    };
  }, [user]);

  return { profile, loading, error };
};

// Helper function to change role in demo mode
export const changeDemoRole = (newRole: UserRole) => {
  localStorage.setItem(DEMO_ROLE_KEY, newRole);
  // Dispatch custom event for same-tab updates
  window.dispatchEvent(new CustomEvent('demo-role-change', { detail: newRole }));
};
