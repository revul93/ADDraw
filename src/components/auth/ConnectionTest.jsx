/**
 * Connection Test Component
 */

import { useState } from 'react';
import './ConnectionTest.css';

export default function ConnectionTest({ onTest, onProceed }) {
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);

  const handleTest = async () => {
    setTesting(true);
    try {
      const result = await onTest();
      setTestResult(result);
    } catch (error) {
      setTestResult({ success: false, message: error.message });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="connection-test-container">
      <h3>Connection Status</h3>
      
      <button 
        onClick={handleTest} 
        disabled={testing}
        className="test-button"
      >
        {testing ? 'Testing...' : 'Test Connection'}
      </button>

      {testResult && (
        <div className={`test-result ${testResult.success ? 'success' : 'error'}`}>
          <div className="result-icon">
            {testResult.success ? '✓' : '✗'}
          </div>
          <div className="result-content">
            <strong>{testResult.success ? 'Success' : 'Failed'}</strong>
            <p>{testResult.message}</p>
            {testResult.baseDN && (
              <p className="base-dn">Base DN: {testResult.baseDN}</p>
            )}
          </div>
        </div>
      )}

      {testResult && testResult.success && (
        <button 
          onClick={onProceed}
          className="proceed-button"
        >
          Proceed to Diagram Selection
        </button>
      )}
    </div>
  );
}
