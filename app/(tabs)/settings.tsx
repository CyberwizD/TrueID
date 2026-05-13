import { StyleSheet, Text, View } from 'react-native';

import { Reveal } from '@/components/reveal';
import { ScreenShell } from '@/components/screen-shell';
import { SectionHeading } from '@/components/section-heading';
import { Colors, Fonts, Radii } from '@/constants/theme';
import { privacyControls, settingsChecklist } from '@/data/mock-data';

export default function SettingsScreen() {
  return (
    <ScreenShell>
      <Reveal delay={60}>
        <SectionHeading
          eyebrow="Product controls"
          title="Keep trust visible in the interface."
          detail="This screen frames permissions, privacy, and infrastructure choices as first-class product decisions."
        />
      </Reveal>

      <Reveal delay={120} style={styles.panel}>
        <Text style={styles.panelTitle}>Launch checklist</Text>
        <View style={styles.stack}>
          {settingsChecklist.map((item) => (
            <View key={item.label} style={styles.row}>
              <Text style={styles.rowLabel}>{item.label}</Text>
              <Text style={styles.rowValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      </Reveal>

      <Reveal delay={180} style={styles.panel}>
        <Text style={styles.panelTitle}>Privacy guardrails</Text>
        <View style={styles.stack}>
          {privacyControls.map((item) => (
            <View key={item} style={styles.guardrail}>
              <View style={styles.guardrailBar} />
              <Text style={styles.guardrailText}>{item}</Text>
            </View>
          ))}
        </View>
      </Reveal>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  panel: {
    padding: 20,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.light.line,
    backgroundColor: Colors.light.surface,
    gap: 16,
  },
  panelTitle: {
    color: Colors.light.text,
    fontFamily: Fonts.body,
    fontSize: 19,
    fontWeight: '700',
  },
  stack: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.line,
  },
  rowLabel: {
    flex: 1,
    color: Colors.light.muted,
    fontFamily: Fonts.body,
    fontSize: 14,
  },
  rowValue: {
    color: Colors.light.text,
    fontFamily: Fonts.body,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'right',
  },
  guardrail: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  guardrailBar: {
    width: 4,
    height: 30,
    borderRadius: Radii.pill,
    backgroundColor: Colors.light.accent,
  },
  guardrailText: {
    flex: 1,
    color: Colors.light.text,
    fontFamily: Fonts.body,
    fontSize: 14,
    lineHeight: 21,
  },
});
