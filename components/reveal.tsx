import type { PropsWithChildren } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

type RevealProps = PropsWithChildren<{
  delay?: number;
  style?: StyleProp<ViewStyle>;
}>;

export function Reveal({ children, delay = 0, style }: RevealProps) {
  return (
    <Animated.View
      entering={FadeInDown.duration(500).delay(delay)}
      style={style}>
      {children}
    </Animated.View>
  );
}
