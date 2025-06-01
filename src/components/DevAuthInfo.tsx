
import { useDevAuthContext } from '@/contexts/DevAuthContext';
import { DEV_ROLE } from '@/lib/dev-auth';

export function DevAuthInfo() {
  const { user, loading, error } = useDevAuthContext();

  // Ne s'affiche qu'en mode développement
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-club-dark-gray border border-club-gold/30 rounded-lg p-3 text-xs text-club-light-gray z-50">
      <div className="font-semibold text-club-gold mb-1">🔧 Mode Développement</div>
      <div>Rôle configuré: <span className="text-club-gold">{DEV_ROLE}</span></div>
      {loading && <div className="text-yellow-400">Chargement utilisateur...</div>}
      {error && <div className="text-red-400">Erreur: {error}</div>}
      {user && (
        <div className="mt-1 space-y-1">
          <div>Email: <span className="text-club-gold">{user.email}</span></div>
          <div>Nom: <span className="text-club-gold">{user.full_name || 'N/A'}</span></div>
          <div>Rôle effectif: <span className="text-club-gold">{user.role}</span></div>
        </div>
      )}
    </div>
  );
}
