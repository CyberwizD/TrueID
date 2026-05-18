import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Reveal } from '@/components/reveal';
import { ScreenShell } from '@/components/screen-shell';
import { SectionHeading } from '@/components/section-heading';
import { useTrueId } from '@/components/trueid-provider';
import { Colors, Fonts, Radii } from '@/constants/theme';
import { lookupCaller, reportSpam, type LookupResponse, type SpamReason } from '@/lib/trueid-api';
import { previewNativeOverlay, syncNativeApiBaseUrl } from '@/lib/trueid-telecom';

const SPAM_REASONS: Array<{ label: string; value: SpamReason }> = [
  { label: 'Scam', value: 'scam_fraud' },
  { label: 'Telemarketing', value: 'telemarketing' },
  { label: 'Harassment', value: 'harassment' },
  { label: 'Loan spam', value: 'loan_spam' },
];

export default function LookupScreen() {
  const { registerLookup } = useTrueId();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<LookupResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [reporting, setReporting] = useState<SpamReason | null>(null);

  async function handleLookup() {
    if (!query.trim()) {
      setError('Enter a phone number.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await syncNativeApiBaseUrl();
      const payload = await lookupCaller(query);
      setResult(payload);
      await registerLookup(payload);
    } catch (lookupError) {
      setResult(null);
      setError(lookupError instanceof Error ? lookupError.message : 'Lookup failed.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSpamReport(reason: SpamReason) {
    if (!result) {
      return;
    }

    setReporting(reason);
    setError(null);
    try {
      await reportSpam(result.phone_number, reason);
    } catch (reportError) {
      setError(reportError instanceof Error ? reportError.message : 'Report failed.');
    } finally {
      setReporting(null);
    }
  }

  return (
    <ScreenShell>
      <Reveal delay={50}>
        <SectionHeading
          eyebrow="Live search"
          title="Search any number."
          detail="One focused action. Type a number, get the identity, and flag it if it looks unsafe."
        />
      </Reveal>

      <Reveal delay={100} style={styles.searchPanel}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          keyboardType="phone-pad"
          placeholder="Enter phone number"
          placeholderTextColor={Colors.light.muted}
          style={styles.input}
        />
        <Pressable style={[styles.primaryButton, loading && styles.dimmed]} onPress={handleLookup} disabled={loading}>
          <Text style={styles.primaryButtonText}>{loading ? 'Checking...' : 'Identify caller'}</Text>
        </Pressable>
      </Reveal>

      <Reveal delay={150} style={styles.resultPanel}>
        {result ? (
          <>
            <View style={styles.resultHeader}>
              <View style={styles.resultTextBlock}>
                <Text style={styles.resultName}>{result.name}</Text>
                <Text style={styles.resultMeta}>{result.phone_number}</Text>
                <Text style={styles.resultMeta}>{result.location}</Text>
              </View>
              <Text style={[styles.riskBadge, result.spam ? styles.riskHigh : styles.riskLow]}>
                {result.spam ? 'Spam risk' : 'Likely safe'}
              </Text>
            </View>

            <View style={styles.valueRow}>
              <Text style={styles.valueLabel}>Confidence</Text>
              <Text style={styles.valueText}>{result.confidence}%</Text>
            </View>

            <View style={styles.actionRow}>
              <Pressable style={styles.secondaryButton} onPress={() => void previewNativeOverlay(result)}>
                <Text style={styles.secondaryButtonText}>Preview overlay</Text>
              </Pressable>
            </View>

            <View style={styles.reasonRow}>
              {SPAM_REASONS.map((reason) => (
                <Pressable
                  key={reason.value}
                  style={[styles.reasonChip, reporting === reason.value && styles.dimmed]}
                  onPress={() => void handleSpamReport(reason.value)}
                  disabled={Boolean(reporting)}>
                  <Text style={styles.reasonChipText}>{reason.label}</Text>
                </Pressable>
              ))}
            </View>
          </>
        ) : (
          <>
            <Text style={styles.emptyTitle}>No result yet</Text>
            <Text style={styles.emptyCopy}>
              Search a number to see the caller name, location, and whether it already looks risky.
            </Text>
          </>
        )}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </Reveal>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  searchPanel: {
    gap: 14,
  },
  input: {
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.light.line,
    backgroundColor: Colors.light.surface,
    color: Colors.light.text,
    fontFamily: Fonts.body,
    fontSize: 17,
  },
  primaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: Radii.pill,
    backgroundColor: Colors.light.accent,
  },
  primaryButtonText: {
    color: '#0A0C10',
    fontFamily: Fonts.body,
    fontSize: 15,
    fontWeight: '800',
  },
  dimmed: {
    opacity: 0.7,
  },
  resultPanel: {
    padding: 20,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.light.line,
    backgroundColor: Colors.light.surface,
    gap: 16,
  },
  resultHeader: {
    gap: 12,
  },
  resultTextBlock: {
    gap: 6,
  },
  resultName: {
    color: Colors.light.text,
    fontFamily: Fonts.display,
    fontSize: 32,
    lineHeight: 36,
  },
  resultMeta: {
    color: Colors.light.muted,
    fontFamily: Fonts.body,
    fontSize: 14,
  },
  riskBadge: {
    alignSelf: 'flex-start',
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
  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.light.line,
  },
  valueLabel: {
    color: Colors.light.muted,
    fontFamily: Fonts.body,
    fontSize: 14,
  },
  valueText: {
    color: Colors.light.text,
    fontFamily: Fonts.body,
    fontSize: 15,
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
  },
  secondaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: Radii.pill,
    backgroundColor: Colors.light.surfaceMuted,
    borderWidth: 1,
    borderColor: Colors.light.line,
  },
  secondaryButtonText: {
    color: Colors.light.text,
    fontFamily: Fonts.body,
    fontSize: 13,
    fontWeight: '700',
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
  emptyTitle: {
    color: Colors.light.text,
    fontFamily: Fonts.display,
    fontSize: 26,
  },
  emptyCopy: {
    color: Colors.light.muted,
    fontFamily: Fonts.body,
    fontSize: 14,
    lineHeight: 21,
  },
  errorText: {
    color: Colors.light.danger,
    fontFamily: Fonts.body,
    fontSize: 13,
    lineHeight: 18,
  },
});
