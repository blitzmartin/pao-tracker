import { AppHeader } from "@/components/AppHeader";
import {
  calculateDaysUntilExpiry,
  formatDateWithStoredPreference,
  getExpiryColor,
  getExpiryDisplay,
} from "@/utils/dateUtils";
import { cancelNotification } from "@/utils/notificationsUtils";
import { AppColors } from "@/utils/Theme";
import { BeautyItem } from "@/utils/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { Card, Chip, FAB, IconButton, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function BeautyListScreen() {
  const [beautyItems, setBeautyItems] = useState<BeautyItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [formattedDates, setFormattedDates] = useState<{
    [key: string]: { expiry: string; opening?: string };
  }>({});
  const insets = useSafeAreaInsets();

  const loadBeautyItems = async () => {
    try {
      const items = await AsyncStorage.getItem("beautyItems");
      if (items) {
        const parsedItems: BeautyItem[] = JSON.parse(items);

        // Recalculate days until expiry for each item
        const updatedItems = parsedItems.map((item) => ({
          ...item,
          daysUntilExpiry: calculateDaysUntilExpiry(new Date(item.expiryDate)),
        }));

        // Sort by days until expiry (most urgent first)
        updatedItems.sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);

        setBeautyItems(updatedItems);

        // Format dates for display
        const dateFormatPromises = updatedItems.map(async (item) => {
          const expiryFormatted = await formatDateWithStoredPreference(
            new Date(item.expiryDate),
          );
          let openingFormatted = undefined;
          if (item.openingDate) {
            openingFormatted = await formatDateWithStoredPreference(
              new Date(item.openingDate),
            );
          }
          return {
            id: item.id,
            expiry: expiryFormatted,
            opening: openingFormatted,
          };
        });

        const formattedDateResults = await Promise.all(dateFormatPromises);
        const dateMap: { [key: string]: { expiry: string; opening?: string } } =
          {};
        formattedDateResults.forEach(({ id, expiry, opening }) => {
          dateMap[id] = { expiry, opening };
        });
        setFormattedDates(dateMap);
      } else {
        setBeautyItems([]);
      }
    } catch (error) {
      console.error("Error loading beauty items:", error);
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
    }, []),
  );

  const deleteItem = async (id: string) => {
    Alert.alert(
      "Delete Beauty Product",
      "Are you sure you want to delete this beauty product?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              // Cancel the notification for this item
              await cancelNotification(id);
              const updatedItems = beautyItems.filter((item) => item.id !== id);
              await AsyncStorage.setItem(
                "beautyItems",
                JSON.stringify(updatedItems),
              );

              setBeautyItems(updatedItems);
            } catch (error) {
              const message =
                error instanceof Error
                  ? error.message
                  : "An unknown error occurred";
              Alert.alert(
                "Error",
                `Failed to delete beauty product: ${message}`,
              );
            }
          },
        },
      ],
    );
  };

  const renderBeautyItem = ({ item }: { item: BeautyItem }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.cardInfo}>
            <Text variant="titleMedium" numberOfLines={1}>
              {item.name}
            </Text>
            <Text variant="bodySmall" style={styles.category}>
              {item.category}
              {item.paoMonths && ` • PAO: ${item.paoMonths}M`}
            </Text>
            <Text variant="bodySmall" style={styles.expiryDate}>
              {item.paoMonths && item.openingDate
                ? `Opened: ${formattedDates[item.id]?.opening || "Loading..."}`
                : `Expires: ${formattedDates[item.id]?.expiry || "Loading..."}`}
            </Text>
          </View>
          <View style={styles.cardActions}>
            <Chip
              textStyle={[
                styles.chipText,
                { color: getExpiryColor(item.daysUntilExpiry) },
              ]}
              style={[
                styles.expiryChip,
                { borderColor: getExpiryColor(item.daysUntilExpiry) },
              ]}
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
        onPress={() => router.push("/add-beauty")}
        color="white"
        customSize={56}
        theme={{ colors: { primaryContainer: "#8B5CF6" } }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.containerBackground,
  },
  list: {
    paddingHorizontal: 16,
  },
  card: {
    marginBottom: 8,
    elevation: 2,
    backgroundColor: AppColors.cardBackground,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardInfo: {
    flex: 1,
    marginRight: 8,
  },
  category: {
    color: AppColors.category,
    marginTop: 4,
  },
  expiryDate: {
    color: AppColors.category,
    marginTop: 2,
  },
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  expiryChip: {
    marginRight: 4,
    backgroundColor: "transparent",
    borderWidth: 1,
  },
  chipText: {
    fontWeight: "bold",
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: AppColors.category,
    textAlign: "center",
    lineHeight: 20,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
  },
});
