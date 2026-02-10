/**
 * Active Directory Query Service
 * High-level interface for querying AD topology data
 */

import ldapService from './ldapService.js';

class ADQueryService {
  /**
   * Get forest structure
   * @returns {Promise<Object>}
   */
  async getForestStructure() {
    try {
      const domains = await ldapService.search('(objectClass=domain)', [
        'name', 'distinguishedName', 'whenCreated', 'forestLevel'
      ]);

      return {
        type: 'forest',
        domains: domains.map(domain => ({
          id: domain.dn,
          name: domain.name,
          dn: domain.dn,
          created: domain.whenCreated
        }))
      };
    } catch (error) {
      console.error('Error querying forest structure:', error);
      throw error;
    }
  }

  /**
   * Get site topology
   * @returns {Promise<Object>}
   */
  async getSiteTopology() {
    try {
      const sites = await ldapService.search('(objectClass=site)', [
        'name', 'distinguishedName', 'location', 'description'
      ]);

      const siteLinks = await ldapService.search('(objectClass=siteLink)', [
        'name', 'cost', 'replInterval', 'siteList'
      ]);

      return {
        type: 'siteTopology',
        sites: sites.map(site => ({
          id: site.dn,
          name: site.name,
          location: site.location || 'Unknown',
          dn: site.dn
        })),
        siteLinks: siteLinks.map(link => ({
          id: link.dn,
          name: link.name,
          cost: link.cost || 100,
          interval: link.replInterval || 180,
          sites: link.siteList || []
        }))
      };
    } catch (error) {
      console.error('Error querying site topology:', error);
      throw error;
    }
  }

  /**
   * Get domain controller placement
   * @returns {Promise<Object>}
   */
  async getDCPlacement() {
    try {
      const servers = await ldapService.search('(objectClass=server)', [
        'name', 'distinguishedName', 'dNSHostName', 'site'
      ]);

      const sites = await ldapService.search('(objectClass=site)', [
        'name', 'distinguishedName'
      ]);

      // Group servers by site
      const dcsBySite = {};
      servers.forEach(server => {
        const siteName = server.site || 'Unknown';
        if (!dcsBySite[siteName]) {
          dcsBySite[siteName] = [];
        }
        dcsBySite[siteName].push({
          id: server.dn,
          name: server.name,
          hostname: server.dNSHostName,
          dn: server.dn
        });
      });

      return {
        type: 'dcPlacement',
        sites: sites.map(site => ({
          id: site.dn,
          name: site.name,
          domainControllers: dcsBySite[site.name] || []
        }))
      };
    } catch (error) {
      console.error('Error querying DC placement:', error);
      throw error;
    }
  }

  /**
   * Get replication topology
   * @returns {Promise<Object>}
   */
  async getReplicationTopology() {
    try {
      const ntdsConnections = await ldapService.search('(objectClass=nTDSDSA)', [
        'name', 'distinguishedName', 'options', 'fromServer'
      ]);

      const servers = await ldapService.search('(objectClass=server)', [
        'name', 'distinguishedName', 'dNSHostName'
      ]);

      const connections = ntdsConnections
        .filter(ntds => ntds.fromServer)
        .map(ntds => ({
          id: ntds.dn,
          from: ntds.fromServer,
          to: ntds.dn,
          enabled: (ntds.options & 1) === 0
        }));

      return {
        type: 'replication',
        servers: servers.map(server => ({
          id: server.dn,
          name: server.name,
          hostname: server.dNSHostName
        })),
        connections: connections
      };
    } catch (error) {
      console.error('Error querying replication topology:', error);
      throw error;
    }
  }

  /**
   * Get trust relationships
   * @returns {Promise<Object>}
   */
  async getTrustRelationships() {
    try {
      const trusts = await ldapService.search('(objectClass=trustedDomain)', [
        'name', 'distinguishedName', 'trustDirection', 'trustType', 'trustAttributes'
      ]);

      return {
        type: 'trusts',
        trusts: trusts.map(trust => ({
          id: trust.dn,
          name: trust.name,
          direction: this.getTrustDirection(trust.trustDirection),
          type: this.getTrustType(trust.trustType),
          dn: trust.dn
        }))
      };
    } catch (error) {
      console.error('Error querying trust relationships:', error);
      throw error;
    }
  }

  /**
   * Get all topology data
   * @returns {Promise<Object>}
   */
  async getAllTopologyData() {
    try {
      const [forest, sites, dcPlacement, replication, trusts] = await Promise.all([
        this.getForestStructure(),
        this.getSiteTopology(),
        this.getDCPlacement(),
        this.getReplicationTopology(),
        this.getTrustRelationships()
      ]);

      return {
        forest,
        sites,
        dcPlacement,
        replication,
        trusts
      };
    } catch (error) {
      console.error('Error querying all topology data:', error);
      throw error;
    }
  }

  /**
   * Helper: Get trust direction as string
   * @param {number} direction
   * @returns {string}
   */
  getTrustDirection(direction) {
    switch (direction) {
      case 1: return 'Inbound';
      case 2: return 'Outbound';
      case 3: return 'Bidirectional';
      default: return 'Unknown';
    }
  }

  /**
   * Helper: Get trust type as string
   * @param {number} type
   * @returns {string}
   */
  getTrustType(type) {
    switch (type) {
      case 1: return 'Downlevel';
      case 2: return 'Uplevel';
      case 3: return 'MIT';
      case 4: return 'DCE';
      default: return 'Unknown';
    }
  }
}

export default new ADQueryService();
