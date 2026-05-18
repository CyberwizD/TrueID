import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Reveal } from '@/components/reveal';
import { ScreenShell } from '@/components/screen-shell';
import { SectionHeading } from '@/components/section-heading';
import { Colors, Fonts, Radii } from '@/constants/theme';
import { getConfiguredApiBaseUrl, lookupCaller, type LookupResponse } from '@/lib/trueid-api';
import { normalizePhoneNumber } from '@/lib/phone';
import { previewNativeOverlay, syncNativeApiBaseUrl } from '@/lib/trueid-telecom';

export default function LookupScreen() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<LookupResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const normalized = normalizePhoneNumber(query);

  async function handleLookup() {
    if (!query.trim()) {
      setError('Enter a phone number first.');
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await syncNativeApiBaseUrl();
      const payload = await lookupCaller(query);
      setResult(payload);
    } catch (lookupError) {
      setResult(null);
      setError(lookupError instanceof Error ? lookupError.message : 'Lookup failed.');
    } finally {
      setLoading(false);
    }
  }

  async function handlePreviewOverlay() {
    if (!result) {
      return;
    }
    await previewNativeOverlay(result);
  }

  return (
    <ScreenShell>
      <Reveal delay={60}>
        <SectionHeading
          eyebrow="Manual lookup"
          title="Search against the live backend."
          detail="This screen posts directly to your FastAPI lookup route and can preview the Android caller overlay from the same response."
        />
      </Reveal>

      <Reveal delay={120} style={styles.searchBlock}>
        <Text style={styles.inputLabel}>Phone number</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          keyboardType="phone-pad"
          placeholder="0803 000 1111"
          placeholderTextColor={Colors.light.muted}
          style={styles.input}
        />
        <View style={styles.searchFooter}>
          <Text style={styles.searchHint}>
            {normalized ? `Normalized as ${normalized}` : 'Nigeria-first normalization in E.164 format.'}
          </Text>
          <Pressable
            style={[styles.primaryAction, loading && styles.primaryActionDisabled]}
            onPress={handleLookup}
            disabled={loading}>
            <Text style={styles.primaryActionText}>{loading ? 'Looking up...' : 'Lookup'}</Text>
          </Pressable>
        </View>
        <Text style={styles.endpointHint}>Live base URL: {getConfiguredApiBaseUrl()}</Text>
      </Reveal>

      <Reveal delay={180} style={styles.resultPanel}>
        <Text style={styles.panelLabel}>Lookup result</Text>
        {result ? (
          <>
            <View style={styles.resultTop}>
              <View style={styles.resultColumn}>
                <Text style={styles.resultName}>{result.name}</Text>
                <Text style={styles.resultMeta}>{result.location}</Text>
                <Text style={styles.resultMeta}>{result.phone_number}</Text>
              </View>
              <Text style={styles.resultConfidence}>{result.confidence}%</Text>
            </View>
            <Text style={styles.resultBadge}>{result.spam ? 'High spam risk' : 'Low spam risk'}</Text>
            <Text style={styles.resultNote}>
              {result.verified
                ? 'This match came from a verified caller profile.'
                : 'This match was resolved from a known profile or crowdsourced contact consensus.'}
            </Text>
            <View style={styles.actionRow}>
              <Pressable style={styles.primaryAction} onPress={handlePreviewOverlay}>
                <Text style={styles.primaryActionText}>Preview Android overlay</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.resultName}>No live result yet</Text>
            <Text style={styles.resultNote}>
              Run a lookup to verify the backend response and preview the same payload the Android service will show during an incoming call.
            </Text>
          </>
        )}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </Reveal>

      <Reveal delay={240} style={styles.sourcesPanel}>
        <Text style={styles.sectionTitle}>What backs this result</Text>
        <View style={styles.sourcesList}>
          {(result?.sources ?? []).map((source) => (
            <View key={`${source.source}-${source.label}`} style={styles.sourceRow}>
              <View style={styles.sourceMarker} />
              <Text style={styles.sourceText}>
                {source.label} · weight {source.weight}
              </Text>
            </View>
          ))}
          {!result?.sources.length ? (
            <>
              <View style={styles.sourceRow}>
                <View style={styles.sourceMarker} />
                <Text style={styles.sourceText}>No profile or crowd consensus loaded yet.</Text>
              </View>
              <View style={styles.sourceRow}>
                <View style={styles.sourceMarker} />
                <Text style={styles.sourceText}>Once the API responds, these source signals come from FastAPI directly.</Text>
              </View>
            </>
          ) : null}
        </View>
      </Reveal>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  searchBlock: {
    padding: 20,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.light.line,
    backgroundColor: Colors.light.surface,
    gap: 16,
  },
  inputLabel: {
    color: Colors.light.accent,
    fontFamily: Fonts.body,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  input: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.light.line,
    backgroundColor: Colors.light.background,
    color: Colors.light.text,
    fontFamily: Fonts.mono,
    fontSize: 18,
  },
  searchFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  searchHint: {
    flex: 1,
    color: Colors.light.muted,
    fontFamily: Fonts.body,
    fontSize: 13,
    lineHeight: 18,
  },
  endpointHint: {
    color: Colors.light.muted,
    fontFamily: Fonts.mono,
    fontSize: 12,
  },
  primaryAction: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: Radii.pill,
    backgroundColor: Colors.light.accent,
  },
  primaryActionDisabled: {
    opacity: 0.65,
  },
  primaryActionText: {
    color: '#FFF7EF',
    fontFamily: Fonts.body,
    fontSize: 13,
    fontWeight: '700',
  },
  resultPanel: {
    padding: 20,
    borderRadius: Radii.lg,
    backgroundColor: Colors.light.surfaceMuted,
    borderWidth: 1,
    borderColor: Colors.light.line,
    gap: 12,
  },
  panelLabel: {
    color: Colors.light.accent,
    fontFamily: Fonts.body,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  resultTop: {
    flexDirection: 'row',
    gap: 12,
  },
  resultColumn: {
    flex: 1,
    gap: 6,
  },
  resultName: {
    color: Colors.light.text,
    fontFamily: Fonts.display,
    fontSize: 30,
    lineHeight: 34,
  },
  resultMeta: {
    color: Colors.light.muted,
    fontFamily: Fonts.body,
    fontSize: 14,
  },
  resultConfidence: {
    color: Colors.light.accent,
    fontFamily: Fonts.display,
    fontSize: 32,
  },
  resultBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radii.pill,
    backgroundColor: '#F7E8D9',
    color: Colors.light.text,
    fontFamily: Fonts.body,
    fontSize: 12,
    fontWeight: '700',
  },
  resultNote: {
    color: Colors.light.text,
    fontFamily: Fonts.body,
    fontSize: 14,
    lineHeight: 21,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  errorText: {
    color: Colors.light.danger,
    fontFamily: Fonts.body,
    fontSize: 13,
    lineHeight: 18,
  },
  sourcesPanel: {
    padding: 20,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.light.line,
    backgroundColor: Colors.light.surface,
    gap: 14,
  },
  sectionTitle: {
    color: Colors.light.text,
    fontFamily: Fonts.body,
    fontSize: 19,
    fontWeight: '700',
  },
  sourcesList: {
    gap: 12,
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  sourceMarker: {
    width: 8,
    height: 8,
    marginTop: 6,
    borderRadius: Radii.pill,
    backgroundColor: Colors.light.accent,
  },
  sourceText: {
    flex: 1,
    color: Colors.light.text,
    fontFamily: Fonts.body,
    fontSize: 14,
    lineHeight: 20,
  },
});
