import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';

export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallbackMessage?: string
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary lang={(props as any).lang} fallbackMessage={fallbackMessage}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
