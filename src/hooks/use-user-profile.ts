
import { useState } from 'react';
import { UserProfile, UserRole } from '@/types';

export const useUserProfile = () => {
  // Default to admin role for immediate dashboard loading
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  
  // Mock profile for demo purposes with dynamic role
  const mockProfile: UserProfile = {
    id: 'demo-user',
    email: 'demo@example.com',
    role: currentRole,
    full_name: 'Demo User',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const [profile] = useState<UserProfile | null>(mockProfile);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  // Function to update role for testing
  const updateRole = (newRole: UserRole) => {
    setCurrentRole(newRole);
    // Update the profile with new role
    if (profile) {
      profile.role = newRole;
    }
  };

  return { profile, loading, error, updateRole };
};
