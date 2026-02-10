/**
 * Main Application Component
 */

import { useState, useRef } from 'react';
import { useADConnection } from './hooks/useADConnection.js';
import { useDiagramData } from './hooks/useDiagramData.js';
import CredentialsForm from './components/auth/CredentialsForm.jsx';
import ConnectionTest from './components/auth/ConnectionTest.jsx';
import DiagramSelector from './components/selection/DiagramSelector.jsx';
import DiagramContainer from './components/diagrams/DiagramContainer.jsx';
import ForestDiagram from './components/diagrams/ForestDiagram.jsx';
import SiteTopologyDiagram from './components/diagrams/SiteTopologyDiagram.jsx';
import DCPlacementDiagram from './components/diagrams/DCPlacementDiagram.jsx';
import ReplicationDiagram from './components/diagrams/ReplicationDiagram.jsx';
import TrustDiagram from './components/diagrams/TrustDiagram.jsx';
import ExportManager from './components/export/ExportManager.jsx';
import LoadingSpinner from './components/common/LoadingSpinner.jsx';
import ErrorDisplay from './components/common/ErrorDisplay.jsx';
import exportService from './services/exportService.js';
import './App.css';

function App() {
  const [appState, setAppState] = useState('landing'); // landing, credentials, connected, selection, diagrams
  const [selectedDiagramTypes, setSelectedDiagramTypes] = useState([]);
  const [diagramsData, setDiagramsData] = useState({});
  
  const { 
    isConnected, 
    isConnecting, 
    error: connectionError, 
    connect, 
    disconnect,
    testConnection 
  } = useADConnection();
  
  const {
    loading: dataLoading,
    error: dataError,
    fetchForestStructure,
    fetchSiteTopology,
    fetchDCPlacement,
    fetchReplicationTopology,
    fetchTrustRelationships
  } = useDiagramData();

  const handleGetStarted = () => {
    setAppState('credentials');
  };

  const handleConnect = async (credentials) => {
    const result = await connect(credentials);
    if (result.success) {
      setAppState('connected');
    }
  };

  const handleTestConnection = async () => {
    return await testConnection();
  };

  const handleProceedToSelection = () => {
    setAppState('selection');
  };

  const handleGenerate = async (selectedTypes) => {
    setSelectedDiagramTypes(selectedTypes);
    setAppState('diagrams');
    
    const data = {};
    
    try {
      // Fetch data for selected diagram types
      if (selectedTypes.includes('forest')) {
        data.forest = await fetchForestStructure();
      }
      if (selectedTypes.includes('site')) {
        data.site = await fetchSiteTopology();
      }
      if (selectedTypes.includes('dc')) {
        data.dc = await fetchDCPlacement();
      }
      if (selectedTypes.includes('replication')) {
        data.replication = await fetchReplicationTopology();
      }
      if (selectedTypes.includes('trust')) {
        data.trust = await fetchTrustRelationships();
      }
      
      setDiagramsData(data);
    } catch (error) {
      console.error('Error fetching diagram data:', error);
    }
  };

  const handleExport = async (format, element) => {
    try {
      switch (format) {
        case 'png':
          await exportService.exportToPNG(element);
          break;
        case 'pdf':
          await exportService.exportToPDF(element);
          break;
        case 'svg':
          await exportService.exportToSVG(element);
          break;
        case 'visio':
          await exportService.exportToVisio({});
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setAppState('landing');
    setSelectedDiagramTypes([]);
    setDiagramsData({});
  };

  const handleBackToSelection = () => {
    setAppState('selection');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>ADDraw</h1>
        <p className="app-subtitle">Active Directory Topology Visualization</p>
        {isConnected && (
          <button className="disconnect-button" onClick={handleDisconnect}>
            Disconnect
          </button>
        )}
      </header>

      <main className="app-main">
        {/* Landing Page */}
        {appState === 'landing' && (
          <div className="landing-page">
            <div className="landing-content">
              <h2>Welcome to ADDraw</h2>
              <p className="landing-description">
                Generate comprehensive Active Directory topology diagrams including forest structure,
                site topology, domain controller placement, replication connections, and trust relationships.
              </p>
              <ul className="features-list">
                <li>🌲 Forest Structure Diagrams</li>
                <li>🗺️ Site Topology Visualization</li>
                <li>🖥️ Domain Controller Placement</li>
                <li>🔄 Replication Topology</li>
                <li>🤝 Trust Relationships</li>
                <li>📥 Export to PDF, PNG, SVG, and Visio</li>
              </ul>
              <button className="get-started-button" onClick={handleGetStarted}>
                Get Started
              </button>
            </div>
          </div>
        )}

        {/* Credentials Form */}
        {appState === 'credentials' && (
          <CredentialsForm 
            onSubmit={handleConnect}
            isConnecting={isConnecting}
          />
        )}

        {/* Connection Test */}
        {appState === 'connected' && (
          <ConnectionTest
            onTest={handleTestConnection}
            onProceed={handleProceedToSelection}
          />
        )}

        {/* Error Display */}
        {(connectionError || dataError) && (
          <ErrorDisplay 
            error={connectionError || dataError}
            onRetry={connectionError ? () => setAppState('credentials') : null}
          />
        )}

        {/* Diagram Selection */}
        {appState === 'selection' && (
          <DiagramSelector onGenerate={handleGenerate} />
        )}

        {/* Loading Spinner */}
        {dataLoading && (
          <LoadingSpinner message="Fetching Active Directory data..." />
        )}

        {/* Diagrams Display */}
        {appState === 'diagrams' && !dataLoading && (
          <div className="diagrams-container">
            <div className="diagrams-header">
              <h2>Generated Diagrams</h2>
              <button className="back-button" onClick={handleBackToSelection}>
                ← Back to Selection
              </button>
            </div>

            {selectedDiagramTypes.includes('forest') && diagramsData.forest && (
              <div className="diagram-section">
                <DiagramContainer title="Forest Structure" onExport={handleExport}>
                  <ForestDiagram data={diagramsData.forest} />
                </DiagramContainer>
                <ExportManager 
                  diagramElement={document.querySelector('.diagram-section .diagram-content')}
                  diagramData={diagramsData.forest}
                  diagramName="forest_structure"
                />
              </div>
            )}

            {selectedDiagramTypes.includes('site') && diagramsData.site && (
              <div className="diagram-section">
                <DiagramContainer title="Site Topology" onExport={handleExport}>
                  <SiteTopologyDiagram data={diagramsData.site} />
                </DiagramContainer>
                <ExportManager 
                  diagramElement={document.querySelector('.diagram-section .diagram-content')}
                  diagramData={diagramsData.site}
                  diagramName="site_topology"
                />
              </div>
            )}

            {selectedDiagramTypes.includes('dc') && diagramsData.dc && (
              <div className="diagram-section">
                <DiagramContainer title="Domain Controller Placement" onExport={handleExport}>
                  <DCPlacementDiagram data={diagramsData.dc} />
                </DiagramContainer>
                <ExportManager 
                  diagramElement={document.querySelector('.diagram-section .diagram-content')}
                  diagramData={diagramsData.dc}
                  diagramName="dc_placement"
                />
              </div>
            )}

            {selectedDiagramTypes.includes('replication') && diagramsData.replication && (
              <div className="diagram-section">
                <DiagramContainer title="Replication Topology" onExport={handleExport}>
                  <ReplicationDiagram data={diagramsData.replication} />
                </DiagramContainer>
                <ExportManager 
                  diagramElement={document.querySelector('.diagram-section .diagram-content')}
                  diagramData={diagramsData.replication}
                  diagramName="replication_topology"
                />
              </div>
            )}

            {selectedDiagramTypes.includes('trust') && diagramsData.trust && (
              <div className="diagram-section">
                <DiagramContainer title="Trust Relationships" onExport={handleExport}>
                  <TrustDiagram data={diagramsData.trust} />
                </DiagramContainer>
                <ExportManager 
                  diagramElement={document.querySelector('.diagram-section .diagram-content')}
                  diagramData={diagramsData.trust}
                  diagramName="trust_relationships"
                />
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>
          ADDraw - Active Directory Topology Visualization Tool |
          <strong> Security Notice:</strong> All credentials are stored only in memory and cleared on session end
        </p>
      </footer>
    </div>
  );
}

export default App;
