/**
 * Diagram Type Card Component
 */

import './DiagramTypeCard.css';

export default function DiagramTypeCard({ type, title, description, selected, onToggle }) {
  return (
    <div 
      className={`diagram-type-card ${selected ? 'selected' : ''}`}
      onClick={onToggle}
    >
      <div className="card-header">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggle}
          onClick={(e) => e.stopPropagation()}
        />
        <h3>{title}</h3>
      </div>
      <p className="card-description">{description}</p>
      <div className="card-type-badge">{type}</div>
    </div>
  );
}
