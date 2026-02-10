/**
 * Export Button Component
 */

import './ExportButton.css';

export default function ExportButton({ format, onClick, disabled }) {
  const icons = {
    png: '🖼️',
    pdf: '📄',
    svg: '🎨',
    visio: '📊'
  };

  return (
    <button 
      className="export-button"
      onClick={() => onClick(format)}
      disabled={disabled}
      title={`Export as ${format.toUpperCase()}`}
    >
      <span className="export-icon">{icons[format]}</span>
      <span className="export-label">{format.toUpperCase()}</span>
    </button>
  );
}
