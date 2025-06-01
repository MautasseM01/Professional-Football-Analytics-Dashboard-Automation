
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useDevAuthContext } from '@/contexts/DevAuthContext';
import { UserProfile } from '@/types';
import { toast } from '@/components/ui/sonner';

export const useUserProfile = () => {
  // Use the appropriate auth context based on environment
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Only call the hook that matches the current environment
  const prodAuth = isDevelopment ? null : useAuth();
  const devAuth = isDevelopment ? useDevAuthContext() : null;
  
  // Get the user from the appropriate context
  const user = isDevelopment ? devAuth?.user : prodAuth?.user;
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // In development mode, we already have the full user object from DevAuth
        if (isDevelopment && devAuth?.user) {
          console.log('🔧 [DEV] Using dev user profile:', devAuth.user);
          setProfile(devAuth.user as UserProfile);
          setLoading(false);
          return;
        }
        
        // In production mode, fetch from Supabase
        const { data, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (fetchError) {
          throw fetchError;
        }

        console.log('User profile data:', data);
        setProfile(data as UserProfile);
      } catch (err: any) {
        console.error('Error fetching user profile:', err);
        setError(err.message || 'Failed to fetch user profile');
        toast('Error loading profile: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();

    // Subscribe to changes in the user profile (only in production)
    if (!isDevelopment && user?.id) {
      const userSubscription = supabase
        .channel(`public:users:id=eq.${user.id}`)
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'users',
          filter: `id=eq.${user.id}` 
        }, () => {
          console.log('User profile updated, refreshing data');
          fetchUserProfile();
        })
        .subscribe();

      return () => {
        userSubscription.unsubscribe();
      };
    }
  }, [user, isDevelopment, devAuth?.user]);

  return { profile, loading, error };
};
