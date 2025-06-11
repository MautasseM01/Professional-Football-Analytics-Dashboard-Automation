
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

// For demo purposes, allow all access
export const hasAccess = (userRole: UserRole | undefined, allowedRoles: UserRole[]): boolean => {
  return true; // Always allow access for demo
};

export const canAccessRoute = (route: string, userRole: UserRole | undefined): boolean => {
  return true; // Always allow access for demo
};

export const getDefaultRouteForRole = (userRole: UserRole | undefined): string => {
  return '/dashboard';
};

// Demo mode - all features accessible
export const canAccessPlayerComparison = (userRole: UserRole | undefined): boolean => {
  return true;
};

export const canAccessTeamAnalytics = (userRole: UserRole | undefined): boolean => {
  return true;
};

export const canAccessUserManagement = (userRole: UserRole | undefined): boolean => {
  return true;
};

export const canAccessAdvancedAnalytics = (userRole: UserRole | undefined): boolean => {
  return true;
};

export const canSeeAllPlayers = (userRole: UserRole | undefined): boolean => {
  return true;
};

export const canSeeOwnDataOnly = (userRole: UserRole | undefined): boolean => {
  return false; // Show all data in demo mode
};

export const canAccessComplianceFeatures = (userRole: UserRole | undefined): boolean => {
  return true;
};
