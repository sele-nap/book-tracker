import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

type State<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export function useApi<T>(fetcher: () => Promise<T>) {
  const [state, setState] = useState<State<T>>({
    data: null,
    loading: true,
    error: null,
  });
  const fetcherRef = useRef(fetcher);

  useLayoutEffect(() => {
    fetcherRef.current = fetcher;
  });

  // Async-only fetch: no synchronous setState, safe to call from effects
  const fetch = useCallback(() => {
    fetcherRef
      .current()
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setState({ data: null, loading: false, error: message });
      });
  }, []);

  // Manual refetch: resets loading state synchronously (called from event handlers)
  const refetch = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }));
    fetch();
  }, [fetch]);

  useEffect(() => {
    fetch();
  }, [fetcher, fetch]);

  return { ...state, refetch };
}
