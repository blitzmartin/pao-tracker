import { ThemedViewProps } from '@/utils/types';
import { View } from 'react-native';

export function ThemedView({ style, backgroundColor, ...props }: ThemedViewProps) {
  return <View style={[backgroundColor && { backgroundColor }, style]} {...props} />;
}
