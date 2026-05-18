import AsyncStorage from '@react-native-async-storage/async-storage';

import type { LookupResponse } from '@/lib/trueid-api';

const INSTALLATION_ID_KEY = 'trueid.installationId';
const RECENT_LOOKUPS_KEY = 'trueid.recentLookups';
const LAST_SYNC_KEY = 'trueid.lastSync';

export type SyncSnapshot = {
  contactCount: number;
  syncedAt: string | null;
};

export async function getInstallationId(): Promise<string> {
  const existing = await AsyncStorage.getItem(INSTALLATION_ID_KEY);
  if (existing) {
    return existing;
  }

  const generated =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `device-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;

  await AsyncStorage.setItem(INSTALLATION_ID_KEY, generated);
  return generated;
}

export async function loadRecentLookups(): Promise<LookupResponse[]> {
  const raw = await AsyncStorage.getItem(RECENT_LOOKUPS_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as LookupResponse[];
  } catch {
    return [];
  }
}

export async function saveRecentLookups(lookups: LookupResponse[]): Promise<void> {
  await AsyncStorage.setItem(RECENT_LOOKUPS_KEY, JSON.stringify(lookups));
}

export async function loadSyncSnapshot(): Promise<SyncSnapshot> {
  const raw = await AsyncStorage.getItem(LAST_SYNC_KEY);
  if (!raw) {
    return { contactCount: 0, syncedAt: null };
  }

  try {
    return JSON.parse(raw) as SyncSnapshot;
  } catch {
    return { contactCount: 0, syncedAt: null };
  }
}

export async function saveSyncSnapshot(snapshot: SyncSnapshot): Promise<void> {
  await AsyncStorage.setItem(LAST_SYNC_KEY, JSON.stringify(snapshot));
}
