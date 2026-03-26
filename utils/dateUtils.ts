import AsyncStorage from "@react-native-async-storage/async-storage";
import { BeautyItem } from './types';

export type DateFormat = 'DD-MM-YYYY' | 'MM-DD-YYYY';

export const getStoredDateFormat = async (): Promise<DateFormat> => {
  try {
    const savedFormat = await AsyncStorage.getItem('dateFormat');
    if (savedFormat && (savedFormat === 'DD-MM-YYYY' || savedFormat === 'MM-DD-YYYY')) {
      return savedFormat;
    }
    return 'DD-MM-YYYY'; // Default format
  } catch (error) {
    console.error('Error loading date format:', error);
    return 'DD-MM-YYYY';
  }
};

export const formatDate = (date: Date, format?: DateFormat): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  if (format === 'MM-DD-YYYY') {
    return `${month}-${day}-${year}`;
  }
  // Default to DD-MM-YYYY
  return `${day}-${month}-${year}`;
};

export const formatDateWithStoredPreference = async (date: Date): Promise<string> => {
  const format = await getStoredDateFormat();
  return formatDate(date, format);
};

// Date-only utility functions (no time components)
export const getDateOnly = (date: Date): Date => {
  const dateOnly = new Date(date);
  dateOnly.setHours(0, 0, 0, 0);
  return dateOnly;
};

export const getTodayDateOnly = (): Date => {
  return getDateOnly(new Date());
};

export const calculateDaysUntilExpiry = (expiryDate: Date): number => {
  const today = getTodayDateOnly();
  const expiry = getDateOnly(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const isDateInFuture = (date: Date): boolean => {
  const today = getTodayDateOnly();
  const compareDate = getDateOnly(date);
  return compareDate >= today; // Include today as valid notification date
};

// Month-year expiration utility functions
export const getEndOfMonth = (year: number, month: number): Date => {
  // Create date for first day of next month, then subtract 1 day to get last day of current month
  const endOfMonth = new Date(year, month, 0); // month is 0-indexed, so this gets last day of (month-1)
  endOfMonth.setHours(23, 59, 59, 999); // Set to end of day
  return endOfMonth;
};

export const getMonthYearExpiryDate = (year: number, month: number): Date => {
  // For month-year expiration, items expire at the END of the specified month
  return getEndOfMonth(year, month);
};

  export const getExpiryDisplay = (item: BeautyItem): string => {
    if (item.daysUntilExpiry < 0) return 'Expired';
    if (item.daysUntilExpiry === 0) return 'Today';

    // For PAO products, show the original PAO duration
    if (item.paoMonths) {
      if (item.daysUntilExpiry < 0) return 'Expired';
      return `${item.paoMonths}M left`;
    }

    // For regular expiry dates, show months if > 60 days, otherwise days
    if (item.daysUntilExpiry > 60) {
      const monthsRemaining = Math.ceil(item.daysUntilExpiry / 30);
      return `${monthsRemaining}M left`;
    }

    return `${item.daysUntilExpiry}d left`;
  };


  export const getExpiryColor = (days: number): string => {
    if (days < 0) return '#d32f2f'; // Expired - Red
    if (days <= 0) return '#d32f2f'; // Expiring today - Red
    if (days <= 30) return '#ff9800'; // Expiring soon - Orange
    if (days <= 90) return '#fbc02d'; // Warning - Yellow
    return '#388e3c'; // Good - Green
  };
