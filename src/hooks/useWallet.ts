import { useState, useCallback } from "react";
import { checkFreighter, getWalletAddress } from "../lib/stellar";

interface UseWalletReturn {
  address: string | null;
  connecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

export function useWallet(): UseWalletReturn {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    setConnecting(true);
    setError(null);
    try {
      const installed = await checkFreighter();
      if (!installed) {
        throw new Error(
          "Freighter wallet not found. Install it at freighter.app"
        );
      }
      const addr = await getWalletAddress();
      setAddress(addr);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection failed");
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setError(null);
  }, []);

  return { address, connecting, error, connect, disconnect };
}
