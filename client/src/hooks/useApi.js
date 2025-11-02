import { useState, useCallback } from 'react';

// useApi is a small wrapper to handle loading/error states for async calls
export default function useApi(fn) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const call = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const result = await fn(...args);
        setLoading(false);
        return result;
      } catch (err) {
        setError(err);
        setLoading(false);
        throw err;
      }
    },
    [fn]
  );

  return { call, loading, error };
}
