
import { useState, useCallback, useRef, useEffect } from 'react';
import { useErrorHandler } from './use-error-handler';

interface UseSafeAsyncOptions<T> {
  component: string;
  initialData?: T;
  retryCount?: number;
  retryDelay?: number;
}

interface SafeAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  retry: () => void;
}

export const useSafeAsync = <T>(
  asyncFunction: () => Promise<T>,
  dependencies: any[] = [],
  options: UseSafeAsyncOptions<T> = {}
): SafeAsyncState<T> => {
  const {
    component,
    initialData = null,
    retryCount = 3,
    retryDelay = 1000
  } = options;

  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { handleError } = useErrorHandler({ component });
  const mountedRef = useRef(true);
  const retryCountRef = useRef(0);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async () => {
    if (!mountedRef.current) return;

    setLoading(true);
    setError(null);

    try {
      const result = await asyncFunction();
      
      if (mountedRef.current) {
        setData(result);
        retryCountRef.current = 0;
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      
      if (mountedRef.current) {
        setError(error);
        handleError(error, 'medium', { retryAttempt: retryCountRef.current });

        // Retry logic
        if (retryCountRef.current < retryCount) {
          retryCountRef.current++;
          setTimeout(() => {
            if (mountedRef.current) {
              execute();
            }
          }, retryDelay * retryCountRef.current);
        }
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [asyncFunction, handleError, retryCount, retryDelay]);

  const retry = useCallback(() => {
    retryCountRef.current = 0;
    execute();
  }, [execute]);

  useEffect(() => {
    execute();
  }, dependencies);

  return { data, loading, error, retry };
};
