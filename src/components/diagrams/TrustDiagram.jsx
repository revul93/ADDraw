/**
 * Trust Diagram Component
 * Displays trust relationships between domains
 */

import { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import './BaseDiagram.css';

export default function TrustDiagram({ data }) {
  const containerRef = useRef(null);
  const cyRef = useRef(null);

  useEffect(() => {
    if (!data || !containerRef.current) return;

    const elements = [];
    const domains = new Set();

    // Add local domain (assumed from connection)
    const localDomain = 'contoso.com';
    domains.add(localDomain);

    // Collect all domains from trusts
    data.trusts.forEach(trust => {
      domains.add(trust.name);
    });

    // Add domain nodes
    domains.forEach(domain => {
      elements.push({
        data: {
          id: domain,
          label: domain,
          type: 'domain'
        }
      });
    });

    // Add trust relationships
    data.trusts.forEach((trust, index) => {
      elements.push({
        data: {
          id: `trust_${index}`,
          source: localDomain,
          target: trust.name,
          label: trust.direction,
          type: 'trust'
        }
      });
    });

    cyRef.current = cytoscape({
      container: containerRef.current,
      elements: elements,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#9334E6',
            'label': 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center',
            'color': '#fff',
            'text-outline-width': 2,
            'text-outline-color': '#9334E6',
            'width': 120,
            'height': 80,
            'shape': 'diamond',
            'font-size': 12,
            'font-weight': 'bold'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 3,
            'line-color': '#9334E6',
            'target-arrow-color': '#9334E6',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(label)',
            'font-size': 10,
            'text-background-color': '#fff',
            'text-background-opacity': 1,
            'text-background-padding': 3
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

  if (!data || data.trusts.length === 0) {
    return (
      <div className="diagram-wrapper">
        <div className="no-data-message">
          No trust relationships found
        </div>
      </div>
    );
  }

  return (
    <div className="diagram-wrapper">
      <div className="diagram-legend">
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#9334E6' }}></span>
          <span>Domain</span>
        </div>
        <div className="legend-item">
          <span className="legend-line" style={{ backgroundColor: '#9334E6' }}></span>
          <span>Trust Relationship</span>
        </div>
      </div>
      <div ref={containerRef} className="cytoscape-container"></div>
    </div>
  );
}
