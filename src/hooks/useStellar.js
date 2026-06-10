// src/hooks/useStellar.js
// Wraps all contract interactions for use in React components

import { useState, useCallback } from "react";
import {
  getCircleStatus,
  createCircle,
  contribute,
  releasePayout,
  getReputation,
} from "../lib/stellar";

export function useStellar(contractId) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [circleStatus, setCircleStatus] = useState(null);

  const fetchStatus = useCallback(async () => {
    if (!contractId) return;
    setLoading(true);
    setError(null);
    try {
      const status = await getCircleStatus(contractId);
      setCircleStatus(status);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [contractId]);

  const handleContribute = useCallback(
    async () => {
      setLoading(true);
      setError(null);
      try {
        await contribute(contractId);
        await fetchStatus();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [contractId, fetchStatus]
  );

  const handleReleasePayout = useCallback(
    async () => {
      setLoading(true);
      setError(null);
      try {
        await releasePayout(contractId);
        await fetchStatus();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [contractId, fetchStatus]
  );

  const fetchReputation = useCallback(
    async (address) => {
      return await getReputation(contractId, address);
    },
    [contractId]
  );

  return {
    loading,
    error,
    circleStatus,
    fetchStatus,
    handleContribute,
    handleReleasePayout,
    fetchReputation,
  };
}