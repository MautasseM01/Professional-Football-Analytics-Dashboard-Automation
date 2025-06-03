
import { ReactNode } from "react";
import { useUserProfile } from "@/hooks/use-user-profile";
import { UserRole } from "@/types";

interface RoleBasedContentProps {
  allowedRoles: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}

export const RoleBasedContent = ({ 
  allowedRoles, 
  children, 
  fallback = null 
}: RoleBasedContentProps) => {
  const { profile } = useUserProfile();

  if (!profile || !allowedRoles.includes(profile.role as UserRole)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
