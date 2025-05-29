
interface ComplianceAlertBannerProps {
  complianceData: any;
  isLoading: boolean;
}

export const ComplianceAlertBanner = ({ complianceData, isLoading }: ComplianceAlertBannerProps) => {
  // Compliance alerts temporarily disabled to prevent 406 errors
  return null;
};
