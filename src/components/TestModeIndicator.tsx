import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Code2 } from 'lucide-react';
export const TestModeIndicator = () => {
  // Only show in development mode
  const isDevelopment = import.meta.env.DEV;
  if (!isDevelopment) {
    return null;
  }
  return;
};