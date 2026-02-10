/**
 * Diagram Selector Component
 */

import { useState } from 'react';
import DiagramTypeCard from './DiagramTypeCard.jsx';
import './DiagramSelector.css';

const DIAGRAM_TYPES = [
  {
    id: 'forest',
    title: 'Forest Structure',
    description: 'Shows all domains in the forest hierarchy',
    type: 'Hierarchy'
  },
  {
    id: 'site',
    title: 'Site Topology',
    description: 'Displays AD sites and site links with associated subnets',
    type: 'Topology'
  },
  {
    id: 'dc',
    title: 'Domain Controller Placement',
    description: 'Shows DCs distributed across sites',
    type: 'Placement'
  },
  {
    id: 'replication',
    title: 'Replication Topology',
    description: 'Visualizes replication connections between domain controllers',
    type: 'Network'
  },
  {
    id: 'trust',
    title: 'Trust Relationships',
    description: 'Displays trust relationships between domains',
    type: 'Relationships'
  }
];

export default function DiagramSelector({ onGenerate }) {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleToggle = (id) => {
    setSelectedTypes(prev => {
      if (prev.includes(id)) {
        return prev.filter(t => t !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedTypes([]);
      setSelectAll(false);
    } else {
      setSelectedTypes(DIAGRAM_TYPES.map(t => t.id));
      setSelectAll(true);
    }
  };

  const handleGenerate = () => {
    if (selectedTypes.length > 0) {
      onGenerate(selectedTypes);
    }
  };

  return (
    <div className="diagram-selector-container">
      <h2>Select Diagram Types</h2>
      <p className="selector-description">
        Choose one or more diagram types to generate. Each diagram provides a different 
        view of your Active Directory topology.
      </p>

      <div className="select-all-container">
        <label>
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
          />
          Select All Diagrams
        </label>
      </div>

      <div className="diagram-types-grid">
        {DIAGRAM_TYPES.map(diagram => (
          <DiagramTypeCard
            key={diagram.id}
            type={diagram.type}
            title={diagram.title}
            description={diagram.description}
            selected={selectedTypes.includes(diagram.id)}
            onToggle={() => handleToggle(diagram.id)}
          />
        ))}
      </div>

      <div className="selector-actions">
        <button 
          className="generate-button"
          onClick={handleGenerate}
          disabled={selectedTypes.length === 0}
        >
          Generate Diagrams ({selectedTypes.length})
        </button>
      </div>
    </div>
  );
}
