import { PermissionsAndroid, Platform } from 'react-native';
import { requireNativeModule } from 'expo';

import { getConfiguredApiBaseUrl, type LookupResponse } from '@/lib/trueid-api';

export type NativeTelecomStatus = {
  platform: string;
  sdkInt?: number;
  apiBaseUrl: string | null;
  backendConfigured: boolean;
  phoneStateGranted: boolean;
  callLogGranted: boolean;
  answerPhoneCallsGranted: boolean;
  canDrawOverlays?: boolean;
  nativeAvailable: boolean;
};

type TrueIdTelecomModuleShape = {
  setApiBaseUrlAsync(apiBaseUrl: string): Promise<void>;
  getStatusAsync(): Promise<NativeTelecomStatus>;
  requestOverlayPermissionAsync(): Promise<void>;
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
      sdkInt: undefined,
      apiBaseUrl: null,
      backendConfigured: false,
      phoneStateGranted: false,
      callLogGranted: false,
      answerPhoneCallsGranted: false,
      canDrawOverlays: false,
      nativeAvailable: false,
    };
  }

  return nativeModule.getStatusAsync();
}

export async function requestPhoneStatePermission(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }
  await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE);
}

export async function requestCallLogPermission(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }
  await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CALL_LOG);
}

export async function requestAnswerPhoneCallsPermission(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }
  if (Platform.Version >= 26) {
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ANSWER_PHONE_CALLS);
  }
}

export async function requestOverlayPermission(): Promise<void> {
  const nativeModule = getNativeModule();
  if (!nativeModule) {
    return;
  }

  await nativeModule.requestOverlayPermissionAsync();
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
