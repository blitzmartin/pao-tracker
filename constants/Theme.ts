import { Colors } from './Colors';


// Section-specific colors
export const SectionColors = {
  beauty: '#8B5CF6',
  switchOn: '#5919f1',
  settings: '#6B7280'
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
    cardBackground: Colors.light.background,
  },
  dark: {
    ...Colors.dark,
    cardBackground: Colors.dark.background,
  },
};
