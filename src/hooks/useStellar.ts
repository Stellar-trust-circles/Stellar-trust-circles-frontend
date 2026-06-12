// src/hooks/useStellar.ts
// Wraps all contract interactions for use in React components

import { useState, useCallback } from "react";
import {
  getCircleStatus,
  contribute,
  releasePayout,
  getReputation,
  CircleStatus,
} from "../lib/stellar";

export function useStellar(contractId: string) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [circleStatus, setCircleStatus] = useState<CircleStatus | null>(null);

  const fetchStatus = useCallback(async () => {
    if (!contractId) return;
    setLoading(true);
    setError(null);
    try {
      const status = await getCircleStatus(contractId);
      setCircleStatus(status);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
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
        setError(err instanceof Error ? err.message : String(err));
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
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    },
    [contractId, fetchStatus]
  );

  const fetchReputation = useCallback(
    async (address: string) => {
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
