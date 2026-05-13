import { Platform } from 'react-native';

export const Colors = {
  light: {
    background: '#F4EFE7',
    surface: '#FBF7F0',
    surfaceMuted: '#EFE5D6',
    text: '#201B17',
    muted: '#6F665C',
    accent: '#A35F35',
    accentSoft: '#DDBB97',
    line: '#D7CCBD',
    success: '#2F6B45',
    danger: '#A13E34',
    tabIconDefault: '#8B7A68',
    tabIconSelected: '#A35F35',
    shadow: 'rgba(50, 33, 18, 0.08)',
  },
  dark: {
    background: '#F4EFE7',
    surface: '#FBF7F0',
    surfaceMuted: '#EFE5D6',
    text: '#201B17',
    muted: '#6F665C',
    accent: '#A35F35',
    accentSoft: '#DDBB97',
    line: '#D7CCBD',
    success: '#2F6B45',
    danger: '#A13E34',
    tabIconDefault: '#8B7A68',
    tabIconSelected: '#A35F35',
    shadow: 'rgba(50, 33, 18, 0.08)',
  },
};

export const Fonts = Platform.select({
  ios: {
    display: 'Georgia',
    body: 'Avenir Next',
    mono: 'Menlo',
  },
  android: {
    display: 'serif',
    body: 'sans-serif',
    mono: 'monospace',
  },
  default: {
    display: 'serif',
    body: 'sans-serif',
    mono: 'monospace',
  },
  web: {
    display: "Iowan Old Style, Georgia, 'Times New Roman', serif",
    body: "'Avenir Next', 'Segoe UI', Helvetica, Arial, sans-serif",
    mono: "'IBM Plex Mono', 'SFMono-Regular', Menlo, monospace",
  },
});

export const Radii = {
  sm: 12,
  md: 20,
  lg: 28,
  pill: 999,
};
