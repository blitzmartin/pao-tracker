import { DatePickerDialogProps } from '@/utils/types';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import { formatDateWithStoredPreference } from '../utils/dateUtils';

export function DatePickerDialog({
  visible,
  date,
  onConfirm,
  onDismiss,
  title,
  minimumDate,
  maximumDate,
}: DatePickerDialogProps) {
  const [tempDate, setTempDate] = useState(date);
  const [formattedDate, setFormattedDate] = useState<string>('');

  useEffect(() => {
    const formatDate = async () => {
      const formatted = await formatDateWithStoredPreference(tempDate);
      setFormattedDate(formatted);
    };
    formatDate();
  }, [tempDate]);

  const handleConfirm = () => {
    onConfirm(tempDate);
  };

  const handleDateChange = async (_: any, selectedDate?: Date) => {
    if (selectedDate) {
      setTempDate(selectedDate);
      if (Platform.OS === 'android') {
        // On Android, directly confirm the date
        onConfirm(selectedDate);
      } else {
        // Update formatted date for iOS display
        const formatted = await formatDateWithStoredPreference(selectedDate);
        setFormattedDate(formatted);
      }
    }
  };

  // For Android, show native picker directly
  if (Platform.OS === 'android') {
    return (
      <>
        {visible && (
          <DateTimePicker
            value={tempDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
          />
        )}
      </>
    );
  }

  // For iOS, show in dialog
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyLarge" style={styles.selectedDateText}>
            Selected: {formattedDate}
          </Text>
          <DateTimePicker
            value={tempDate}
            mode="date"
            display="compact"
            onChange={handleDateChange}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
          />
        </Dialog.Content>
        <Dialog.Actions style={styles.dialogActions}>
          <Button
            onPress={onDismiss}
            textColor="#6b5f30"
            style={styles.cancelButton}
          >
            Cancel
          </Button>
          <Button
            onPress={handleConfirm}
            mode="contained"
            buttonColor="#d0af09ff"
            textColor="#ffffff"
            style={styles.confirmButton}
          >
            Confirm
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = {
  dialog: {
    backgroundColor: '#fff4b3',
    borderRadius: 16,
  },
  dialogActions: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  confirmButton: {
    minWidth: 100,
  },
  cancelButton: {
    marginRight: 8,
  },
  selectedDateText: {
    textAlign: 'center' as const,
    color: '#3d2f00',
    fontWeight: 'bold' as const,
    marginBottom: 16,
  },
};
