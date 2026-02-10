/**
 * Diagram Container Component
 * Wrapper for all diagram types with common functionality
 */

import { useRef } from 'react';
import './DiagramContainer.css';

export default function DiagramContainer({ title, children, onExport }) {
  const containerRef = useRef(null);

  return (
    <div className="diagram-container" ref={containerRef}>
      <div className="diagram-header">
        <h3>{title}</h3>
        {onExport && (
          <div className="export-buttons">
            <button onClick={() => onExport('png', containerRef.current)}>
              Export PNG
            </button>
            <button onClick={() => onExport('pdf', containerRef.current)}>
              Export PDF
            </button>
            <button onClick={() => onExport('svg', containerRef.current)}>
              Export SVG
            </button>
            <button onClick={() => onExport('visio', containerRef.current)}>
              Export Visio
            </button>
          </div>
        )}
      </div>
      <div className="diagram-content">
        {children}
      </div>
    </div>
  );
}
