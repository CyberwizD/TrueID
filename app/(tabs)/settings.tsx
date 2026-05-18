import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Reveal } from '@/components/reveal';
import { ScreenShell } from '@/components/screen-shell';
import { SectionHeading } from '@/components/section-heading';
import { Colors, Fonts, Radii } from '@/constants/theme';
import { privacyControls } from '@/data/mock-data';
import { fetchApiHealth, getConfiguredApiBaseUrl, type HealthResponse } from '@/lib/trueid-api';
import {
  getNativeTelecomStatus,
  openCallScreeningRoleRequest,
  syncNativeApiBaseUrl,
  type NativeTelecomStatus,
} from '@/lib/trueid-telecom';

export default function SettingsScreen() {
  const [status, setStatus] = useState<NativeTelecomStatus | null>(null);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refreshState() {
    setError(null);
    try {
      await syncNativeApiBaseUrl();
      const [nativeStatus, apiHealth] = await Promise.all([
        getNativeTelecomStatus(),
        fetchApiHealth().catch(() => null),
      ]);
      setStatus(nativeStatus);
      setHealth(apiHealth);
    } catch (refreshError) {
      setError(refreshError instanceof Error ? refreshError.message : 'Could not refresh settings.');
    }
  }

  useEffect(() => {
    void refreshState();
  }, []);

  async function handleRoleRequest() {
    try {
      await openCallScreeningRoleRequest();
      await refreshState();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Role request failed.');
    }
  }

  return (
    <ScreenShell>
      <Reveal delay={60}>
        <SectionHeading
          eyebrow="Product controls"
          title="Wire the app to the real caller-ID path."
          detail="This screen now reflects the live backend URL and the Android call-screening role needed for incoming caller identification."
        />
      </Reveal>

      <Reveal delay={120} style={styles.panel}>
        <Text style={styles.panelTitle}>Backend and native status</Text>
        <View style={styles.stack}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>FastAPI base URL</Text>
            <Text style={styles.rowValue}>{getConfiguredApiBaseUrl()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Backend health</Text>
            <Text style={styles.rowValue}>{health ? `${health.status} · ${health.backend}` : 'Unavailable'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Native caller ID module</Text>
            <Text style={styles.rowValue}>{status?.nativeAvailable ? 'Available' : 'Unavailable'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Call screening role</Text>
            <Text style={styles.rowValue}>{status?.callScreeningRoleHeld ? 'Granted' : 'Pending'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Configured in native layer</Text>
            <Text style={styles.rowValue}>{status?.backendConfigured ? 'Yes' : 'No'}</Text>
          </View>
        </View>
        <View style={styles.buttonRow}>
          <Pressable style={styles.primaryAction} onPress={handleRoleRequest}>
            <Text style={styles.primaryActionText}>Enable caller ID role</Text>
          </Pressable>
          <Pressable style={styles.secondaryAction} onPress={refreshState}>
            <Text style={styles.secondaryActionText}>Refresh</Text>
          </Pressable>
        </View>
        <Text style={styles.helperText}>
          Use a development build on Android 10+ for the native caller identification flow. Expo Go does not expose these telecom APIs.
        </Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </Reveal>

      <Reveal delay={180} style={styles.panel}>
        <Text style={styles.panelTitle}>Privacy guardrails</Text>
        <View style={styles.stack}>
          {privacyControls.map((item) => (
            <View key={item} style={styles.guardrail}>
              <View style={styles.guardrailBar} />
              <Text style={styles.guardrailText}>{item}</Text>
            </View>
          ))}
        </View>
      </Reveal>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
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
  stack: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.line,
  },
  rowLabel: {
    flex: 1,
    color: Colors.light.muted,
    fontFamily: Fonts.body,
    fontSize: 14,
  },
  rowValue: {
    flex: 1,
    color: Colors.light.text,
    fontFamily: Fonts.body,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'right',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryAction: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: Radii.pill,
    backgroundColor: Colors.light.accent,
  },
  primaryActionText: {
    color: '#FFF7EF',
    fontFamily: Fonts.body,
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryAction: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: Colors.light.line,
    backgroundColor: Colors.light.surfaceMuted,
  },
  secondaryActionText: {
    color: Colors.light.text,
    fontFamily: Fonts.body,
    fontSize: 14,
    fontWeight: '700',
  },
  helperText: {
    color: Colors.light.muted,
    fontFamily: Fonts.body,
    fontSize: 13,
    lineHeight: 19,
  },
  errorText: {
    color: Colors.light.danger,
    fontFamily: Fonts.body,
    fontSize: 13,
    lineHeight: 18,
  },
  guardrail: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  guardrailBar: {
    width: 4,
    height: 30,
    borderRadius: Radii.pill,
    backgroundColor: Colors.light.accent,
  },
  guardrailText: {
    flex: 1,
    color: Colors.light.text,
    fontFamily: Fonts.body,
    fontSize: 14,
    lineHeight: 21,
  },
});
