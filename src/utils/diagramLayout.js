/**
 * Diagram Layout Utilities
 * Provides layout algorithms and helpers for diagram visualization
 */

/**
 * Calculate hierarchical layout for tree structures
 * @param {Array} nodes - Array of node objects
 * @param {Array} edges - Array of edge objects
 * @returns {Object} Layout with positioned nodes
 */
export function calculateHierarchicalLayout(nodes, edges) {
  const layout = {
    nodes: [],
    edges: edges
  };

  // Build adjacency list
  const childrenMap = new Map();
  const parentMap = new Map();
  
  edges.forEach(edge => {
    if (!childrenMap.has(edge.from)) {
      childrenMap.set(edge.from, []);
    }
    childrenMap.get(edge.from).push(edge.to);
    parentMap.set(edge.to, edge.from);
  });

  // Find root nodes (nodes with no parents)
  const roots = nodes.filter(node => !parentMap.has(node.id));

  // Level-by-level positioning
  const levelWidth = 200;
  const levelHeight = 150;
  const nodesByLevel = new Map();

  function assignLevels(nodeId, level = 0) {
    if (!nodesByLevel.has(level)) {
      nodesByLevel.set(level, []);
    }
    nodesByLevel.get(level).push(nodeId);

    const children = childrenMap.get(nodeId) || [];
    children.forEach(childId => assignLevels(childId, level + 1));
  }

  roots.forEach(root => assignLevels(root.id));

  // Position nodes
  nodes.forEach(node => {
    let level = 0;
    let position = 0;

    // Find node's level
    for (const [lvl, nodesInLevel] of nodesByLevel.entries()) {
      const idx = nodesInLevel.indexOf(node.id);
      if (idx !== -1) {
        level = lvl;
        position = idx;
        break;
      }
    }

    const nodesInLevel = nodesByLevel.get(level) || [];
    const offsetX = (position - (nodesInLevel.length - 1) / 2) * levelWidth;

    layout.nodes.push({
      ...node,
      x: offsetX,
      y: level * levelHeight
    });
  });

  return layout;
}

/**
 * Calculate force-directed layout
 * @param {Array} nodes - Array of node objects
 * @param {Array} edges - Array of edge objects
 * @param {Object} options - Layout options
 * @returns {Object} Layout with positioned nodes
 */
export function calculateForceLayout(nodes, edges, options = {}) {
  const {
    width = 800,
    height = 600,
    iterations = 100
  } = options;

  // Initialize random positions
  const positioned = nodes.map(node => ({
    ...node,
    x: Math.random() * width,
    y: Math.random() * height,
    vx: 0,
    vy: 0
  }));

  // Simple force-directed algorithm
  for (let iter = 0; iter < iterations; iter++) {
    // Repulsion between all nodes
    for (let i = 0; i < positioned.length; i++) {
      for (let j = i + 1; j < positioned.length; j++) {
        const dx = positioned[j].x - positioned[i].x;
        const dy = positioned[j].y - positioned[i].y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = 1000 / (distance * distance);

        const fx = (dx / distance) * force;
        const fy = (dy / distance) * force;

        positioned[i].vx -= fx;
        positioned[i].vy -= fy;
        positioned[j].vx += fx;
        positioned[j].vy += fy;
      }
    }

    // Attraction along edges
    edges.forEach(edge => {
      const source = positioned.find(n => n.id === edge.from);
      const target = positioned.find(n => n.id === edge.to);

      if (source && target) {
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = distance * 0.01;

        const fx = (dx / distance) * force;
        const fy = (dy / distance) * force;

        source.vx += fx;
        source.vy += fy;
        target.vx -= fx;
        target.vy -= fy;
      }
    });

    // Update positions
    positioned.forEach(node => {
      node.x += node.vx * 0.1;
      node.y += node.vy * 0.1;
      node.vx *= 0.9;
      node.vy *= 0.9;

      // Keep within bounds
      node.x = Math.max(50, Math.min(width - 50, node.x));
      node.y = Math.max(50, Math.min(height - 50, node.y));
    });
  }

  return {
    nodes: positioned,
    edges: edges
  };
}

/**
 * Calculate grid layout
 * @param {Array} nodes - Array of node objects
 * @param {Object} options - Layout options
 * @returns {Object} Layout with positioned nodes
 */
export function calculateGridLayout(nodes, options = {}) {
  const {
    columns = Math.ceil(Math.sqrt(nodes.length)),
    cellWidth = 200,
    cellHeight = 150,
    padding = 20
  } = options;

  const positioned = nodes.map((node, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);

    return {
      ...node,
      x: col * cellWidth + padding,
      y: row * cellHeight + padding
    };
  });

  return {
    nodes: positioned,
    edges: []
  };
}

/**
 * Calculate circular layout
 * @param {Array} nodes - Array of node objects
 * @param {Object} options - Layout options
 * @returns {Object} Layout with positioned nodes
 */
export function calculateCircularLayout(nodes, options = {}) {
  const {
    radius = 300,
    centerX = 400,
    centerY = 300
  } = options;

  const angleStep = (2 * Math.PI) / nodes.length;

  const positioned = nodes.map((node, index) => {
    const angle = index * angleStep;
    return {
      ...node,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  });

  return {
    nodes: positioned,
    edges: []
  };
}

/**
 * Get layout bounds
 * @param {Array} nodes - Array of positioned nodes
 * @returns {Object} Bounds {minX, minY, maxX, maxY}
 */
export function getLayoutBounds(nodes) {
  if (nodes.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  }

  const bounds = {
    minX: Infinity,
    minY: Infinity,
    maxX: -Infinity,
    maxY: -Infinity
  };

  nodes.forEach(node => {
    bounds.minX = Math.min(bounds.minX, node.x || 0);
    bounds.minY = Math.min(bounds.minY, node.y || 0);
    bounds.maxX = Math.max(bounds.maxX, node.x || 0);
    bounds.maxY = Math.max(bounds.maxY, node.y || 0);
  });

  return bounds;
}
