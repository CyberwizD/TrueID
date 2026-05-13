import { StyleSheet, Text, View } from 'react-native';

import { CallerListItem } from '@/components/caller-list-item';
import { Reveal } from '@/components/reveal';
import { ScreenShell } from '@/components/screen-shell';
import { SectionHeading } from '@/components/section-heading';
import { Colors, Fonts, Radii } from '@/constants/theme';
import { recentLookups, spamReasons } from '@/data/mock-data';

export default function IntelScreen() {
  const hotNumbers = recentLookups.filter((item) => item.spam);

  return (
    <ScreenShell>
      <Reveal delay={60}>
        <SectionHeading
          eyebrow="Community intel"
          title="Spot patterns before they scale."
          detail="This view turns reports and contact contributions into a moderation surface for launch operations."
        />
      </Reveal>

      <Reveal delay={120} style={styles.banner}>
        <View style={styles.bannerColumn}>
          <Text style={styles.bannerValue}>72</Text>
          <Text style={styles.bannerLabel}>highest active spam score</Text>
        </View>
        <View style={styles.bannerColumn}>
          <Text style={styles.bannerValue}>4</Text>
          <Text style={styles.bannerLabel}>report reasons in the MVP</Text>
        </View>
      </Reveal>

      <Reveal delay={180} style={styles.panel}>
        <Text style={styles.panelTitle}>Numbers needing attention</Text>
        <View style={styles.list}>
          {hotNumbers.map((caller) => (
            <CallerListItem key={caller.phoneNumber} caller={caller} />
          ))}
        </View>
      </Reveal>

      <Reveal delay={240} style={styles.panel}>
        <Text style={styles.panelTitle}>Spam report language</Text>
        <View style={styles.list}>
          {spamReasons.map((reason) => (
            <View key={reason.title} style={styles.reasonRow}>
              <Text style={styles.reasonTitle}>{reason.title}</Text>
              <Text style={styles.reasonDetail}>{reason.detail}</Text>
            </View>
          ))}
        </View>
      </Reveal>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    gap: 12,
  },
  bannerColumn: {
    flex: 1,
    padding: 20,
    borderRadius: Radii.md,
    backgroundColor: Colors.light.surfaceMuted,
    borderWidth: 1,
    borderColor: Colors.light.line,
    gap: 8,
  },
  bannerValue: {
    color: Colors.light.text,
    fontFamily: Fonts.display,
    fontSize: 34,
  },
  bannerLabel: {
    color: Colors.light.muted,
    fontFamily: Fonts.body,
    fontSize: 13,
    lineHeight: 18,
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
    fontSize: 19,
    fontWeight: '700',
  },
  list: {
    gap: 12,
  },
  reasonRow: {
    gap: 4,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.line,
  },
  reasonTitle: {
    color: Colors.light.text,
    fontFamily: Fonts.body,
    fontSize: 15,
    fontWeight: '700',
  },
  reasonDetail: {
    color: Colors.light.muted,
    fontFamily: Fonts.body,
    fontSize: 14,
    lineHeight: 20,
  },
});
