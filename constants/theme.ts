import { Platform } from 'react-native';

export const Colors = {
  light: {
    background: '#07090D',
    surface: '#10141B',
    surfaceMuted: '#171C24',
    surfaceSoft: '#1D2430',
    text: '#F5F7FB',
    muted: '#8B93A5',
    accent: '#C7A66A',
    accentSoft: '#2B2318',
    line: '#252C37',
    icon: '#A6AFBF',
    success: '#42C08A',
    danger: '#F36B6B',
    tabIconDefault: '#7C8597',
    tabIconSelected: '#C7A66A',
    shadow: 'rgba(0, 0, 0, 0.35)',
  },
  dark: {
    background: '#07090D',
    surface: '#10141B',
    surfaceMuted: '#171C24',
    surfaceSoft: '#1D2430',
    text: '#F5F7FB',
    muted: '#8B93A5',
    accent: '#C7A66A',
    accentSoft: '#2B2318',
    line: '#252C37',
    icon: '#A6AFBF',
    success: '#42C08A',
    danger: '#F36B6B',
    tabIconDefault: '#7C8597',
    tabIconSelected: '#C7A66A',
    shadow: 'rgba(0, 0, 0, 0.35)',
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
  sm: 14,
  md: 22,
  lg: 30,
  pill: 999,
};
