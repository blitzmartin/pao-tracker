import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { Colors } from './Colors';

export const yellowLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: Colors.light.tint, // #f0d033ff
    onPrimary: '#ffffff',
    primaryContainer: '#fff4b3',
    onPrimaryContainer: '#3d2f00',
    secondary: '#6b5f30',
    onSecondary: '#ffffff',
    secondaryContainer: '#f4e2a8',
    onSecondaryContainer: '#241a00',
    surface: Colors.light.background,
    onSurface: Colors.light.text,
  },
};

export const yellowDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: Colors.dark.tint, // #fff
    onPrimary: '#3d2f00',
    primaryContainer: '#5a4500',
    onPrimaryContainer: '#fff4b3',
    secondary: '#d6c58c',
    onSecondary: '#3a2e05',
    secondaryContainer: '#52461a',
    onSecondaryContainer: '#f4e2a8',
    surface: Colors.dark.background,
    onSurface: Colors.dark.text,
  },
};

// Section-specific colors
export const SectionColors = {
  beauty: '#8B5CF6',    // Purple  
  settings: '#6B7280'   // Gray
};

// TextInput themes for each section
export const TextInputThemes = {
  beauty: {
    colors: {
      primary: SectionColors.beauty,
      onSurfaceVariant: SectionColors.beauty,
    },
  },
  settings: {
    colors: {
      primary: SectionColors.settings,
      onSurfaceVariant: SectionColors.settings,
    },
  },
};

// Centralized theme colors for consistent usage across components
export const AppColors = {
  light: {
    ...Colors.light,
    searchBackground: yellowLightTheme.colors.primaryContainer,
    cardBackground: Colors.light.background,
  },
  dark: {
    ...Colors.dark,
    searchBackground: yellowDarkTheme.colors.primaryContainer,
    cardBackground: Colors.dark.background,
  },
};
