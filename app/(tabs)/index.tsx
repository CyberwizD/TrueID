import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CallerListItem } from '@/components/caller-list-item';
import { MetricTile } from '@/components/metric-tile';
import { Reveal } from '@/components/reveal';
import { ScreenShell } from '@/components/screen-shell';
import { SectionHeading } from '@/components/section-heading';
import { Colors, Fonts, Radii } from '@/constants/theme';
import { callerDirectory, homeMetrics, recentLookups } from '@/data/mock-data';

export default function HomeScreen() {
  const incomingCall = callerDirectory[0];

  return (
    <ScreenShell
      header={
        <View style={styles.topbar}>
          <Text style={styles.brand}>TrueID</Text>
          <Link href="/modal" asChild>
            <Pressable style={styles.headerAction}>
              <Text style={styles.headerActionText}>Privacy</Text>
            </Pressable>
          </Link>
        </View>
      }>
      <Reveal delay={50}>
        <SectionHeading
          eyebrow="Realtime caller intelligence"
          title="Know the number before you answer."
          detail="A lighter, trust-first interface for caller identity, spam detection, and regional context."
        />
      </Reveal>

      <Reveal delay={120} style={styles.hero}>
        <Text style={styles.heroLabel}>Incoming call preview</Text>
        <View style={styles.heroRow}>
          <View style={{ flex: 1, gap: 6 }}>
            <Text style={styles.heroName}>{incomingCall.name}</Text>
            <Text style={styles.heroMeta}>{incomingCall.phoneNumber}</Text>
            <Text style={styles.heroMeta}>{incomingCall.location}</Text>
          </View>
          <Text style={styles.heroConfidence}>{incomingCall.confidence}%</Text>
        </View>
        <View style={styles.heroDivider} />
        <View style={styles.heroFooter}>
          <Text style={styles.heroStatus}>Verified business line</Text>
          <Text style={styles.heroNote}>{incomingCall.notes}</Text>
        </View>
      </Reveal>

      <Reveal delay={180}>
        <View style={styles.metricRow}>
          {homeMetrics.map((metric) => (
            <MetricTile key={metric.label} label={metric.label} value={metric.value} />
          ))}
        </View>
      </Reveal>

      <Reveal delay={240} style={styles.section}>
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Recent lookups</Text>
          <Text style={styles.sectionHint}>Tap for caller detail</Text>
        </View>
        <View style={styles.stack}>
          {recentLookups.map((caller) => (
            <CallerListItem key={caller.phoneNumber} caller={caller} />
          ))}
        </View>
      </Reveal>

      <Reveal delay={300} style={styles.permissions}>
        <Text style={styles.sectionTitle}>MVP rollout checklist</Text>
        <View style={styles.stack}>
          {[
            'Overlay permission and call-state listener on Android',
            'Backend lookup wired to FastAPI contract',
            'Contacts upload behind explicit consent',
          ].map((item) => (
            <View key={item} style={styles.checkRow}>
              <View style={styles.checkDot} />
              <Text style={styles.checkText}>{item}</Text>
            </View>
          ))}
        </View>
      </Reveal>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  brand: {
    color: Colors.light.text,
    fontFamily: Fonts.display,
    fontSize: 24,
  },
  headerAction: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: Colors.light.line,
    backgroundColor: Colors.light.surface,
  },
  headerActionText: {
    color: Colors.light.text,
    fontFamily: Fonts.body,
    fontSize: 13,
    fontWeight: '600',
  },
  hero: {
    padding: 22,
    borderRadius: Radii.lg,
    backgroundColor: Colors.light.surfaceMuted,
    borderWidth: 1,
    borderColor: Colors.light.line,
    gap: 16,
  },
  heroLabel: {
    color: Colors.light.accent,
    fontFamily: Fonts.body,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  heroRow: {
    flexDirection: 'row',
    gap: 16,
  },
  heroName: {
    color: Colors.light.text,
    fontFamily: Fonts.display,
    fontSize: 32,
    lineHeight: 36,
  },
  heroMeta: {
    color: Colors.light.muted,
    fontFamily: Fonts.body,
    fontSize: 14,
  },
  heroConfidence: {
    color: Colors.light.accent,
    fontFamily: Fonts.display,
    fontSize: 34,
    lineHeight: 38,
  },
  heroDivider: {
    height: 1,
    backgroundColor: Colors.light.line,
  },
  heroFooter: {
    gap: 6,
  },
  heroStatus: {
    color: Colors.light.success,
    fontFamily: Fonts.body,
    fontSize: 13,
    fontWeight: '700',
  },
  heroNote: {
    color: Colors.light.text,
    fontFamily: Fonts.body,
    fontSize: 14,
    lineHeight: 21,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 12,
  },
  section: {
    gap: 14,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: Colors.light.text,
    fontFamily: Fonts.body,
    fontSize: 19,
    fontWeight: '700',
  },
  sectionHint: {
    color: Colors.light.muted,
    fontFamily: Fonts.body,
    fontSize: 13,
  },
  stack: {
    gap: 12,
  },
  permissions: {
    padding: 20,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.light.line,
    backgroundColor: Colors.light.surface,
    gap: 16,
  },
  checkRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  checkDot: {
    width: 10,
    height: 10,
    borderRadius: Radii.pill,
    backgroundColor: Colors.light.accent,
  },
  checkText: {
    flex: 1,
    color: Colors.light.text,
    fontFamily: Fonts.body,
    fontSize: 14,
    lineHeight: 20,
  },
});
