import { AppHeader } from '@/components/AppHeader';
import { calculateDaysUntilExpiry, formatDateWithStoredPreference } from '@/utils/dateUtils';
import { BeautyItem } from '@/utils/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { Card, Chip, FAB, IconButton, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function BeautyListScreen() {
  const [beautyItems, setBeautyItems] = useState<BeautyItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [formattedDates, setFormattedDates] = useState<{[key: string]: {expiry: string, opening?: string}}>({});
  const insets = useSafeAreaInsets();

  const loadBeautyItems = async () => {
    try {
      const items = await AsyncStorage.getItem('beautyItems');
      if (items) {
        const parsedItems: BeautyItem[] = JSON.parse(items);

        // Recalculate days until expiry for each item
        const updatedItems = parsedItems.map(item => ({
          ...item,
          daysUntilExpiry: calculateDaysUntilExpiry(new Date(item.expiryDate))
        }));

        // Sort by days until expiry (most urgent first)
        updatedItems.sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);

        setBeautyItems(updatedItems);

        // Format dates for display
        const dateFormatPromises = updatedItems.map(async (item) => {
          const expiryFormatted = await formatDateWithStoredPreference(new Date(item.expiryDate));
          let openingFormatted = undefined;
          if (item.openingDate) {
            openingFormatted = await formatDateWithStoredPreference(new Date(item.openingDate));
          }
          return { id: item.id, expiry: expiryFormatted, opening: openingFormatted };
        });

        const formattedDateResults = await Promise.all(dateFormatPromises);
        const dateMap: {[key: string]: {expiry: string, opening?: string}} = {};
        formattedDateResults.forEach(({ id, expiry, opening }) => {
          dateMap[id] = { expiry, opening };
        });
        setFormattedDates(dateMap);
      } else {
        setBeautyItems([]);
      }
    } catch (error) {
      console.error('Error loading beauty items:', error);
      setBeautyItems([]);
    }
  };


  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadBeautyItems();
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadBeautyItems();
    }, [])
  );

  const deleteItem = async (id: string) => {
    Alert.alert(
      'Delete Beauty Product',
      'Are you sure you want to delete this beauty product?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedItems = beautyItems.filter(item => item.id !== id);
              await AsyncStorage.setItem('beautyItems', JSON.stringify(updatedItems));

              setBeautyItems(updatedItems);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete beauty product');
            }
          }
        }
      ]
    );
  };

  const getExpiryColor = (days: number): string => {
    if (days < 0) return '#d32f2f'; // Expired - Red
    if (days <= 0) return '#d32f2f'; // Expiring today - Red
    if (days <= 30) return '#ff9800'; // Expiring soon - Orange
    if (days <= 90) return '#fbc02d'; // Warning - Yellow
    return '#388e3c'; // Good - Green
  };

  const getExpiryDisplay = (item: BeautyItem): string => {
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


  const renderBeautyItem = ({ item }: { item: BeautyItem }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.cardInfo}>
            <Text variant="titleMedium" numberOfLines={1}>{item.name}</Text>
            <Text variant="bodySmall" style={styles.category}>
              {item.category}
              {item.paoMonths && ` • PAO: ${item.paoMonths}M`}
            </Text>
            <Text variant="bodySmall" style={styles.expiryDate}>
              {item.paoMonths && item.openingDate
                ? `Opened: ${formattedDates[item.id]?.opening || 'Loading...'}`
                : `Expires: ${formattedDates[item.id]?.expiry || 'Loading...'}`
              }
            </Text>
          </View>
          <View style={styles.cardActions}>
            <Chip
              textStyle={[styles.chipText, { color: getExpiryColor(item.daysUntilExpiry) }]}
              style={[styles.expiryChip, { borderColor: getExpiryColor(item.daysUntilExpiry) }]}
            >
              {getExpiryDisplay(item)}
            </Chip>
            <IconButton
              icon="delete"
              size={20}
              onPress={() => deleteItem(item.id)}
            />
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <AppHeader />

      {beautyItems.length === 0 && !refreshing ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No beauty products found.</Text>
          <Text style={styles.emptySubtext}>
            Tap the + button to add your first beauty product!
          </Text>
        </View>
      ) : (
        <FlatList
          data={beautyItems}
          renderItem={renderBeautyItem}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          style={styles.list}
        />
      )}

      <FAB
        icon="plus"
        style={[styles.fab, { bottom: insets.bottom + 16 }]}
        onPress={() => router.push('/add-beauty')}
        color="white"
        customSize={56}
        theme={{ colors: { primaryContainer: '#8B5CF6' } }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    paddingHorizontal: 16,
  },
  card: {
    marginBottom: 8,
    elevation: 2,
    backgroundColor: '#F9F5FF',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardInfo: {
    flex: 1,
    marginRight: 8,
  },
  category: {
    color: '#666',
    marginTop: 4,
  },
  expiryDate: {
    color: '#666',
    marginTop: 2,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expiryChip: {
    marginRight: 4,
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  chipText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
  },
});
