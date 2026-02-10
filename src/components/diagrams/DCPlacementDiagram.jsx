/**
 * DC Placement Diagram Component
 * Shows domain controllers distributed across sites
 */

import { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import './BaseDiagram.css';

export default function DCPlacementDiagram({ data }) {
  const containerRef = useRef(null);
  const cyRef = useRef(null);

  useEffect(() => {
    if (!data || !containerRef.current) return;

    const elements = [];

    // Add site and DC nodes
    data.sites.forEach(site => {
      // Add site node
      elements.push({
        data: {
          id: site.id,
          label: site.name,
          type: 'site'
        }
      });

      // Add DC nodes for this site
      site.domainControllers.forEach(dc => {
        elements.push({
          data: {
            id: dc.id,
            label: dc.name,
            sublabel: dc.hostname,
            type: 'dc'
          }
        });

        // Add edge from site to DC
        elements.push({
          data: {
            source: site.id,
            target: dc.id
          }
        });
      });
    });

    cyRef.current = cytoscape({
      container: containerRef.current,
      elements: elements,
      style: [
        {
          selector: 'node[type="site"]',
          style: {
            'background-color': '#34A853',
            'label': 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center',
            'color': '#fff',
            'text-outline-width': 2,
            'text-outline-color': '#34A853',
            'width': 120,
            'height': 80,
            'shape': 'roundrectangle',
            'font-size': 14,
            'font-weight': 'bold'
          }
        },
        {
          selector: 'node[type="dc"]',
          style: {
            'background-color': '#FBBC04',
            'label': 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center',
            'color': '#333',
            'width': 80,
            'height': 80,
            'shape': 'rectangle',
            'font-size': 11,
            'font-weight': 'bold'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#ccc',
            'curve-style': 'bezier'
          }
        }
      ],
      layout: {
        name: 'breadthfirst',
        directed: true,
        padding: 50,
        spacingFactor: 1.5
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
          <span className="legend-color" style={{ backgroundColor: '#34A853' }}></span>
          <span>Site</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#FBBC04' }}></span>
          <span>Domain Controller</span>
        </div>
      </div>
      <div ref={containerRef} className="cytoscape-container"></div>
    </div>
  );
}
