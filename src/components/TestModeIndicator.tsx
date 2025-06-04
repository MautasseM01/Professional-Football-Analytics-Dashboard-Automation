
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Code2 } from 'lucide-react';

export const TestModeIndicator = () => {
  // Only show in development mode
  const isDevelopment = import.meta.env.DEV;
  
  if (!isDevelopment) {
    return null;
  }

  return (
    <Alert className="mb-6 bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-950/20 dark:border-orange-800/30 dark:text-orange-300">
      <Code2 className="h-4 w-4" />
      <AlertDescription className="text-sm font-medium">
        Development Mode - Test environment active
      </AlertDescription>
    </Alert>
  );
};
