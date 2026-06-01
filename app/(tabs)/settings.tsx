import { useEffect, useState } from 'react';
import { AppState, Pressable, StyleSheet, Text, View } from 'react-native';

import { Reveal } from '@/components/reveal';
import { ScreenShell } from '@/components/screen-shell';
import { SectionHeading } from '@/components/section-heading';
import { Colors, Fonts, Radii } from '@/constants/theme';
import { fetchApiHealth } from '@/lib/trueid-api';
import { getNativeTelecomStatus, openCallScreeningRoleRequest, type NativeTelecomStatus } from '@/lib/trueid-telecom';

export default function SettingsScreen() {
  const [nativeStatus, setNativeStatus] = useState<NativeTelecomStatus | null>(null);
  const [backendStatus, setBackendStatus] = useState<'online' | 'offline'>('offline');
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setError(null);
    try {
      const [telecomStatus, health] = await Promise.all([
        getNativeTelecomStatus().catch(() => null),
        fetchApiHealth().catch(() => null),
      ]);
      setNativeStatus(telecomStatus);
      setBackendStatus(health?.status === 'ok' ? 'online' : 'offline');
    } catch (refreshError) {
      setError(refreshError instanceof Error ? refreshError.message : 'Could not refresh app status.');
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        void refresh();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  async function enableRole() {
    try {
      await openCallScreeningRoleRequest();
      await refresh();
    } catch (roleError) {
      setError(roleError instanceof Error ? roleError.message : 'Role request failed.');
    }
  }

  return (
    <ScreenShell>
      <Reveal delay={50}>
        <SectionHeading
          eyebrow=""
          title="Keep the app ready."
          detail="This is the only place where operational details belong. The main flow stays clean."
        />
      </Reveal>

      <Reveal delay={100} style={styles.panel}>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Cloud backend</Text>
          <Text style={[styles.statusValue, backendStatus === 'online' ? styles.online : styles.offline]}>
            {backendStatus}
          </Text>
        </View>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Caller ID role</Text>
          <Text style={[styles.statusValue, nativeStatus?.callScreeningRoleHeld ? styles.online : styles.pending]}>
            {nativeStatus?.callScreeningRoleHeld ? 'enabled' : 'not enabled'}
          </Text>
        </View>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Role support</Text>
          <Text
            style={[
              styles.statusValue,
              nativeStatus?.callScreeningRoleAvailable ? styles.online : styles.offline,
            ]}>
            {nativeStatus?.callScreeningRoleAvailable ? 'available' : 'unavailable'}
          </Text>
        </View>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Android SDK</Text>
          <Text style={styles.statusValue}>{nativeStatus?.sdkInt ?? 'unknown'}</Text>
        </View>
        <Pressable style={styles.primaryButton} onPress={() => void enableRole()}>
          <Text style={styles.primaryButtonText}>Enable caller ID on Android</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={() => void refresh()}>
          <Text style={styles.secondaryButtonText}>Refresh status</Text>
        </Pressable>
      </Reveal>

      <Reveal delay={150} style={styles.panel}>
        <Text style={styles.panelTitle}>Privacy</Text>
        <Text style={styles.copy}>TrueID shows names, spam risk, and broad location only.</Text>
        <Text style={styles.copy}>It does not require a user account before you can use the app.</Text>
        <Text style={styles.copy}>Contact sync is optional and only happens after you approve it.</Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </Reveal>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  panel: {
    padding: 22,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.light.line,
    backgroundColor: Colors.light.surface,
    gap: 14,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.line,
  },
  statusLabel: {
    color: Colors.light.muted,
    fontFamily: Fonts.body,
    fontSize: 14,
  },
  statusValue: {
    fontFamily: Fonts.body,
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  online: {
    color: Colors.light.success,
  },
  offline: {
    color: Colors.light.danger,
  },
  pending: {
    color: Colors.light.accent,
  },
  primaryButton: {
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: Radii.pill,
    backgroundColor: Colors.light.accent,
  },
  primaryButtonText: {
    color: '#0A0C10',
    fontFamily: Fonts.body,
    fontSize: 14,
    fontWeight: '800',
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: Colors.light.line,
    backgroundColor: Colors.light.surfaceMuted,
  },
  secondaryButtonText: {
    color: Colors.light.text,
    fontFamily: Fonts.body,
    fontSize: 14,
    fontWeight: '700',
  },
  panelTitle: {
    color: Colors.light.text,
    fontFamily: Fonts.body,
    fontSize: 18,
    fontWeight: '700',
  },
  copy: {
    color: Colors.light.muted,
    fontFamily: Fonts.body,
    fontSize: 14,
    lineHeight: 21,
  },
  errorText: {
    color: Colors.light.danger,
    fontFamily: Fonts.body,
    fontSize: 13,
  },
});
