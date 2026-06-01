import { registerWebModule, NativeModule } from 'expo';

import { TrueIdTelecomStatus } from './TrueIdTelecom.types';

type TrueIdTelecomModuleEvents = {
  onCallerIdentified: () => void;
};

class TrueIdTelecomModule extends NativeModule<TrueIdTelecomModuleEvents> {
  async setApiBaseUrlAsync(): Promise<void> {
    return;
  }

  async getStatusAsync(): Promise<TrueIdTelecomStatus> {
    return {
      platform: 'web',
      sdkInt: undefined,
      apiBaseUrl: null,
      backendConfigured: false,
      callScreeningRoleHeld: false,
      callScreeningRoleAvailable: false,
      nativeAvailable: false,
    };
  }

  async openCallScreeningRoleRequestAsync(): Promise<void> {
    return;
  }

  async showCallerOverlayAsync(): Promise<void> {
    return;
  }
}

export default registerWebModule(TrueIdTelecomModule, 'TrueIdTelecom');
