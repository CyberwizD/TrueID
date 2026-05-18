import { Platform } from 'react-native';

import TrueIdTelecomModule from '@/modules';
import { getConfiguredApiBaseUrl, type LookupResponse } from '@/lib/trueid-api';

export type NativeTelecomStatus = {
  platform: string;
  apiBaseUrl: string | null;
  backendConfigured: boolean;
  callScreeningRoleHeld: boolean;
  nativeAvailable: boolean;
};

export async function syncNativeApiBaseUrl(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }

  await TrueIdTelecomModule.setApiBaseUrlAsync(getConfiguredApiBaseUrl());
}

export async function getNativeTelecomStatus(): Promise<NativeTelecomStatus> {
  if (Platform.OS !== 'android') {
    return {
      platform: Platform.OS,
      apiBaseUrl: null,
      backendConfigured: false,
      callScreeningRoleHeld: false,
      nativeAvailable: false,
    };
  }

  return TrueIdTelecomModule.getStatusAsync();
}

export async function openCallScreeningRoleRequest(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }

  await TrueIdTelecomModule.openCallScreeningRoleRequestAsync();
}

export async function previewNativeOverlay(result: LookupResponse): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }

  await TrueIdTelecomModule.showCallerOverlayAsync(
    result.phone_number,
    result.name,
    result.location,
    result.spam,
    result.confidence,
    result.spam_score,
  );
}
