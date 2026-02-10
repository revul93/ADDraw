/**
 * Custom hook for fetching and managing diagram data
 */

import { useState, useCallback } from 'react';
import adQueryService from '../services/adQueryService.js';

export function useDiagramData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchForestStructure = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await adQueryService.getForestStructure();
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSiteTopology = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await adQueryService.getSiteTopology();
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDCPlacement = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await adQueryService.getDCPlacement();
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchReplicationTopology = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await adQueryService.getReplicationTopology();
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTrustRelationships = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await adQueryService.getTrustRelationships();
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await adQueryService.getAllTopologyData();
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearData = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    fetchForestStructure,
    fetchSiteTopology,
    fetchDCPlacement,
    fetchReplicationTopology,
    fetchTrustRelationships,
    fetchAllData,
    clearData
  };
}
