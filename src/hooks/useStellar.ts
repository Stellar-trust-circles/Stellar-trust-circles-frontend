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

export function useStellar(initialContractId?: string) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [circleStatus, setCircleStatus] = useState<CircleStatus | null>(null);

  const fetchStatus = useCallback(async (contractId?: string) => {
    const id = contractId || initialContractId;
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const status = await getCircleStatus(id);
      setCircleStatus(status);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [initialContractId]);

  const handleContribute = useCallback(
    async (contractId?: string) => {
      const id = contractId || initialContractId;
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        await contribute(id);
        await fetchStatus(id);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    },
    [initialContractId, fetchStatus]
  );

  const handleReleasePayout = useCallback(
    async (contractId?: string) => {
      const id = contractId || initialContractId;
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        await releasePayout(id);
        await fetchStatus(id);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    },
    [initialContractId, fetchStatus]
  );

  const fetchReputation = useCallback(
    async (address: string, contractId?: string) => {
      const id = contractId || initialContractId;
      if (!id) return 0;
      return await getReputation(id, address);
    },
    [initialContractId]
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
