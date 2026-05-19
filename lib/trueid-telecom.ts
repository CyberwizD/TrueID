import { Platform } from 'react-native';
import { requireNativeModule } from 'expo';

import { getConfiguredApiBaseUrl, type LookupResponse } from '@/lib/trueid-api';

export type NativeTelecomStatus = {
  platform: string;
  apiBaseUrl: string | null;
  backendConfigured: boolean;
  callScreeningRoleHeld: boolean;
  nativeAvailable: boolean;
};

type TrueIdTelecomModuleShape = {
  setApiBaseUrlAsync(apiBaseUrl: string): Promise<void>;
  getStatusAsync(): Promise<NativeTelecomStatus>;
  openCallScreeningRoleRequestAsync(): Promise<void>;
  showCallerOverlayAsync(
    phoneNumber: string,
    name: string,
    location: string,
    spam: boolean,
    confidence: number,
    spamScore: number
  ): Promise<void>;
};

let cachedModule: TrueIdTelecomModuleShape | null | undefined;

function getNativeModule(): TrueIdTelecomModuleShape | null {
  if (Platform.OS !== 'android') {
    return null;
  }

  if (cachedModule !== undefined) {
    return cachedModule;
  }

  try {
    cachedModule = requireNativeModule<TrueIdTelecomModuleShape>('TrueIdTelecom');
  } catch {
    cachedModule = null;
  }

  return cachedModule;
}

export async function syncNativeApiBaseUrl(): Promise<void> {
  const nativeModule = getNativeModule();
  if (!nativeModule) {
    return;
  }

  await nativeModule.setApiBaseUrlAsync(getConfiguredApiBaseUrl());
}

export async function getNativeTelecomStatus(): Promise<NativeTelecomStatus> {
  const nativeModule = getNativeModule();
  if (!nativeModule) {
    return {
      platform: Platform.OS,
      apiBaseUrl: null,
      backendConfigured: false,
      callScreeningRoleHeld: false,
      nativeAvailable: false,
    };
  }

  return nativeModule.getStatusAsync();
}

export async function openCallScreeningRoleRequest(): Promise<void> {
  const nativeModule = getNativeModule();
  if (!nativeModule) {
    return;
  }

  await nativeModule.openCallScreeningRoleRequestAsync();
}

export async function previewNativeOverlay(result: LookupResponse): Promise<void> {
  const nativeModule = getNativeModule();
  if (!nativeModule) {
    return;
  }

  await nativeModule.showCallerOverlayAsync(
    result.phone_number,
    result.name,
    result.location,
    result.spam,
    result.confidence,
    result.spam_score,
  );
}
