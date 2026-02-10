/**
 * Export Manager Component
 * Manages export operations for diagrams
 */

import { useState } from 'react';
import ExportButton from './ExportButton.jsx';
import exportService from '../../services/exportService.js';
import './ExportManager.css';

export default function ExportManager({ diagramElement, diagramData, diagramName }) {
  const [exporting, setExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState(null);

  const handleExport = async (format) => {
    if (!diagramElement) {
      setExportStatus({ success: false, message: 'No diagram to export' });
      return;
    }

    setExporting(true);
    setExportStatus(null);

    try {
      let result;
      const filename = `${diagramName || 'diagram'}_${Date.now()}`;

      switch (format) {
        case 'png':
          result = await exportService.exportToPNG(diagramElement, `${filename}.png`);
          break;
        case 'pdf':
          result = await exportService.exportToPDF(diagramElement, `${filename}.pdf`);
          break;
        case 'svg':
          result = await exportService.exportToSVG(diagramElement, `${filename}.svg`);
          break;
        case 'visio':
          result = await exportService.exportToVisio(diagramData, `${filename}.vdx`);
          break;
        default:
          result = { success: false, message: 'Unknown format' };
      }

      setExportStatus(result);
      
      // Clear status after 3 seconds
      setTimeout(() => setExportStatus(null), 3000);
    } catch (error) {
      setExportStatus({ success: false, message: error.message });
    } finally {
      setExporting(false);
    }
  };

  const handleExportAll = async () => {
    if (!diagramElement) return;

    setExporting(true);
    setExportStatus({ success: true, message: 'Exporting all formats...' });

    try {
      const filename = `${diagramName || 'diagram'}_${Date.now()}`;
      await exportService.exportAll(diagramElement, diagramData, filename);
      setExportStatus({ success: true, message: 'All formats exported successfully' });
    } catch (error) {
      setExportStatus({ success: false, message: error.message });
    } finally {
      setExporting(false);
      setTimeout(() => setExportStatus(null), 3000);
    }
  };

  return (
    <div className="export-manager">
      <h4>Export Options</h4>
      <div className="export-buttons-container">
        <ExportButton format="png" onClick={handleExport} disabled={exporting} />
        <ExportButton format="pdf" onClick={handleExport} disabled={exporting} />
        <ExportButton format="svg" onClick={handleExport} disabled={exporting} />
        <ExportButton format="visio" onClick={handleExport} disabled={exporting} />
      </div>
      
      <button 
        className="export-all-button"
        onClick={handleExportAll}
        disabled={exporting}
      >
        Export All Formats
      </button>

      {exportStatus && (
        <div className={`export-status ${exportStatus.success ? 'success' : 'error'}`}>
          {exportStatus.message}
        </div>
      )}
    </div>
  );
}
