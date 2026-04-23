import { useState, useCallback } from 'react';
import { RequestState, createIdle, createLoading, createSuccess, createError } from '../types/requestState';

interface UseRequestOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  initialData?: T;
}

interface UseRequestReturn<T, P extends unknown[]> {
  state: RequestState<T>;
  execute: (...params: P) => Promise<T | undefined>;
  reset: () => void;
  setData: (data: T) => void;
}

export function useRequest<T, P extends unknown[] = unknown[]>(
  requestFn: (...params: P) => Promise<T>,
  options: UseRequestOptions<T> = {}
): UseRequestReturn<T, P> {
  const [state, setState] = useState<RequestState<T>>(() => 
    options.initialData 
      ? createSuccess(options.initialData)
      : createIdle()
  );
  
  const execute = useCallback(
    async (...params: P): Promise<T | undefined> => {
      setState(createLoading());
      
      try {
        const data = await requestFn(...params);
        setState(createSuccess(data));
        options.onSuccess?.(data);
        return data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setState(createError(errorMessage));
        options.onError?.(errorMessage);
        return undefined;
      }
    },
    [requestFn, options]
  );
  
  const reset = useCallback(() => {
    setState(createIdle());
  }, []);
  
  const setData = useCallback((data: T) => {
    setState(createSuccess(data));
  }, []);
  
  return { state, execute, reset, setData };
}

// Generic hook for handling all states in components
export function useRequestState<T>(state: RequestState<T>) {
  const isIdle = state.status === 'idle';
  const isLoading = state.status === 'loading';
  const isSuccess = state.status === 'success';
  const isError = state.status === 'error';
  
  const data = isSuccess ? state.data : undefined;
  const error = isError ? state.error : undefined;
  
  // Exhaustive switch example
  const renderWithSwitch = <R>(handlers: {
    idle?: () => R;
    loading?: () => R;
    success: (data: T) => R;
    error?: (error: string) => R;
  }): R | null => {
    switch (state.status) {
      case 'idle':
        return handlers.idle?.() ?? null;
      case 'loading':
        return handlers.loading?.() ?? null;
      case 'success':
        return handlers.success(state.data);
      case 'error':
        return handlers.error?.(state.error) ?? null;
      default:
        // TypeScript ensures exhaustive check
        return null;
    }
  };
  
  return {
    isIdle,
    isLoading,
    isSuccess,
    isError,
    data,
    error,
    renderWithSwitch,
  };
}