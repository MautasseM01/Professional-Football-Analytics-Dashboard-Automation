
import React from 'react';

export const TestModeIndicator = () => {
  // Only show in development mode
  const isDevelopment = import.meta.env.DEV;
  
  if (!isDevelopment) {
    return null;
  }

  return (
    <div className="mb-4 px-4 py-2 bg-yellow-100 border border-yellow-300 rounded-md text-yellow-800 text-sm font-medium w-fit">
      ⚠️ TEST MODE
    </div>
  );
};
