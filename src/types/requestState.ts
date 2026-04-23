// Discriminated union for API request states
export type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

// Type guard helpers
export function isIdle<T>(state: RequestState<T>): state is { status: 'idle' } {
  return state.status === 'idle';
}

export function isLoading<T>(state: RequestState<T>): state is { status: 'loading' } {
  return state.status === 'loading';
}

export function isSuccess<T>(state: RequestState<T>): state is { status: 'success'; data: T } {
  return state.status === 'success';
}

export function isError<T>(state: RequestState<T>): state is { status: 'error'; error: string } {
  return state.status === 'error';
}

// Helper to get data with type safety
export function getDataOrThrow<T>(state: RequestState<T>): T {
  if (state.status === 'success') {
    return state.data;
  }
  throw new Error(`Cannot get data from state with status: ${state.status}`);
}

// Create state creators
export const createIdle = <T>(): RequestState<T> => ({ status: 'idle' });
export const createLoading = <T>(): RequestState<T> => ({ status: 'loading' });
export const createSuccess = <T>(data: T): RequestState<T> => ({ status: 'success', data });
export const createError = <T>(error: string): RequestState<T> => ({ status: 'error', error });