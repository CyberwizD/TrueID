import { Link, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Reveal } from '@/components/reveal';
import { ScreenShell } from '@/components/screen-shell';
import { Colors, Fonts, Radii } from '@/constants/theme';
import { callerDirectory } from '@/data/mock-data';
import { lookupCaller, type LookupResponse } from '@/lib/trueid-api';

export default function CallerDetailScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const requestedPhone = useMemo(() => decodeURIComponent(phone ?? ''), [phone]);
  const fallbackProfile =
    callerDirectory.find((item) => item.phoneNumber === requestedPhone) ??
    callerDirectory.find((item) => item.phoneNumber === phone) ??
    null;

  const [profile, setProfile] = useState<LookupResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      if (!requestedPhone) {
        return;
      }

      try {
        const payload = await lookupCaller(requestedPhone);
        if (isMounted) {
          setProfile(payload);
          setError(null);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : 'Failed to load caller.');
        }
      }
    }

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, [requestedPhone]);

  const effectiveProfile = profile ?? (fallbackProfile ? mapFallbackCaller(fallbackProfile) : null);

  if (!effectiveProfile) {
    return (
      <ScreenShell>
        <Reveal delay={60} style={styles.emptyState}>
          <Text style={styles.title}>Caller not found</Text>
          <Text style={styles.subtitle}>No live caller record was returned for this number.</Text>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
        <Text style={styles.eyebrow}>{effectiveProfile.match_strategy.replace('_', ' ')}</Text>
        <Text style={styles.title}>{effectiveProfile.name}</Text>
        <Text style={styles.subtitle}>{effectiveProfile.phone_number}</Text>
        <Text style={styles.subtitle}>{effectiveProfile.location}</Text>
        <View style={styles.metaRow}>
          <Text style={[styles.badge, effectiveProfile.spam ? styles.spamBadge : styles.safeBadge]}>
            {effectiveProfile.spam ? 'Spam risk' : 'Low risk'}
          </Text>
          <Text style={styles.score}>{effectiveProfile.confidence}% confidence</Text>
        </View>
      </Reveal>

      <Reveal delay={120} style={styles.panel}>
        <Text style={styles.panelTitle}>Why this identity appears</Text>
        <Text style={styles.body}>
          {effectiveProfile.verified
            ? 'This number resolved through a verified profile.'
            : 'This number resolved through a known profile or crowdsourced consensus.'}
        </Text>
        <View style={styles.list}>
          {effectiveProfile.sources.map((item) => (
            <View key={`${item.source}-${item.label}`} style={styles.listRow}>
              <View style={styles.marker} />
              <Text style={styles.body}>
                {item.label} · weight {item.weight}
              </Text>
            </View>
          ))}
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
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

function mapFallbackCaller(caller: (typeof callerDirectory)[number]): LookupResponse {
  return {
    phone_number: caller.phoneNumber,
    name: caller.name,
    location: caller.location,
    spam: caller.spam,
    confidence: caller.confidence,
    spam_score: caller.spamScore,
    caller_type:
      caller.callerType === 'Business'
        ? 'business'
        : caller.callerType === 'Personal'
          ? 'individual'
          : 'unknown',
    verified: caller.verified,
    match_strategy: caller.matchStrategy,
    sources: caller.sources.map((label) => ({
      source: 'profile' as const,
      weight: 20,
      label,
    })),
  };
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
  errorText: {
    color: Colors.light.danger,
    fontFamily: Fonts.body,
    fontSize: 13,
    lineHeight: 18,
  },
});
