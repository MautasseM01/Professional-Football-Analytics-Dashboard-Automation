
import { UserRole } from '@/types';

export interface AccessibleItem {
  name: string;
  href: string;
  translationKey: string;
  allowedRoles: UserRole[];
}

export interface AccessibleSubItem {
  name: string;
  href: string;
  translationKey: string;
  allowedRoles: UserRole[];
}

export interface AccessibleNavigationItem extends AccessibleItem {
  icon: React.ElementType;
  subItems?: AccessibleSubItem[];
}

// Define role hierarchy for access checking
const ROLE_HIERARCHY: Record<UserRole, number> = {
  'admin': 4,
  'management': 3,
  'coach': 2,
  'analyst': 2,
  'performance_director': 2,
  'player': 1,
  'unassigned': 0
};

export const hasAccess = (userRole: UserRole | undefined, allowedRoles: UserRole[]): boolean => {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
};

export const canAccessRoute = (route: string, userRole: UserRole | undefined): boolean => {
  if (!userRole || userRole === 'unassigned') return route === '/dashboard';
  
  const routeAccess: Record<string, UserRole[]> = {
    '/dashboard': ['admin', 'management', 'coach', 'analyst', 'performance_director', 'player'],
    '/player-analysis': ['admin', 'management', 'coach', 'analyst', 'performance_director', 'player'],
    '/player-analysis/stats': ['admin', 'management', 'coach', 'analyst', 'performance_director', 'player'],
    '/player-analysis/comparison': ['admin', 'management', 'coach', 'analyst', 'performance_director'],
    '/player-analysis/development': ['admin', 'management', 'coach', 'analyst', 'performance_director'],
    '/player-analysis/shot-map': ['admin', 'management', 'coach', 'analyst', 'performance_director'],
    '/team-performance': ['admin', 'management', 'coach', 'analyst', 'performance_director'],
    '/team-performance/tactical-analysis': ['admin', 'management', 'coach', 'analyst', 'performance_director'],
    '/reports': ['admin', 'management', 'analyst'],
    '/settings': ['admin', 'management', 'coach', 'analyst', 'performance_director', 'player']
  };

  const allowedRoles = routeAccess[route];
  return allowedRoles ? hasAccess(userRole, allowedRoles) : false;
};

export const getDefaultRouteForRole = (userRole: UserRole | undefined): string => {
  // All roles should go to dashboard as their default route
  return '/dashboard';
};

// New helper functions for role-based features
export const canAccessPlayerComparison = (userRole: UserRole | undefined): boolean => {
  return hasAccess(userRole, ['admin', 'management', 'coach', 'analyst', 'performance_director']);
};

export const canAccessTeamAnalytics = (userRole: UserRole | undefined): boolean => {
  return hasAccess(userRole, ['admin', 'management', 'coach', 'analyst', 'performance_director']);
};

export const canAccessUserManagement = (userRole: UserRole | undefined): boolean => {
  return hasAccess(userRole, ['admin']);
};

export const canAccessAdvancedAnalytics = (userRole: UserRole | undefined): boolean => {
  return hasAccess(userRole, ['admin', 'management', 'analyst']);
};

export const canSeeAllPlayers = (userRole: UserRole | undefined): boolean => {
  return hasAccess(userRole, ['admin', 'management', 'coach', 'analyst', 'performance_director']);
};

export const canSeeOwnDataOnly = (userRole: UserRole | undefined): boolean => {
  return userRole === 'player';
};

export const canAccessComplianceFeatures = (userRole: UserRole | undefined): boolean => {
  return hasAccess(userRole, ['admin', 'management', 'coach']);
};
