
import { useState, useEffect } from 'react';
import { UserProfile } from '@/types';

export const useUserProfile = () => {
  // Mock profile for demo purposes
  const mockProfile: UserProfile = {
    id: 'demo-user',
    email: 'demo@example.com',
    role: 'admin',
    full_name: 'Demo User',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const [profile] = useState<UserProfile | null>(mockProfile);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  return { profile, loading, error };
};
