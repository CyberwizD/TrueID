import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Reveal } from '@/components/reveal';
import { ScreenShell } from '@/components/screen-shell';
import { SectionHeading } from '@/components/section-heading';
import { useTrueId } from '@/components/trueid-provider';
import { Colors, Fonts, Radii } from '@/constants/theme';
import { fetchApiHealth } from '@/lib/trueid-api';
import { getNativeTelecomStatus, type NativeTelecomStatus } from '@/lib/trueid-telecom';

export default function HomeScreen() {
  const { recentLookups, syncSnapshot } = useTrueId();
  const [nativeStatus, setNativeStatus] = useState<NativeTelecomStatus | null>(null);
  const [backendHealthy, setBackendHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;

    async function loadStatus() {
      const [telecomStatus, health] = await Promise.all([
        getNativeTelecomStatus().catch(() => null),
        fetchApiHealth().catch(() => null),
      ]);

      if (!active) {
        return;
      }

      setNativeStatus(telecomStatus);
      setBackendHealthy(Boolean(health?.status === 'ok'));
    }

    void loadStatus();
    return () => {
      active = false;
    };
  }, []);

  const latestLookup = recentLookups[0];

  return (
    <ScreenShell
      header={
        <View style={styles.headerRow}>
          <Text style={styles.brand}>TrueID</Text>
          <Link href="/modal" asChild>
            <Pressable style={styles.ghostButton}>
              <Text style={styles.ghostButtonText}>Privacy</Text>
            </Pressable>
          </Link>
        </View>
      }>
      <Reveal delay={40}>
        <SectionHeading
          eyebrow="Caller protection"
          title="Know the call before you answer."
          detail="Search numbers, enable caller ID, and sync contacts only when you choose."
        />
      </Reveal>

      <Reveal delay={90} style={styles.hero}>
        <Text style={styles.heroTitle}>Protection is {nativeStatus?.callScreeningRoleHeld ? 'active' : 'waiting'}.</Text>
        <Text style={styles.heroCopy}>
          {nativeStatus?.callScreeningRoleHeld
            ? 'Incoming Android calls can surface identity in a TrueID overlay.'
            : 'Grant the Android caller ID role once, then TrueID can identify incoming numbers on device.'}
        </Text>
        <View style={styles.statusRow}>
          <View style={styles.statusPill}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: backendHealthy ? Colors.light.success : Colors.light.danger },
              ]}
            />
            <Text style={styles.statusPillText}>{backendHealthy ? 'Backend online' : 'Backend check pending'}</Text>
          </View>
          <View style={styles.statusPill}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: nativeStatus?.callScreeningRoleHeld
                    ? Colors.light.success
                    : Colors.light.accent,
                },
              ]}
            />
            <Text style={styles.statusPillText}>
              {nativeStatus?.callScreeningRoleHeld ? 'Caller ID enabled' : 'Caller ID not enabled'}
            </Text>
          </View>
        </View>
      </Reveal>

      <Reveal delay={140} style={styles.actionGrid}>
        <Link href="./lookup" asChild>
          <Pressable style={styles.actionCard}>
            <Text style={styles.actionTitle}>Search a number</Text>
            <Text style={styles.actionText}>Run a live lookup and see the same identity that the call overlay uses.</Text>
          </Pressable>
        </Link>
        <Link href="./sync" asChild>
          <Pressable style={styles.actionCard}>
            <Text style={styles.actionTitle}>Sync contacts</Text>
            <Text style={styles.actionText}>
              {syncSnapshot.contactCount > 0
                ? `${syncSnapshot.contactCount} contact numbers were approved for contribution.`
                : 'Approve contact access only when you are ready to contribute names.'}
            </Text>
          </Pressable>
        </Link>
      </Reveal>

      {latestLookup ? (
        <Reveal delay={190} style={styles.lookupPanel}>
          <Text style={styles.panelLabel}>Last identification</Text>
          <Link href={{ pathname: '/caller/[phone]', params: { phone: latestLookup.phone_number } }} asChild>
            <Pressable style={styles.lookupCard}>
              <View style={styles.lookupColumn}>
                <Text style={styles.lookupName}>{latestLookup.name}</Text>
                <Text style={styles.lookupMeta}>{latestLookup.phone_number}</Text>
                <Text style={styles.lookupMeta}>{latestLookup.location}</Text>
              </View>
              <Text style={[styles.lookupBadge, latestLookup.spam ? styles.spam : styles.safe]}>
                {latestLookup.spam ? 'Spam' : 'Clean'}
              </Text>
            </Pressable>
          </Link>
        </Reveal>
      ) : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    color: Colors.light.text,
    fontFamily: Fonts.display,
    fontSize: 26,
  },
  ghostButton: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: Colors.light.line,
    backgroundColor: Colors.light.surfaceMuted,
  },
  ghostButtonText: {
    color: Colors.light.text,
    fontFamily: Fonts.body,
    fontSize: 13,
    fontWeight: '600',
  },
  hero: {
    padding: 24,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.light.line,
    backgroundColor: Colors.light.surface,
    gap: 16,
  },
  heroTitle: {
    color: Colors.light.text,
    fontFamily: Fonts.display,
    fontSize: 34,
    lineHeight: 38,
  },
  heroCopy: {
    color: Colors.light.muted,
    fontFamily: Fonts.body,
    fontSize: 15,
    lineHeight: 22,
  },
  statusRow: {
    gap: 10,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Radii.pill,
    backgroundColor: Colors.light.surfaceMuted,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 8,
  },
  statusPillText: {
    color: Colors.light.text,
    fontFamily: Fonts.body,
    fontSize: 13,
    fontWeight: '700',
  },
  actionGrid: {
    gap: 14,
  },
  actionCard: {
    padding: 20,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.light.line,
    backgroundColor: Colors.light.surfaceMuted,
    gap: 8,
  },
  actionTitle: {
    color: Colors.light.text,
    fontFamily: Fonts.body,
    fontSize: 18,
    fontWeight: '700',
  },
  actionText: {
    color: Colors.light.muted,
    fontFamily: Fonts.body,
    fontSize: 14,
    lineHeight: 20,
  },
  lookupPanel: {
    gap: 12,
  },
  panelLabel: {
    color: Colors.light.accent,
    fontFamily: Fonts.body,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  lookupCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 14,
    padding: 18,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.light.line,
    backgroundColor: Colors.light.surface,
  },
  lookupColumn: {
    flex: 1,
    gap: 4,
  },
  lookupName: {
    color: Colors.light.text,
    fontFamily: Fonts.body,
    fontSize: 18,
    fontWeight: '700',
  },
  lookupMeta: {
    color: Colors.light.muted,
    fontFamily: Fonts.body,
    fontSize: 13,
  },
  lookupBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radii.pill,
    fontFamily: Fonts.body,
    fontSize: 12,
    fontWeight: '700',
  },
  spam: {
    backgroundColor: 'rgba(243, 107, 107, 0.16)',
    color: Colors.light.danger,
  },
  safe: {
    backgroundColor: 'rgba(66, 192, 138, 0.16)',
    color: Colors.light.success,
  },
});
