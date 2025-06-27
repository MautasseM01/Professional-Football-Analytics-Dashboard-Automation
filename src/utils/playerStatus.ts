
import { PlayerEligibilityData } from "@/hooks/use-player-eligibility";

export type PlayerStatus = 'available' | 'injured' | 'suspended' | 'ineligible' | 'unknown';

export interface PlayerStatusInfo {
  status: PlayerStatus;
  statusText: string;
  statusColor: string;
  icon: '🟢' | '🔴' | '🟡' | '⚫' | '❓';
  description?: string;
}

export const determinePlayerStatus = (
  eligibilityData?: PlayerEligibilityData | null,
  injuryStatus?: { status: string } | null,
  suspensionData?: { suspension_until?: string } | null
): PlayerStatusInfo => {
  // Check for suspension first
  if (suspensionData?.suspension_until) {
    const suspensionDate = new Date(suspensionData.suspension_until);
    const today = new Date();
    
    if (suspensionDate > today) {
      return {
        status: 'suspended',
        statusText: 'Suspended',
        statusColor: 'bg-red-500',
        icon: '🔴',
        description: `Suspended until ${suspensionDate.toLocaleDateString()}`
      };
    }
  }

  // Check for injury status
  if (injuryStatus?.status === 'active') {
    return {
      status: 'injured',
      statusText: 'Injured',
      statusColor: 'bg-red-500',
      icon: '🔴',
      description: 'Currently injured'
    };
  }

  // Check for eligibility
  if (eligibilityData) {
    if (!eligibilityData.is_eligible) {
      return {
        status: 'ineligible',
        statusText: 'Ineligible',
        statusColor: 'bg-gray-500',
        icon: '⚫',
        description: 'Not eligible for selection'
      };
    }

    // Check registration expiry
    if (eligibilityData.registration_expires) {
      const expiryDate = new Date(eligibilityData.registration_expires);
      const today = new Date();
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilExpiry <= 0) {
        return {
          status: 'ineligible',
          statusText: 'Registration Expired',
          statusColor: 'bg-gray-500',
          icon: '⚫',
          description: 'Registration has expired'
        };
      }
      
      if (daysUntilExpiry <= 30) {
        return {
          status: 'available',
          statusText: 'Available',
          statusColor: 'bg-yellow-500',
          icon: '🟡',
          description: `Registration expires in ${daysUntilExpiry} days`
        };
      }
    }
  }

  // If all checks pass, player is available
  return {
    status: 'available',
    statusText: 'Available',
    statusColor: 'bg-green-500',
    icon: '🟢',
    description: 'Available for selection'
  };
};

export const getStatusFilterOptions = (): Array<{ value: PlayerStatus | 'all', label: string }> => [
  { value: 'all', label: 'All Players' },
  { value: 'available', label: 'Available' },
  { value: 'injured', label: 'Injured' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'ineligible', label: 'Ineligible' }
];
