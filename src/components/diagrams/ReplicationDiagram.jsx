/**
 * Replication Diagram Component
 * Visualizes replication connections between domain controllers
 */

import { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import './BaseDiagram.css';

export default function ReplicationDiagram({ data }) {
  const containerRef = useRef(null);
  const cyRef = useRef(null);

  useEffect(() => {
    if (!data || !containerRef.current) return;

    const elements = [];

    // Add server nodes
    data.servers.forEach(server => {
      elements.push({
        data: {
          id: server.id,
          label: server.name,
          sublabel: server.hostname,
          type: 'server'
        }
      });
    });

    // Add replication connections
    data.connections.forEach(conn => {
      // Only add edges where both source and target nodes exist
      const sourceExists = data.servers.some(s => s.id === conn.from);
      const targetExists = data.servers.some(s => s.id === conn.to);
      
      if (sourceExists && targetExists) {
        elements.push({
          data: {
            id: conn.id,
            source: conn.from,
            target: conn.to,
            enabled: conn.enabled,
            type: 'replication'
          }
        });
      }
    });

    cyRef.current = cytoscape({
      container: containerRef.current,
      elements: elements,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#FBBC04',
            'label': 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center',
            'color': '#333',
            'width': 100,
            'height': 100,
            'shape': 'hexagon',
            'font-size': 12,
            'font-weight': 'bold'
          }
        },
        {
          selector: 'edge[enabled]',
          style: {
            'width': 3,
            'line-color': '#EA4335',
            'target-arrow-color': '#EA4335',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier'
          }
        },
        {
          selector: 'edge[!enabled]',
          style: {
            'width': 2,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'line-style': 'dashed'
          }
        }
      ],
      layout: {
        name: 'circle',
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
          <span className="legend-color" style={{ backgroundColor: '#FBBC04' }}></span>
          <span>Domain Controller</span>
        </div>
        <div className="legend-item">
          <span className="legend-line" style={{ backgroundColor: '#EA4335' }}></span>
          <span>Active Replication</span>
        </div>
        <div className="legend-item">
          <span className="legend-line dashed" style={{ backgroundColor: '#ccc' }}></span>
          <span>Disabled Replication</span>
        </div>
      </div>
      <div ref={containerRef} className="cytoscape-container"></div>
    </div>
  );
}
