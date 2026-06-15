const { withAndroidManifest } = require('expo/config-plugins');

const RECEIVER_NAME = 'expo.modules.trueidtelecom.PhoneStateReceiver';
const ACTIVITY_NAME = 'expo.modules.trueidtelecom.CallerOverlayActivity';
const META_DATA_NAME = 'expo.modules.trueidtelecom.API_BASE_URL';

function ensurePermission(manifest, permissionName) {
  manifest['uses-permission'] = manifest['uses-permission'] || [];
  const exists = manifest['uses-permission'].some(
    (permission) => permission.$['android:name'] === permissionName,
  );
  if (!exists) {
    manifest['uses-permission'].push({
      $: { 'android:name': permissionName },
    });
  }
}

function ensureMetaData(application, name, value) {
  application['meta-data'] = application['meta-data'] || [];
  const existing = application['meta-data'].find((item) => item.$['android:name'] === name);
  if (existing) {
    existing.$['android:value'] = value;
    return;
  }
  application['meta-data'].push({
    $: {
      'android:name': name,
      'android:value': value,
    },
  });
}

function ensureReceiver(application) {
  application.receiver = application.receiver || [];
  const existing = application.receiver.find((receiver) => receiver.$['android:name'] === RECEIVER_NAME);
  if (existing) {
    return;
  }
  application.receiver.push({
    $: {
      'android:name': RECEIVER_NAME,
      'android:exported': 'true',
    },
    'intent-filter': [
      {
        action: [{ $: { 'android:name': 'android.intent.action.PHONE_STATE' } }],
      },
    ],
  });
}

function ensureActivity(application) {
  application.activity = application.activity || [];
  const existing = application.activity.find((activity) => activity.$['android:name'] === ACTIVITY_NAME);
  if (existing) {
    return;
  }
  application.activity.push({
    $: {
      'android:name': ACTIVITY_NAME,
      'android:exported': 'false',
      'android:excludeFromRecents': 'true',
      'android:launchMode': 'singleTask',
      'android:noHistory': 'true',
      'android:taskAffinity': '',
      'android:theme': '@android:style/Theme.Translucent.NoTitleBar',
    },
  });
}

module.exports = function withTrueIdAndroid(config, { apiBaseUrl } = {}) {
  return withAndroidManifest(config, (configResult) => {
    const manifest = configResult.modResults.manifest;
    const application = manifest.application?.[0];

    if (!application) {
      return configResult;
    }

    ensurePermission(manifest, 'android.permission.INTERNET');
    ensurePermission(manifest, 'android.permission.READ_CONTACTS');
    ensurePermission(manifest, 'android.permission.READ_PHONE_STATE');
    ensurePermission(manifest, 'android.permission.READ_CALL_LOG');
    ensurePermission(manifest, 'android.permission.ANSWER_PHONE_CALLS');
    ensureReceiver(application);
    ensureActivity(application);
    ensureMetaData(application, META_DATA_NAME, apiBaseUrl || '');

    if (typeof apiBaseUrl === 'string' && apiBaseUrl.startsWith('http://')) {
      application.$['android:usesCleartextTraffic'] = 'true';
    }

    return configResult;
  });
};
