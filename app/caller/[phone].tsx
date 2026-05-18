import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Reveal } from '@/components/reveal';
import { ScreenShell } from '@/components/screen-shell';
import { Colors, Fonts, Radii } from '@/constants/theme';
import { lookupCaller, reportSpam, type LookupResponse, type SpamReason } from '@/lib/trueid-api';

const QUICK_REASONS: { label: string; value: SpamReason }[] = [
  { label: 'Scam', value: 'scam_fraud' },
  { label: 'Telemarketing', value: 'telemarketing' },
  { label: 'Loan spam', value: 'loan_spam' },
];

export default function CallerDetailScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const requestedPhone = useMemo(() => decodeURIComponent(phone ?? ''), [phone]);
  const [profile, setProfile] = useState<LookupResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reporting, setReporting] = useState<SpamReason | null>(null);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const payload = await lookupCaller(requestedPhone);
        if (active) {
          setProfile(payload);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Failed to load caller.');
        }
      }
    }

    if (requestedPhone) {
      void loadProfile();
    }

    return () => {
      active = false;
    };
  }, [requestedPhone]);

  async function quickReport(reason: SpamReason) {
    if (!profile) {
      return;
    }

    setReporting(reason);
    setError(null);
    try {
      await reportSpam(profile.phone_number, reason);
    } catch (reportError) {
      setError(reportError instanceof Error ? reportError.message : 'Could not report this number.');
    } finally {
      setReporting(null);
    }
  }

  return (
    <ScreenShell
      header={
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
        </View>
      }>
      {profile ? (
        <>
          <Reveal delay={40} style={styles.hero}>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.meta}>{profile.phone_number}</Text>
            <Text style={styles.meta}>{profile.location}</Text>
            <Text style={[styles.badge, profile.spam ? styles.riskHigh : styles.riskLow]}>
              {profile.spam ? 'Spam risk' : 'Likely safe'}
            </Text>
          </Reveal>

          <Reveal delay={100} style={styles.panel}>
            <Text style={styles.panelTitle}>Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Confidence</Text>
              <Text style={styles.detailValue}>{profile.confidence}%</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Type</Text>
              <Text style={styles.detailValue}>{profile.caller_type}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status</Text>
              <Text style={styles.detailValue}>{profile.verified ? 'Verified' : 'Unverified'}</Text>
            </View>
          </Reveal>

          <Reveal delay={150} style={styles.panel}>
            <Text style={styles.panelTitle}>Report this number</Text>
            <View style={styles.reasonRow}>
              {QUICK_REASONS.map((reason) => (
                <Pressable
                  key={reason.value}
                  style={[styles.reasonChip, reporting === reason.value && styles.dimmed]}
                  onPress={() => void quickReport(reason.value)}
                  disabled={Boolean(reporting)}>
                  <Text style={styles.reasonChipText}>{reason.label}</Text>
                </Pressable>
              ))}
            </View>
          </Reveal>
        </>
      ) : (
        <Reveal delay={40} style={styles.panel}>
          <Text style={styles.panelTitle}>Loading caller</Text>
          <Text style={styles.meta}>{error ?? 'Fetching live caller information.'}</Text>
        </Reveal>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: Colors.light.line,
    backgroundColor: Colors.light.surfaceMuted,
  },
  backButtonText: {
    color: Colors.light.text,
    fontFamily: Fonts.body,
    fontSize: 13,
    fontWeight: '700',
  },
  hero: {
    padding: 24,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.light.line,
    backgroundColor: Colors.light.surface,
    gap: 8,
  },
  name: {
    color: Colors.light.text,
    fontFamily: Fonts.display,
    fontSize: 34,
    lineHeight: 38,
  },
  meta: {
    color: Colors.light.muted,
    fontFamily: Fonts.body,
    fontSize: 14,
  },
  badge: {
    alignSelf: 'flex-start',
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radii.pill,
    fontFamily: Fonts.body,
    fontSize: 12,
    fontWeight: '800',
  },
  riskHigh: {
    backgroundColor: 'rgba(243, 107, 107, 0.16)',
    color: Colors.light.danger,
  },
  riskLow: {
    backgroundColor: 'rgba(66, 192, 138, 0.16)',
    color: Colors.light.success,
  },
  panel: {
    padding: 22,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.light.line,
    backgroundColor: Colors.light.surface,
    gap: 14,
  },
  panelTitle: {
    color: Colors.light.text,
    fontFamily: Fonts.body,
    fontSize: 18,
    fontWeight: '700',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.line,
  },
  detailLabel: {
    color: Colors.light.muted,
    fontFamily: Fonts.body,
    fontSize: 14,
  },
  detailValue: {
    color: Colors.light.text,
    fontFamily: Fonts.body,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  reasonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  reasonChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: Colors.light.line,
    backgroundColor: Colors.light.surfaceMuted,
  },
  reasonChipText: {
    color: Colors.light.text,
    fontFamily: Fonts.body,
    fontSize: 12,
    fontWeight: '700',
  },
  dimmed: {
    opacity: 0.7,
  },
});
