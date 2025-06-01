
import { supabase } from './supabase';
import { UserRole } from '@/types';

// 🔧 Changez cette valeur pour tester différents rôles
export const DEV_ROLE: UserRole = 'admin';

// Mapping des rôles vers les emails de test
const ROLE_EMAIL_MAP: Record<UserRole, string> = {
  admin: 'admin@test.com',
  coach: 'coach@test.com',
  player: 'player@test.com',
  analyst: 'analyst@test.com',
  performance_director: 'performance_director@test.com',
  management: 'management@test.com',
  unassigned: 'unassigned@test.com'
};

export interface DevUser {
  id: string;
  email: string;
  full_name?: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}

/**
 * Récupère l'utilisateur de développement basé sur le rôle configuré
 */
export async function getDevUser(): Promise<DevUser> {
  // Vérification que nous sommes en mode développement
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('getDevUser() ne peut être utilisé qu\'en mode développement');
  }

  const email = ROLE_EMAIL_MAP[DEV_ROLE];
  
  if (!email) {
    throw new Error(`Rôle non reconnu: ${DEV_ROLE}`);
  }

  console.log(`🔧 [DEV] Simulation de connexion pour: ${email} (rôle: ${DEV_ROLE})`);

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error('❌ [DEV] Erreur lors de la récupération de l\'utilisateur:', error);
      throw new Error(`Utilisateur non trouvé pour l'email: ${email}. Vérifiez que cet utilisateur existe dans la table 'users'.`);
    }

    if (!data) {
      throw new Error(`Aucun utilisateur trouvé avec l'email: ${email}`);
    }

    console.log(`✅ [DEV] Utilisateur simulé connecté:`, data);
    return data as DevUser;
  } catch (error) {
    console.error('❌ [DEV] Erreur dans getDevUser():', error);
    throw error;
  }
}

/**
 * Crée un utilisateur de test s'il n'existe pas (utile pour les tests)
 */
export async function ensureDevUserExists(role: UserRole): Promise<void> {
  if (process.env.NODE_ENV !== 'development') return;

  const email = ROLE_EMAIL_MAP[role];
  
  try {
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (!existingUser) {
      console.log(`🔧 [DEV] Création de l'utilisateur de test: ${email}`);
      
      const { error } = await supabase
        .from('users')
        .insert({
          email,
          full_name: `Test ${role.charAt(0).toUpperCase() + role.slice(1)}`,
          role
        });

      if (error) {
        console.error('❌ [DEV] Erreur lors de la création de l\'utilisateur de test:', error);
      } else {
        console.log(`✅ [DEV] Utilisateur de test créé: ${email}`);
      }
    }
  } catch (error) {
    console.error('❌ [DEV] Erreur dans ensureDevUserExists():', error);
  }
}
