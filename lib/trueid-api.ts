import Constants from 'expo-constants';

import { normalizePhoneNumber } from '@/lib/phone';

export type SourceSignal = {
  source: 'profile' | 'crowd_contact' | 'spam_reports' | 'location_hint';
  weight: number;
  label: string;
};

export type LookupResponse = {
  phone_number: string;
  name: string;
  location: string;
  spam: boolean;
  confidence: number;
  spam_score: number;
  caller_type: 'individual' | 'business' | 'unknown';
  verified: boolean;
  match_strategy: 'verified_profile' | 'known_profile' | 'crowd_consensus' | 'unknown';
  sources: SourceSignal[];
};

export type HealthResponse = {
  status: 'ok';
  environment: string;
  backend: 'memory' | 'supabase';
};

export type SpamReason =
  | 'scam_fraud'
  | 'telemarketing'
  | 'harassment'
  | 'loan_spam'
  | 'robocall'
  | 'unknown_threat';

export type ContactContributionInput = {
  phone_number: string;
  contact_name: string;
  source_city?: string;
  source_state?: string;
};

export type UploadContactsResponse = {
  uploaded: number;
  unique_numbers: number;
  ignored_duplicates: number;
};

type ExpoExtra = {
  trueIdApiBaseUrl?: string;
};

function getApiBaseUrl(): string {
  const extra = (Constants.expoConfig?.extra ?? {}) as ExpoExtra;
  const configuredBaseUrl =
    process.env.EXPO_PUBLIC_TRUEID_API_BASE_URL ?? extra.trueIdApiBaseUrl ?? 'http://10.0.2.2:8000';

  return configuredBaseUrl.replace(/\/+$/, '');
}

function buildApiUrl(path: string): string {
  return `${getApiBaseUrl()}${path}`;
}

async function readJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function lookupCaller(phoneNumber: string): Promise<LookupResponse> {
  const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber) || phoneNumber;
  const response = await fetch(buildApiUrl('/api/v1/lookup'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phone_number: normalizedPhoneNumber,
    }),
  });

  return readJsonResponse<LookupResponse>(response);
}

export async function fetchApiHealth(): Promise<HealthResponse> {
  const response = await fetch(buildApiUrl('/health'));
  return readJsonResponse<HealthResponse>(response);
}

export async function uploadContacts(
  userId: string,
  contacts: ContactContributionInput[],
): Promise<UploadContactsResponse> {
  const response = await fetch(buildApiUrl('/api/v1/upload-contacts'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      contacts,
    }),
  });

  return readJsonResponse<UploadContactsResponse>(response);
}

export async function reportSpam(phoneNumber: string, reason: SpamReason): Promise<void> {
  const response = await fetch(buildApiUrl('/api/v1/report-spam'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phone_number: normalizePhoneNumber(phoneNumber) || phoneNumber,
      reason,
    }),
  });

  await readJsonResponse(response);
}

export function getConfiguredApiBaseUrl(): string {
  return getApiBaseUrl();
}
