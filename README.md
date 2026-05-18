# TrueID Mobile

TrueID mobile is an Expo Router app for the Android-first caller identification experience.

## What is implemented

- Live FastAPI lookup from the `Lookup` screen
- Native Android caller identification path using `CallScreeningService`
- Translucent caller overlay activity that renders the lookup result during an incoming call
- Settings screen for backend status and Android caller-ID role status

## Important constraint

This feature does **not** work in Expo Go. Use a development build because Android telecom APIs require custom native code.

## Environment

Set the backend URL before building:

```env
EXPO_PUBLIC_TRUEID_API_BASE_URL=http://10.0.2.2:8000
```

For a physical Android device, replace `10.0.2.2` with your machine's LAN IP.

## Local run

```bash
npm install
npx expo prebuild --platform android
npx expo run:android
```

If you already generated native files, you can keep using:

```bash
npx expo start --dev-client
```

## Caller ID setup on Android

1. Install the development build on an Android 10+ device or emulator.
2. Open the `Settings` tab.
3. Tap `Enable caller ID role`.
4. Accept the Android role prompt.
5. Use the `Lookup` screen to verify the backend and preview the overlay UI.
