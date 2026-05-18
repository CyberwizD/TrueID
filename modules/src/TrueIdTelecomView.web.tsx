import * as React from 'react';

import { TrueIdTelecomViewProps } from './TrueIdTelecom.types';

export default function TrueIdTelecomView(props: TrueIdTelecomViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
