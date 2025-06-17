import { useState, useCallback } from 'react';

const useLoading = (initialState = false) => {
  const [loading, setLoading] = useState(initialState);
  const [error, setError] = useState(null);

  const withLoading = useCallback(async (callback) => {
    try {
      setLoading(true);
      setError(null);
      await callback();
    } catch (err) {
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    withLoading,
    clearError,
    setLoading,
    setError,
  };
};

export default useLoading; 