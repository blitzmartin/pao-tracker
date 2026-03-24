// Section-specific colors
export const AppColors = {
  beauty: '#8B5CF6',
  switchOn: '#5919f1',
  settings: '#6B7280'
};

// TextInput themes for each section
export const TextInputThemes = {
  beauty: {
    colors: {
      primary: AppColors.beauty,
      onSurfaceVariant: AppColors.beauty,
    },
  },
  settings: {
    colors: {
      primary: AppColors.settings,
      onSurfaceVariant: AppColors.settings,
    },
  },
};


/* Theme colors for each section */

const tintColorLight = '#c3aef6ff';
const tintColorDark = '#fff';
const brandColor = '#8B5CF6';


export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#686976ff',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    brand: brandColor,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    brand: brandColor,
  },
};
