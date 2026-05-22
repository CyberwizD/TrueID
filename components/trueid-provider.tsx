import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';

import {
  loadRecentLookups,
  loadSyncSnapshot,
  saveRecentLookups,
  saveSyncSnapshot,
  type SyncSnapshot,
} from '@/lib/installation';
import { syncNativeApiBaseUrl } from '@/lib/trueid-telecom';
import type { LookupResponse } from '@/lib/trueid-api';

type TrueIdContextValue = {
  recentLookups: LookupResponse[];
  syncSnapshot: SyncSnapshot;
  ready: boolean;
  registerLookup: (lookup: LookupResponse) => Promise<void>;
  setSyncSnapshot: (snapshot: SyncSnapshot) => Promise<void>;
};

const TrueIdContext = createContext<TrueIdContextValue | null>(null);

export function TrueIdProvider({ children }: PropsWithChildren) {
  const [recentLookups, setRecentLookups] = useState<LookupResponse[]>([]);
  const [syncSnapshotState, setSyncSnapshotState] = useState<SyncSnapshot>({
    contactCount: 0,
    syncedAt: null,
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      const [lookups, snapshot] = await Promise.all([
        loadRecentLookups(),
        loadSyncSnapshot(),
        syncNativeApiBaseUrl().catch(() => undefined),
      ]);
      if (!active) {
        return;
      }
      setRecentLookups(lookups);
      setSyncSnapshotState(snapshot);
      setReady(true);
    }

    void bootstrap();

    return () => {
      active = false;
    };
  }, []);

  async function registerLookup(lookup: LookupResponse) {
    const next = [lookup, ...recentLookups.filter((item) => item.phone_number !== lookup.phone_number)].slice(0, 6);
    setRecentLookups(next);
    await saveRecentLookups(next);
  }

  async function updateSyncSnapshot(snapshot: SyncSnapshot) {
    setSyncSnapshotState(snapshot);
    await saveSyncSnapshot(snapshot);
  }

  return (
    <TrueIdContext.Provider
      value={{
        recentLookups,
        syncSnapshot: syncSnapshotState,
        ready,
        registerLookup,
        setSyncSnapshot: updateSyncSnapshot,
      }}>
      {children}
    </TrueIdContext.Provider>
  );
}

export function useTrueId() {
  const context = useContext(TrueIdContext);
  if (!context) {
    throw new Error('useTrueId must be used within TrueIdProvider');
  }
  return context;
}
