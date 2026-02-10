/**
 * Forest Diagram Component
 * Displays forest structure with domains
 */

import { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import './BaseDiagram.css';

export default function ForestDiagram({ data }) {
  const containerRef = useRef(null);
  const cyRef = useRef(null);

  useEffect(() => {
    if (!data || !containerRef.current) return;

    const elements = [];

    // Add domain nodes
    data.domains.forEach(domain => {
      elements.push({
        data: {
          id: domain.id,
          label: domain.name,
          type: 'domain'
        }
      });
    });

    // Create cytoscape instance
    cyRef.current = cytoscape({
      container: containerRef.current,
      elements: elements,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#4285F4',
            'label': 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center',
            'color': '#fff',
            'text-outline-width': 2,
            'text-outline-color': '#4285F4',
            'width': 120,
            'height': 60,
            'shape': 'roundrectangle',
            'font-size': 14,
            'font-weight': 'bold'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier'
          }
        }
      ],
      layout: {
        name: 'grid',
        rows: 1,
        padding: 50
      }
    });

    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
      }
    };
  }, [data]);

  if (!data) return <div>No data available</div>;

  return (
    <div className="diagram-wrapper">
      <div className="diagram-legend">
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#4285F4' }}></span>
          <span>Domain</span>
        </div>
      </div>
      <div ref={containerRef} className="cytoscape-container"></div>
    </div>
  );
}
