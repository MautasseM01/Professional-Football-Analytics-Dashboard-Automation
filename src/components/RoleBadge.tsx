
import { Badge } from '@/components/ui/badge';
import { useRoleAccess } from '@/hooks/use-role-access';
import { UserRole } from '@/types';

interface RoleBadgeProps {
  role?: UserRole;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const RoleBadge = ({ role, size = 'md', className = '' }: RoleBadgeProps) => {
  const { getRoleBadgeColor, getRoleDisplayName } = useRoleAccess();
  
  if (!role) return null;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-2.5 py-1.5',
    lg: 'text-base px-3 py-2'
  };

  return (
    <Badge 
      className={`${getRoleBadgeColor(role)} ${sizeClasses[size]} font-medium ${className}`}
      variant="secondary"
    >
      {getRoleDisplayName(role)}
    </Badge>
  );
};
