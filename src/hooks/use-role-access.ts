
import { useUserProfile } from '@/hooks/use-user-profile';
import { UserRole } from '@/types';
import { 
  canSeeAllPlayers, 
  canSeeOwnDataOnly,
  canAccessPlayerComparison,
  canAccessTeamAnalytics,
  canAccessAdvancedAnalytics,
  canAccessUserManagement,
  hasAccess
} from '@/utils/roleAccess';

export const useRoleAccess = () => {
  const { profile, loading } = useUserProfile();

  const checkAccess = (allowedRoles: UserRole[]): boolean => {
    if (!profile || loading) return false;
    return hasAccess(profile.role as UserRole, allowedRoles);
  };

  const canViewAllPlayers = (): boolean => {
    return canSeeAllPlayers(profile?.role as UserRole);
  };

  const canViewOwnDataOnly = (): boolean => {
    return canSeeOwnDataOnly(profile?.role as UserRole);
  };

  const canCompareePlayers = (): boolean => {
    return canAccessPlayerComparison(profile?.role as UserRole);
  };

  const canViewTeamAnalytics = (): boolean => {
    return canAccessTeamAnalytics(profile?.role as UserRole);
  };

  const canViewAdvancedAnalytics = (): boolean => {
    return canAccessAdvancedAnalytics(profile?.role as UserRole);
  };

  const canManageUsers = (): boolean => {
    return canAccessUserManagement(profile?.role as UserRole);
  };

  const getRoleBadgeColor = (role?: UserRole): string => {
    switch (role) {
      case 'admin':
        return 'bg-red-600 text-white';
      case 'management':
        return 'bg-purple-600 text-white';
      case 'coach':
        return 'bg-blue-600 text-white';
      case 'analyst':
        return 'bg-green-600 text-white';
      case 'performance_director':
        return 'bg-yellow-600 text-black';
      case 'player':
        return 'bg-club-gold text-club-black';
      case 'unassigned':
        return 'bg-gray-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const getRoleDisplayName = (role?: UserRole): string => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'management':
        return 'Management';
      case 'coach':
        return 'Coach';
      case 'analyst':
        return 'Analyst';
      case 'performance_director':
        return 'Performance Director';
      case 'player':
        return 'Player';
      case 'unassigned':
        return 'Unassigned';
      default:
        return 'Unknown';
    }
  };

  return {
    profile,
    loading,
    checkAccess,
    canViewAllPlayers,
    canViewOwnDataOnly,
    canCompareePlayers,
    canViewTeamAnalytics,
    canViewAdvancedAnalytics,
    canManageUsers,
    getRoleBadgeColor,
    getRoleDisplayName,
    currentRole: profile?.role as UserRole
  };
};
