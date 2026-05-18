import { StyleSheet, Text, View } from 'react-native';

import { ScreenShell } from '@/components/screen-shell';
import { Colors, Fonts, Radii } from '@/constants/theme';

const PRIVACY_LINES = [
  'TrueID uses contact access only after you approve it.',
  'The app identifies callers with names, spam risk, and broad location only.',
  'Exact residential addresses are not exposed.',
  'There is no account wall before using the core app.',
];

export default function ModalScreen() {
  return (
    <ScreenShell>
      <View style={styles.panel}>
        <Text style={styles.title}>Privacy</Text>
        <Text style={styles.subtitle}>The app should feel safe before it ever asks for trust.</Text>
        <View style={styles.list}>
          {PRIVACY_LINES.map((item) => (
            <View key={item} style={styles.row}>
              <View style={styles.marker} />
              <Text style={styles.body}>{item}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  panel: {
    marginTop: 12,
    padding: 24,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.light.line,
    backgroundColor: Colors.light.surface,
    gap: 16,
  },
  title: {
    color: Colors.light.text,
    fontFamily: Fonts.display,
    fontSize: 32,
    lineHeight: 36,
  },
  subtitle: {
    color: Colors.light.muted,
    fontFamily: Fonts.body,
    fontSize: 15,
    lineHeight: 22,
  },
  list: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  marker: {
    width: 8,
    height: 8,
    marginTop: 6,
    borderRadius: 8,
    backgroundColor: Colors.light.accent,
  },
  body: {
    flex: 1,
    color: Colors.light.text,
    fontFamily: Fonts.body,
    fontSize: 14,
    lineHeight: 21,
  },
});
