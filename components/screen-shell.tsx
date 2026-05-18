import type { PropsWithChildren, ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';

type ScreenShellProps = PropsWithChildren<{
  header?: ReactNode;
}>;

export function ScreenShell({ children, header }: ScreenShellProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.glowTop} />
        {header ? <View style={styles.header}>{header}</View> : null}
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scroll: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 18,
  },
  glowTop: {
    position: 'absolute',
    top: -120,
    right: -40,
    width: 240,
    height: 240,
    borderRadius: 999,
    backgroundColor: 'rgba(199, 166, 106, 0.09)',
  },
  header: {
    paddingTop: 8,
  },
});
