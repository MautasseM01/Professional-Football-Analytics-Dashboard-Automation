
import { useState, useEffect, useCallback } from 'react';
import { getDevUser, ensureDevUserExists, DEV_ROLE, type DevUser } from '@/lib/dev-auth';

interface UseDevAuthReturn {
  user: DevUser | null;
  loading: boolean;
  error: string | null;
  getCurrentUser: () => DevUser | null;
  refreshUser: () => Promise<void>;
}

/**
 * Hook pour la simulation d'authentification en mode développement
 */
export function useDevAuth(): UseDevAuthReturn {
  const [user, setUser] = useState<DevUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDevUser = useCallback(async () => {
    // Seulement en mode développement
    if (process.env.NODE_ENV !== 'development') {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // S'assurer que l'utilisateur de test existe
      await ensureDevUserExists(DEV_ROLE);
      
      // Charger l'utilisateur
      const devUser = await getDevUser();
      setUser(devUser);
      
      console.log(`🔧 [DEV] Session simulée initialisée pour:`, devUser);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('❌ [DEV] Erreur lors du chargement de l\'utilisateur de dev:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger l'utilisateur au montage du composant
  useEffect(() => {
    loadDevUser();
  }, [loadDevUser]);

  const getCurrentUser = useCallback(() => {
    return user;
  }, [user]);

  const refreshUser = useCallback(async () => {
    await loadDevUser();
  }, [loadDevUser]);

  return {
    user,
    loading,
    error,
    getCurrentUser,
    refreshUser
  };
}
