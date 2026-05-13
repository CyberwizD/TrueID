import { Link, router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Reveal } from '@/components/reveal';
import { ScreenShell } from '@/components/screen-shell';
import { Colors, Fonts, Radii } from '@/constants/theme';
import { callerDirectory } from '@/data/mock-data';

export default function CallerDetailScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const profile =
    callerDirectory.find((item) => item.phoneNumber === phone) ??
    callerDirectory.find((item) => item.phoneNumber === decodeURIComponent(phone ?? '')) ??
    null;

  if (!profile) {
    return (
      <ScreenShell>
        <Reveal delay={60} style={styles.emptyState}>
          <Text style={styles.title}>Caller not found</Text>
          <Text style={styles.subtitle}>The selected number is not in the current mock directory.</Text>
        </Reveal>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell
      header={
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
          <Link href="/modal" asChild>
            <Pressable style={styles.backButton}>
              <Text style={styles.backButtonText}>Policy</Text>
            </Pressable>
          </Link>
        </View>
      }>
      <Reveal delay={60} style={styles.hero}>
        <Text style={styles.eyebrow}>{profile.matchStrategy.replace('_', ' ')}</Text>
        <Text style={styles.title}>{profile.name}</Text>
        <Text style={styles.subtitle}>{profile.phoneNumber}</Text>
        <Text style={styles.subtitle}>{profile.location}</Text>
        <View style={styles.metaRow}>
          <Text style={[styles.badge, profile.spam ? styles.spamBadge : styles.safeBadge]}>
            {profile.spam ? 'Spam risk' : 'Low risk'}
          </Text>
          <Text style={styles.score}>{profile.confidence}% confidence</Text>
        </View>
      </Reveal>

      <Reveal delay={120} style={styles.panel}>
        <Text style={styles.panelTitle}>Why this identity appears</Text>
        <Text style={styles.body}>{profile.notes}</Text>
        <View style={styles.list}>
          {profile.sources.map((item) => (
            <View key={item} style={styles.listRow}>
              <View style={styles.marker} />
              <Text style={styles.body}>{item}</Text>
            </View>
          ))}
        </View>
      </Reveal>

      <Reveal delay={180} style={styles.actionRow}>
        <Pressable style={styles.primaryAction}>
          <Text style={styles.primaryActionText}>Report spam</Text>
        </Pressable>
        <Pressable style={styles.secondaryAction}>
          <Text style={styles.secondaryActionText}>Add better label</Text>
        </Pressable>
      </Reveal>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  backButton: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: Colors.light.line,
    backgroundColor: Colors.light.surface,
  },
  backButtonText: {
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
    gap: 8,
  },
  eyebrow: {
    color: Colors.light.accent,
    fontFamily: Fonts.body,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    color: Colors.light.text,
    fontFamily: Fonts.display,
    fontSize: 34,
    lineHeight: 38,
  },
  subtitle: {
    color: Colors.light.muted,
    fontFamily: Fonts.body,
    fontSize: 14,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 12,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radii.pill,
    fontFamily: Fonts.body,
    fontSize: 12,
    fontWeight: '700',
  },
  spamBadge: {
    backgroundColor: '#F6D5D0',
    color: Colors.light.danger,
  },
  safeBadge: {
    backgroundColor: '#DDEBDD',
    color: Colors.light.success,
  },
  score: {
    color: Colors.light.text,
    fontFamily: Fonts.mono,
    fontSize: 12,
  },
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
    fontSize: 18,
    fontWeight: '700',
  },
  body: {
    flex: 1,
    color: Colors.light.text,
    fontFamily: Fonts.body,
    fontSize: 14,
    lineHeight: 21,
  },
  list: {
    gap: 12,
  },
  listRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  marker: {
    width: 8,
    height: 8,
    marginTop: 6,
    borderRadius: Radii.pill,
    backgroundColor: Colors.light.accent,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryAction: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: Radii.pill,
    backgroundColor: Colors.light.accent,
  },
  primaryActionText: {
    color: '#FFF7EF',
    fontFamily: Fonts.body,
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryAction: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: Colors.light.line,
    backgroundColor: Colors.light.surface,
  },
  secondaryActionText: {
    color: Colors.light.text,
    fontFamily: Fonts.body,
    fontSize: 14,
    fontWeight: '700',
  },
  emptyState: {
    paddingTop: 60,
    gap: 10,
  },
});
