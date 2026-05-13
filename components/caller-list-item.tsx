import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Fonts, Radii } from '@/constants/theme';
import type { CallerProfile } from '@/data/mock-data';

type CallerListItemProps = {
  caller: CallerProfile;
};

export function CallerListItem({ caller }: CallerListItemProps) {
  return (
    <Link
      href={{ pathname: '/caller/[phone]', params: { phone: caller.phoneNumber } }}
      asChild>
      <Pressable style={styles.row}>
        <View style={styles.identity}>
          <Text style={styles.name}>{caller.name}</Text>
          <Text style={styles.meta}>
            {caller.location} · {caller.callerType}
          </Text>
        </View>
        <View style={styles.statusBlock}>
          <Text style={[styles.badge, caller.spam ? styles.spam : styles.safe]}>
            {caller.spam ? 'Spam' : 'Trusted'}
          </Text>
          <Text style={styles.confidence}>{caller.confidence}%</Text>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.light.line,
    backgroundColor: Colors.light.surface,
    gap: 12,
  },
  identity: {
    flex: 1,
    gap: 4,
  },
  name: {
    color: Colors.light.text,
    fontFamily: Fonts.body,
    fontSize: 17,
    fontWeight: '600',
  },
  meta: {
    color: Colors.light.muted,
    fontFamily: Fonts.body,
    fontSize: 13,
  },
  statusBlock: {
    alignItems: 'flex-end',
    gap: 8,
  },
  badge: {
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radii.pill,
    fontFamily: Fonts.body,
    fontSize: 12,
    fontWeight: '700',
  },
  spam: {
    backgroundColor: '#F6D5D0',
    color: Colors.light.danger,
  },
  safe: {
    backgroundColor: '#DDEBDD',
    color: Colors.light.success,
  },
  confidence: {
    color: Colors.light.text,
    fontFamily: Fonts.mono,
    fontSize: 12,
  },
});
