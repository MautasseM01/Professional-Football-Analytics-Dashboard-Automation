
// This hook has been removed to eliminate 406 errors
// Compliance features are temporarily disabled for stability
export const useComplianceData = () => {
  return { 
    data: null, 
    isLoading: false, 
    error: null 
  };
};
