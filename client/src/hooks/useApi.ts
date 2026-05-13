import { useCallback, useEffect, useState } from 'react';

type State<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export function useApi<T>(fetcher: () => Promise<T>) {
  const [state, setState] = useState<State<T>>({ data: null, loading: true, error: null });

  const fetch = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }));
    fetcher()
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setState({ data: null, loading: false, error: message });
      });
  }, [fetcher]);

  useEffect(() => { fetch(); }, [fetch]);

  return { ...state, refetch: fetch };
}
