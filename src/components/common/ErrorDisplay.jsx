/**
 * Error Display Component
 */

import './ErrorDisplay.css';

export default function ErrorDisplay({ error, onRetry }) {
  return (
    <div className="error-display">
      <div className="error-icon">⚠️</div>
      <h3 className="error-title">Error</h3>
      <p className="error-message">{error || 'An unexpected error occurred'}</p>
      {onRetry && (
        <button className="error-retry-button" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}
