// Error logging utility for better error tracking
export interface ErrorLog {
  timestamp: Date;
  component: string;
  error: Error;
  context?: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

class ErrorLogger {
  private logs: ErrorLog[] = [];
  private maxLogs = 100;

  log(component: string, error: Error, severity: 'low' | 'medium' | 'high' | 'critical' = 'medium', context?: Record<string, any>) {
    const errorLog: ErrorLog = {
      timestamp: new Date(),
      component,
      error,
      context,
      severity
    };

    this.logs.unshift(errorLog);
    
    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error(`[${component}] ${error.message}`, { error, context });
    }

    // In production, you could send to an error tracking service
    if (!import.meta.env.DEV && severity === 'critical') {
      // Example: Send to error tracking service
      // errorTrackingService.captureError(errorLog);
    }
  }

  getLogs(): ErrorLog[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }
}

export const errorLogger = new ErrorLogger();
