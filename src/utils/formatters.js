/**
 * Data Formatting Utilities
 */

/**
 * Format distinguished name for display
 * @param {string} dn - Distinguished name
 * @returns {string} Formatted name
 */
export function formatDN(dn) {
  if (!dn) return 'Unknown';
  
  // Extract CN or DC components
  const match = dn.match(/CN=([^,]+)|DC=([^,]+)/);
  return match ? (match[1] || match[2]) : dn;
}

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date
 */
export function formatDate(date) {
  if (!date) return 'Unknown';
  
  const d = new Date(date);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
}

/**
 * Format trust direction
 * @param {number|string} direction - Trust direction
 * @returns {string} Formatted direction
 */
export function formatTrustDirection(direction) {
  if (typeof direction === 'string') return direction;
  
  switch (direction) {
    case 1: return 'Inbound';
    case 2: return 'Outbound';
    case 3: return 'Bidirectional';
    default: return 'Unknown';
  }
}

/**
 * Get color for object type
 * @param {string} type - Object type
 * @returns {string} Color hex code
 */
export function getColorForType(type) {
  const colors = {
    domain: '#4285F4',
    site: '#34A853',
    server: '#FBBC04',
    dc: '#FBBC04',
    domainController: '#FBBC04',
    replication: '#EA4335',
    trust: '#9334E6',
    siteLink: '#00BCD4'
  };

  return colors[type] || '#757575';
}

/**
 * Generate unique ID
 * @returns {string} Unique identifier
 */
export function generateId() {
  return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Sanitize filename
 * @param {string} filename - Filename to sanitize
 * @returns {string} Sanitized filename
 */
export function sanitizeFilename(filename) {
  return filename
    .replace(/[^a-z0-9]/gi, '_')
    .toLowerCase();
}

/**
 * Deep clone object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Truncate text
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export function truncate(text, maxLength = 50) {
  if (!text || text.length <= maxLength) return text;
  return text.substr(0, maxLength - 3) + '...';
}
