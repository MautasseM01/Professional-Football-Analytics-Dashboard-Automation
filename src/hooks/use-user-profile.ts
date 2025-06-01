
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfile } from '@/types';
import { toast } from '@/components/ui/sonner';

export const useUserProfile = () => {
  const { user } = useAuth();
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

    // Subscribe to changes in the user profile
    const userSubscription = supabase
      .channel(`public:users:id=eq.${user?.id}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'users',
        filter: `id=eq.${user?.id}` 
      }, () => {
        console.log('User profile updated, refreshing data');
        fetchUserProfile();
      })
      .subscribe();

    return () => {
      userSubscription.unsubscribe();
    };
  }, [user]);

  return { profile, loading, error };
};
