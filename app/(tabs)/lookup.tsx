import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Reveal } from '@/components/reveal';
import { ScreenShell } from '@/components/screen-shell';
import { SectionHeading } from '@/components/section-heading';
import { Colors, Fonts, Radii } from '@/constants/theme';
import { callerDirectory } from '@/data/mock-data';
import { normalizePhoneNumber } from '@/lib/phone';

export default function LookupScreen() {
  const [query, setQuery] = useState('');
  const normalized = normalizePhoneNumber(query);
  const result = callerDirectory.find((item) => item.phoneNumber === normalized);

  return (
    <ScreenShell>
      <Reveal delay={60}>
        <SectionHeading
          eyebrow="Manual lookup"
          title="Search before the next ring."
          detail="Use the same backend contract as the Android overlay, but in a screen that supports deliberate checking and reporting."
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
          <Pressable style={styles.primaryAction}>
            <Text style={styles.primaryActionText}>Lookup</Text>
          </Pressable>
        </View>
      </Reveal>

      <Reveal delay={180} style={styles.resultPanel}>
        <Text style={styles.panelLabel}>Lookup result</Text>
        {result ? (
          <>
            <View style={styles.resultTop}>
              <View style={{ flex: 1, gap: 6 }}>
                <Text style={styles.resultName}>{result.name}</Text>
                <Text style={styles.resultMeta}>{result.location}</Text>
                <Text style={styles.resultMeta}>{result.phoneNumber}</Text>
              </View>
              <Text style={styles.resultConfidence}>{result.confidence}%</Text>
            </View>
            <Text style={styles.resultBadge}>{result.spam ? 'High spam risk' : 'Low spam risk'}</Text>
            <Text style={styles.resultNote}>{result.notes}</Text>
          </>
        ) : (
          <>
            <Text style={styles.resultName}>Unknown caller</Text>
            <Text style={styles.resultNote}>
              No confident match yet. After the call, the user can report spam or contribute a safer label.
            </Text>
          </>
        )}
      </Reveal>

      <Reveal delay={240} style={styles.sourcesPanel}>
        <Text style={styles.sectionTitle}>What backs this result</Text>
        <View style={styles.sourcesList}>
          {(result?.sources ?? [
            'No curated profile found',
            'No crowd consensus found',
            'Regional hint defaults to country until evidence improves',
          ]).map((source) => (
            <View key={source} style={styles.sourceRow}>
              <View style={styles.sourceMarker} />
              <Text style={styles.sourceText}>{source}</Text>
            </View>
          ))}
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
  primaryAction: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: Radii.pill,
    backgroundColor: Colors.light.accent,
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
