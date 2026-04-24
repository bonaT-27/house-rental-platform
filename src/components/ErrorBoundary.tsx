import { ReactNode } from 'react';
import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from 'react-error-boundary';

// Error fallback component with proper typing
const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => (
  <div style={{
    textAlign: 'center',
    padding: '4rem',
    backgroundColor: '#fee',
    borderRadius: '12px',
    margin: '2rem',
  }}>
    <h2 style={{ color: '#c62828', marginBottom: '1rem' }}>Something went wrong</h2>
    <p style={{ color: '#666', marginBottom: '1rem' }}>
      {error instanceof Error ? error.message : 'An unexpected error occurred'}
    </p>
    <button
      onClick={resetErrorBoundary}
      style={{
        padding: '0.5rem 1rem',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
    >
      Try again
    </button>
  </div>
);

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const ErrorBoundary = ({ children, fallback }: ErrorBoundaryProps) => {
  const handleError = (
    error: unknown,
    info: { componentStack?: string | null },
  ) => {
    // Log error to error reporting service
    console.error('Error caught by boundary:', error);
    console.error('Component stack:', info.componentStack);
  };
  
  // If custom fallback is provided, use it
  if (fallback) {
    return (
      <ReactErrorBoundary fallback={<>{fallback}</>} onError={handleError}>
        {children}
      </ReactErrorBoundary>
    );
  }
  
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback} onError={handleError}>
      {children}
    </ReactErrorBoundary>
  );
};