import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';

export function withErrorBoundary<P extends Record<string, unknown>>(
  Component: React.ComponentType<P>,
  fallbackMessage?: string
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary lang={typeof props.lang === 'string' ? props.lang : undefined} fallbackMessage={fallbackMessage}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
