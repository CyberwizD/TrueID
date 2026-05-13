import { StyleSheet, Text, View } from 'react-native';

import { ScreenShell } from '@/components/screen-shell';
import { Colors, Fonts, Radii } from '@/constants/theme';
import { privacyControls } from '@/data/mock-data';

export default function ModalScreen() {
  return (
    <ScreenShell>
      <View style={styles.panel}>
        <Text style={styles.title}>Privacy promise</Text>
        <Text style={styles.subtitle}>
          TrueID should identify callers without turning into a surveillance product. These are the launch guardrails.
        </Text>
        <View style={styles.list}>
          {privacyControls.map((item) => (
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
    padding: 22,
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
    alignItems: 'flex-start',
    gap: 12,
  },
  marker: {
    width: 8,
    height: 8,
    marginTop: 6,
    borderRadius: Radii.pill,
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
