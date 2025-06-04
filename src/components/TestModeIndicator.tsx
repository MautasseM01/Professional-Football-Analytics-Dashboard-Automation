
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
    <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950/50 dark:border-amber-800 mb-4">
      <Code2 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      <AlertDescription className="text-amber-800 dark:text-amber-200 text-sm">
        <strong>Development Mode:</strong> This is a test environment for development purposes.
      </AlertDescription>
    </Alert>
  );
};
