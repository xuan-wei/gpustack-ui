import { useCallback, useEffect, useRef, useState } from 'react';
import { ModelRuntimeSnapshot, queryModelRuntimeSnapshots } from '../apis';

type SnapshotMap = Record<string, ModelRuntimeSnapshot>;

export interface UseRuntimeSnapshotsResult {
  snapshots: SnapshotMap;
  updatedAt: string | null;
  refresh: () => Promise<void>;
  refreshing: boolean;
}

export const useRuntimeSnapshots = (
  intervalMs: number = 15000
): UseRuntimeSnapshotsResult => {
  const [snapshots, setSnapshots] = useState<SnapshotMap>({});
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const mountedRef = useRef(true);

  const doFetch = useCallback(async (force: boolean) => {
    try {
      if (force) setRefreshing(true);
      const res = await queryModelRuntimeSnapshots(force);
      if (mountedRef.current && res) {
        setSnapshots(res.snapshots || {});
        setUpdatedAt(res.updated_at || null);
      }
    } catch {
      // ignore
    } finally {
      if (mountedRef.current && force) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    doFetch(false);
    const timer = setInterval(() => doFetch(false), intervalMs);
    return () => {
      mountedRef.current = false;
      clearInterval(timer);
    };
  }, [intervalMs, doFetch]);

  const refresh = useCallback(() => doFetch(true), [doFetch]);

  return { snapshots, updatedAt, refresh, refreshing };
};

export default useRuntimeSnapshots;
