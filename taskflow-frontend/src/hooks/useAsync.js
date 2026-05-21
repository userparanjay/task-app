/**
 * Generic async hook — standardizes loading / error / data for page-level fetches.
 */

import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage } from '../utils/errors';

export function useAsync(asyncFn, dependencies = [], options = {}) {
  const { immediate = true, initialData = null } = options;
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const result = await asyncFn(...args);
        setData(result);
        return result;
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    dependencies,
  );

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { data, loading, error, execute, setData };
}

export default useAsync;
