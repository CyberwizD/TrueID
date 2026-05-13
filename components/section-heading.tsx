import { StyleSheet, Text, View } from 'react-native';

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
    gap: 4,
  },
  eyebrow: {
    color: Colors.light.accent,
    fontFamily: Fonts.body,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.3,
    textTransform: 'uppercase',
  },
  title: {
    color: Colors.light.text,
    fontFamily: Fonts.display,
    fontSize: 30,
    lineHeight: 35,
  },
  detail: {
    color: Colors.light.muted,
    fontFamily: Fonts.body,
    fontSize: 15,
    lineHeight: 22,
  },
});
