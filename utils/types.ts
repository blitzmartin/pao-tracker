export type BeautyItem = {
  id: string;
  name: string;
  expiryDate: string;
  category?: string;
  daysUntilExpiry: number;
  paoMonths?: number;
  openingDate?: string;
}

export type DatePickerDialogProps = {
  visible: boolean;
  date: Date;
  onConfirm: (date: Date) => void;
  onDismiss: () => void;
  title: string;
  minimumDate?: Date;
  maximumDate?: Date;
}
