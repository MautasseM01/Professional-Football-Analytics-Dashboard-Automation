
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { errorLogger } from '@/utils/errorLogger';

interface UseErrorHandlerOptions {
  component: string;
  showToast?: boolean;
}

export const useErrorHandler = ({ component, showToast = true }: UseErrorHandlerOptions) => {
  const { toast } = useToast();

  const handleError = useCallback((
    error: Error, 
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    context?: Record<string, any>
  ) => {
    errorLogger.log(component, error, severity, context);

    if (showToast && severity !== 'low') {
      toast({
        title: 'An error occurred',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  }, [component, showToast, toast]);

  return { handleError };
};
