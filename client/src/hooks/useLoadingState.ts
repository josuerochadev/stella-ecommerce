import { useState, useEffect, useCallback } from 'react';

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

interface UseLoadingStateOptions {
  initialState?: LoadingState;
  minLoadingTime?: number; // Durée minimale de loading pour éviter le flash
}

export const useLoadingState = (options: UseLoadingStateOptions = {}) => {
  const { initialState = 'idle', minLoadingTime = 500 } = options;
  const [state, setState] = useState<LoadingState>(initialState);
  const [startTime, setStartTime] = useState<number>(0);

  const setLoading = useCallback(() => {
    setState('loading');
    setStartTime(Date.now());
  }, []);

  const setSuccess = useCallback(() => {
    const elapsed = Date.now() - startTime;
    const remainingTime = Math.max(0, minLoadingTime - elapsed);

    if (remainingTime > 0) {
      setTimeout(() => setState('success'), remainingTime);
    } else {
      setState('success');
    }
  }, [startTime, minLoadingTime]);

  const setError = useCallback(() => {
    const elapsed = Date.now() - startTime;
    const remainingTime = Math.max(0, minLoadingTime - elapsed);

    if (remainingTime > 0) {
      setTimeout(() => setState('error'), remainingTime);
    } else {
      setState('error');
    }
  }, [startTime, minLoadingTime]);

  const setIdle = useCallback(() => {
    setState('idle');
  }, []);

  return {
    state,
    isLoading: state === 'loading',
    isSuccess: state === 'success',
    isError: state === 'error',
    isIdle: state === 'idle',
    setLoading,
    setSuccess,
    setError,
    setIdle,
  };
};

// Hook pour les requêtes async avec skeleton loading
export const useAsyncOperation = <T>(
  operation: () => Promise<T>,
  dependencies: React.DependencyList = []
) => {
  const { state, setLoading, setSuccess, setError, ...rest } = useLoadingState({
    minLoadingTime: 800, // Un peu plus long pour voir les skeletons
  });
  const [data, setData] = useState<T | null>(null);
  const [error, setErrorData] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading();
      setErrorData(null);
      const result = await operation();
      setData(result);
      setSuccess();
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setErrorData(error);
      setError();
      throw error;
    }
  }, dependencies);

  useEffect(() => {
    execute();
  }, dependencies);

  return {
    ...rest,
    state,
    data,
    error: error,
    execute,
  };
};