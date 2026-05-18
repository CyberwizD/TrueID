import { requireNativeView } from 'expo';
import * as React from 'react';

import { TrueIdTelecomViewProps } from './TrueIdTelecom.types';

const NativeView: React.ComponentType<TrueIdTelecomViewProps> =
  requireNativeView('TrueIdTelecom');

export default function TrueIdTelecomView(props: TrueIdTelecomViewProps) {
  return <NativeView {...props} />;
}
