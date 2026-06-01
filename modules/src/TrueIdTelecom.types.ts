import type { StyleProp, ViewStyle } from 'react-native';

export type OnLoadEventPayload = {
  url: string;
};

export type CallerOverlayPreviewPayload = {
  phoneNumber: string;
  name: string;
  location: string;
  spam: boolean;
  confidence: number;
  spamScore: number;
};

export type TrueIdTelecomStatus = {
  platform: string;
  sdkInt?: number;
  apiBaseUrl: string | null;
  backendConfigured: boolean;
  callScreeningRoleHeld: boolean;
  callScreeningRoleAvailable?: boolean;
  nativeAvailable: boolean;
};

export type TrueIdTelecomModuleEvents = {
  onCallerIdentified: (params: CallerOverlayPreviewPayload) => void;
};

export type TrueIdTelecomViewProps = {
  url: string;
  onLoad: (event: { nativeEvent: OnLoadEventPayload }) => void;
  style?: StyleProp<ViewStyle>;
};
