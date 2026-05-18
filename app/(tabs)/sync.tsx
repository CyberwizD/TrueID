import * as Contacts from 'expo-contacts';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Reveal } from '@/components/reveal';
import { ScreenShell } from '@/components/screen-shell';
import { SectionHeading } from '@/components/section-heading';
import { useTrueId } from '@/components/trueid-provider';
import { Colors, Fonts, Radii } from '@/constants/theme';
import { getInstallationId } from '@/lib/installation';
import { normalizePhoneNumber } from '@/lib/phone';
import { uploadContacts } from '@/lib/trueid-api';

type PermissionState = 'granted' | 'denied' | 'undetermined';

export default function SyncScreen() {
  const { syncSnapshot, setSyncSnapshot } = useTrueId();
  const [permission, setPermission] = useState<PermissionState>('undetermined');
  const [phoneContactCount, setPhoneContactCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void refreshPermissionAndCount();
  }, []);

  async function refreshPermissionAndCount() {
    const permissionResponse = await Contacts.getPermissionsAsync();
    const nextPermission: PermissionState =
      permissionResponse.status === 'granted'
        ? 'granted'
        : permissionResponse.status === 'denied'
          ? 'denied'
          : 'undetermined';

    setPermission(nextPermission);

    if (nextPermission === 'granted') {
      const response = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
        pageSize: 5000,
      });
      const count = response.data.filter((contact) => (contact.phoneNumbers?.length ?? 0) > 0).length;
      setPhoneContactCount(count);
    }
  }

  async function requestPermission() {
    setError(null);
    const permissionResponse = await Contacts.requestPermissionsAsync();
    setPermission(
      permissionResponse.status === 'granted'
        ? 'granted'
        : permissionResponse.status === 'denied'
          ? 'denied'
          : 'undetermined',
    );
    await refreshPermissionAndCount();
  }

  async function syncContactsNow() {
    setError(null);
    setSyncing(true);

    try {
      const response = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
        pageSize: 5000,
      });
      const preparedContacts = response.data
        .flatMap((contact) => {
          const name = contact.name?.trim();
          const phone = contact.phoneNumbers?.[0]?.number;
          const normalized = phone ? normalizePhoneNumber(phone) : '';

          if (!name || normalized.length < 11) {
            return [];
          }

          return [
            {
              phone_number: normalized,
              contact_name: name,
            },
          ];
        })
        .slice(0, 1000);

      const installationId = await getInstallationId();
      await uploadContacts(installationId, preparedContacts);
      const snapshot = {
        contactCount: preparedContacts.length,
        syncedAt: new Date().toISOString(),
      };
      await setSyncSnapshot(snapshot);
      setPhoneContactCount(preparedContacts.length);
    } catch (syncError) {
      setError(syncError instanceof Error ? syncError.message : 'Sync failed.');
    } finally {
      setSyncing(false);
    }
  }

  return (
    <ScreenShell>
      <Reveal delay={50}>
        <SectionHeading
          eyebrow="Contact sync"
          title="Contribute only when you approve it."
          detail="TrueID only needs contact names and numbers you explicitly allow. There is no account or profile flow here."
        />
      </Reveal>

      <Reveal delay={100} style={styles.panel}>
        <Text style={styles.panelTitle}>Contacts access</Text>
        <Text style={styles.panelValue}>
          {permission === 'granted'
            ? `${phoneContactCount} contact numbers ready`
            : permission === 'denied'
              ? 'Access denied'
              : 'Access not granted'}
        </Text>
        <Text style={styles.panelCopy}>
          Approving access lets TrueID upload your chosen contact names to improve caller identification for everyone.
        </Text>
        <View style={styles.buttonRow}>
          <Pressable style={styles.primaryButton} onPress={() => void requestPermission()}>
            <Text style={styles.primaryButtonText}>
              {permission === 'granted' ? 'Refresh access' : 'Allow contacts'}
            </Text>
          </Pressable>
          {permission === 'granted' ? (
            <Pressable
              style={[styles.secondaryButton, syncing && styles.dimmed]}
              onPress={() => void syncContactsNow()}
              disabled={syncing}>
              <Text style={styles.secondaryButtonText}>{syncing ? 'Syncing...' : 'Sync now'}</Text>
            </Pressable>
          ) : null}
        </View>
      </Reveal>

      <Reveal delay={150} style={styles.panel}>
        <Text style={styles.panelTitle}>Last sync</Text>
        <Text style={styles.syncStat}>{syncSnapshot.contactCount} numbers contributed</Text>
        <Text style={styles.panelCopy}>
          {syncSnapshot.syncedAt
            ? `Last updated ${new Date(syncSnapshot.syncedAt).toLocaleString()}.`
            : 'No contact upload has happened on this device yet.'}
        </Text>
      </Reveal>

      <Reveal delay={200} style={styles.privacyPanel}>
        <Text style={styles.panelTitle}>What leaves the device</Text>
        <Text style={styles.privacyLine}>Contact name and phone number only.</Text>
        <Text style={styles.privacyLine}>No account signup, no profile page, no exact home address exposure.</Text>
        <Text style={styles.privacyLine}>You stay in control of when sync happens.</Text>
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
  panelTitle: {
    color: Colors.light.text,
    fontFamily: Fonts.body,
    fontSize: 18,
    fontWeight: '700',
  },
  panelValue: {
    color: Colors.light.accent,
    fontFamily: Fonts.display,
    fontSize: 30,
    lineHeight: 34,
  },
  panelCopy: {
    color: Colors.light.muted,
    fontFamily: Fonts.body,
    fontSize: 14,
    lineHeight: 21,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
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
    flex: 1,
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
  dimmed: {
    opacity: 0.7,
  },
  syncStat: {
    color: Colors.light.text,
    fontFamily: Fonts.body,
    fontSize: 16,
    fontWeight: '700',
  },
  privacyPanel: {
    padding: 22,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.light.line,
    backgroundColor: Colors.light.surfaceMuted,
    gap: 10,
  },
  privacyLine: {
    color: Colors.light.text,
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
