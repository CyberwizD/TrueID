import { NativeModule, requireNativeModule } from 'expo';

import { TrueIdTelecomModuleEvents, TrueIdTelecomStatus } from './TrueIdTelecom.types';

declare class TrueIdTelecomModule extends NativeModule<TrueIdTelecomModuleEvents> {
  setApiBaseUrlAsync(apiBaseUrl: string): Promise<void>;
  getStatusAsync(): Promise<TrueIdTelecomStatus>;
  openCallScreeningRoleRequestAsync(): Promise<void>;
  showCallerOverlayAsync(
    phoneNumber: string,
    name: string,
    location: string,
    spam: boolean,
    confidence: number,
    spamScore: number
  ): Promise<void>;
}

export default requireNativeModule<TrueIdTelecomModule>('TrueIdTelecom');
