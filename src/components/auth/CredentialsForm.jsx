/**
 * Credentials Form Component
 */

import { useState } from 'react';
import './CredentialsForm.css';

export default function CredentialsForm({ onSubmit, isConnecting }) {
  const [formData, setFormData] = useState({
    server: '',
    port: '389',
    username: '',
    password: '',
    useTLS: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="credentials-form-container">
      <h2>Connect to Active Directory</h2>
      <p className="form-description">
        Enter your Active Directory credentials to generate topology diagrams.
        Credentials are stored only in session memory and are not persisted.
      </p>
      
      <form onSubmit={handleSubmit} className="credentials-form">
        <div className="form-group">
          <label htmlFor="server">Domain/Server Address *</label>
          <input
            type="text"
            id="server"
            name="server"
            value={formData.server}
            onChange={handleChange}
            placeholder="dc.example.com"
            required
            disabled={isConnecting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="port">Port</label>
          <input
            type="number"
            id="port"
            name="port"
            value={formData.port}
            onChange={handleChange}
            placeholder="389"
            disabled={isConnecting}
          />
          <small>Default: 389 (LDAP), 636 (LDAPS)</small>
        </div>

        <div className="form-group">
          <label htmlFor="username">Username *</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="domain\\username or user@domain.com"
            required
            disabled={isConnecting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password *</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
            disabled={isConnecting}
          />
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="useTLS"
              checked={formData.useTLS}
              onChange={handleChange}
              disabled={isConnecting}
            />
            Use TLS/SSL (LDAPS)
          </label>
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={isConnecting}
        >
          {isConnecting ? 'Connecting...' : 'Connect'}
        </button>
      </form>

      <div className="security-notice">
        <strong>Security Note:</strong> This application runs locally and credentials 
        are only stored in memory during your session. They are automatically cleared 
        when you close the application.
      </div>
    </div>
  );
}
