/**
 * Site Topology Diagram Component
 * Displays sites and site links
 */

import { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import './BaseDiagram.css';

export default function SiteTopologyDiagram({ data }) {
  const containerRef = useRef(null);
  const cyRef = useRef(null);

  useEffect(() => {
    if (!data || !containerRef.current) return;

    const elements = [];

    // Add site nodes
    data.sites.forEach(site => {
      elements.push({
        data: {
          id: site.id,
          label: site.name,
          sublabel: site.location,
          type: 'site'
        }
      });
    });

    // Add site link edges
    data.siteLinks.forEach(link => {
      link.sites.forEach((site, index) => {
        if (index < link.sites.length - 1) {
          elements.push({
            data: {
              id: `${link.id}_${index}`,
              source: data.sites.find(s => s.name === site)?.id,
              target: data.sites.find(s => s.name === link.sites[index + 1])?.id,
              label: `Cost: ${link.cost}`,
              type: 'siteLink'
            }
          });
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
            'background-color': '#34A853',
            'label': 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center',
            'color': '#fff',
            'text-outline-width': 2,
            'text-outline-color': '#34A853',
            'width': 100,
            'height': 100,
            'shape': 'ellipse',
            'font-size': 12,
            'font-weight': 'bold'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 3,
            'line-color': '#00BCD4',
            'target-arrow-color': '#00BCD4',
            'target-arrow-shape': 'none',
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

  if (!data) return <div>No data available</div>;

  return (
    <div className="diagram-wrapper">
      <div className="diagram-legend">
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#34A853' }}></span>
          <span>Site</span>
        </div>
        <div className="legend-item">
          <span className="legend-line" style={{ backgroundColor: '#00BCD4' }}></span>
          <span>Site Link</span>
        </div>
      </div>
      <div ref={containerRef} className="cytoscape-container"></div>
    </div>
  );
}
