
import React, { createContext, useContext, ReactNode } from 'react';
import { useDevAuth } from '@/hooks/useDevAuth';
import { DevUser } from '@/lib/dev-auth';

interface DevAuthContextType {
  user: DevUser | null;
  loading: boolean;
  error: string | null;
  getCurrentUser: () => DevUser | null;
  refreshUser: () => Promise<void>;
}

const DevAuthContext = createContext<DevAuthContextType | undefined>(undefined);

interface DevAuthProviderProps {
  children: ReactNode;
}

export function DevAuthProvider({ children }: DevAuthProviderProps) {
  const devAuth = useDevAuth();

  return (
    <DevAuthContext.Provider value={devAuth}>
      {children}
    </DevAuthContext.Provider>
  );
}

export function useDevAuthContext() {
  const context = useContext(DevAuthContext);
  if (context === undefined) {
    throw new Error('useDevAuthContext must be used within a DevAuthProvider');
  }
  return context;
}

// Hook pratique pour récupérer juste l'utilisateur actuel
export function useCurrentDevUser() {
  const { getCurrentUser } = useDevAuthContext();
  return getCurrentUser();
}
