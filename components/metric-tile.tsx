import { StyleSheet, Text, View } from 'react-native';

import { Colors, Fonts, Radii } from '@/constants/theme';

type MetricTileProps = {
  label: string;
  value: string;
};

export function MetricTile({ label, value }: MetricTileProps) {
  return (
    <View style={styles.tile}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    minHeight: 94,
    padding: 18,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.light.line,
    backgroundColor: Colors.light.surface,
    gap: 8,
  },
  value: {
    color: Colors.light.text,
    fontFamily: Fonts.display,
    fontSize: 28,
    lineHeight: 32,
  },
  label: {
    color: Colors.light.muted,
    fontFamily: Fonts.body,
    fontSize: 13,
    lineHeight: 18,
  },
});
