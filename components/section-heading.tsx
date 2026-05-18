import { Platform, StyleSheet, Text, View } from 'react-native';

import { Colors, Fonts } from '@/constants/theme';

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  detail?: string;
};

export function SectionHeading({ eyebrow, title, detail }: SectionHeadingProps) {
  return (
    <View style={styles.wrapper}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.title}>{title}</Text>
      {detail ? <Text style={styles.detail}>{detail}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  eyebrow: {
    color: Colors.light.accent,
    fontFamily: Fonts.body,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  title: {
    color: Colors.light.text,
    fontFamily: Fonts.display,
    fontSize: 35,
    lineHeight: Platform.OS === 'android' ? 50 : 46,
    paddingTop: Platform.OS === 'android' ? 3 : 20,
  },
  detail: {
    color: Colors.light.muted,
    fontFamily: Fonts.body,
    fontSize: 16,
    lineHeight: 24,
  },
});
