import { AppColors, TextInputThemes } from "@/utils/Theme";
import { BEAUTY_CATEGORIES, monthNames, MONTHS, PAO_OPTIONS } from '@/utils/constants';
import { scheduleNotificationForItem } from "@/utils/notificationsUtils";
import { BeautyItem } from '@/utils/types';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Chip, Text, TextInput } from "react-native-paper";
import {
  calculateDaysUntilExpiry,
  getMonthYearExpiryDate,
} from "../utils/dateUtils";



const generateYears = (): number[] => {
  const years = [];
  for (
    let i = new Date().getFullYear();
    i <= new Date().getFullYear() + 10;
    i++
  ) {
    years.push(i);
  }
  return years;
};

export default function AddBeautyScreen() {
  const [name, setName] = useState("");
  const [expiryMonth, setExpiryMonth] = useState(new Date().getMonth() + 1);
  const [expiryYear, setExpiryYear] = useState(new Date().getFullYear());
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [usePAO, setUsePAO] = useState(true);
  const [selectedPAO, setSelectedPAO] = useState<number | null>(null);

  const calculatePAOExpiry = (openingDate: Date, paoMonths: number): Date => {
    const expiry = new Date(openingDate);
    expiry.setMonth(expiry.getMonth() + paoMonths);
    return expiry;
  };

  const getExpiryDateFromMonthYear = (): Date => {
    return getMonthYearExpiryDate(expiryYear, expiryMonth); // End of the month
  };

  const formatExpiryDate = (month: number, year: number): string => {
    return `${monthNames[month - 1]} ${year}`;
  };

  const saveBeautyItem = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a beauty product name");
      return;
    }

    if (usePAO && !selectedPAO) {
      Alert.alert("Error", "Please select a PAO (Period After Opening)");
      return;
    }

    setIsLoading(true);

    try {
      let finalExpiryDate: Date;

      if (usePAO && selectedPAO) {
        // Use current date as opening date for PAO calculation
        const currentDate = new Date();
        finalExpiryDate = calculatePAOExpiry(currentDate, selectedPAO);
      } else {
        // Use selected month/year
        finalExpiryDate = getExpiryDateFromMonthYear();
      }

      const newItem: BeautyItem = {
        id: Date.now().toString(),
        name: name.trim(),
        expiryDate: finalExpiryDate.toISOString(),
        category: selectedCategory || "Other",
        daysUntilExpiry: calculateDaysUntilExpiry(finalExpiryDate),
        ...(usePAO &&
          selectedPAO && {
            paoMonths: selectedPAO,
            openingDate: new Date().toISOString(),
          }),
      };

      const existingItems = await AsyncStorage.getItem("beautyItems");
      const items: BeautyItem[] = existingItems
        ? JSON.parse(existingItems)
        : [];
      items.push(newItem);

      await AsyncStorage.setItem("beautyItems", JSON.stringify(items));
      await scheduleNotificationForItem(newItem);

      // Navigate back directly without confirmation
      router.back();
    } catch {
      Alert.alert("Error", "Failed to save beauty product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <TextInput
            label="Product Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            mode="outlined"
            theme={TextInputThemes.beauty}
          />
          <Text variant="bodyMedium" style={styles.label}>
            Category
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryContainer}
          >
            {BEAUTY_CATEGORIES.map((category) => (
              <Chip
                key={category}
                selected={selectedCategory === category}
                onPress={() => setSelectedCategory(category)}
                style={styles.categoryChip}
                selectedColor={AppColors.beauty}
                showSelectedOverlay={true}
                theme={{
                  colors: {
                    secondaryContainer: "#E9D5FF",
                    onSecondaryContainer: "#6B21A8",
                  },
                }}
              >
                {category}
              </Chip>
            ))}
          </ScrollView>

          <View style={styles.expiryTypeContainer}>
            <Text variant="bodyMedium" style={styles.label}>
              Expiry Type
            </Text>
            <View style={styles.chipContainer}>
              <Chip
                selected={usePAO}
                onPress={() => setUsePAO(true)}
                style={styles.typeChip}
                selectedColor={AppColors.beauty}
                showSelectedOverlay={true}
                theme={{
                  colors: {
                    secondaryContainer: "#E9D5FF",
                    onSecondaryContainer: "#6B21A8",
                  },
                }}
              >
                PAO (Period After Opening)
              </Chip>
              <Chip
                selected={!usePAO}
                onPress={() => setUsePAO(false)}
                style={styles.typeChip}
                selectedColor={AppColors.beauty}
                showSelectedOverlay={true}
                theme={{
                  colors: {
                    secondaryContainer: "#E9D5FF",
                    onSecondaryContainer: "#6B21A8",
                  },
                }}
              >
                Custom Date
              </Chip>
            </View>
          </View>

          {usePAO ? (
            <>
              <Text variant="bodyMedium" style={styles.label}>
                PAO (Period After Opening)
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.paoContainer}
              >
                {PAO_OPTIONS.map((months) => (
                  <Chip
                    key={months}
                    selected={selectedPAO === months}
                    onPress={() => setSelectedPAO(months)}
                    style={styles.paoChip}
                    selectedColor={AppColors.beauty}
                    showSelectedOverlay={true}
                    theme={{
                      colors: {
                        secondaryContainer: "#E9D5FF",
                        onSecondaryContainer: "#6B21A8",
                      },
                    }}
                  >
                    {months}M
                  </Chip>
                ))}
              </ScrollView>
            </>
          ) : (
            <>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Expiry Date
              </Text>

              <View style={styles.datePickerContainer}>
                <View style={styles.pickerWrapper}>
                  <Text style={styles.pickerLabel}>Month</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={expiryMonth}
                      onValueChange={setExpiryMonth}
                      style={styles.picker}
                    >
                      {MONTHS.map((month) => (
                        <Picker.Item
                          key={month.value}
                          label={month.label}
                          value={month.value}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>

                <View style={styles.pickerWrapper}>
                  <Text style={styles.pickerLabel}>Year</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={expiryYear}
                      onValueChange={setExpiryYear}
                      style={styles.picker}
                    >
                      {generateYears().map((year) => (
                        <Picker.Item
                          key={year}
                          label={year.toString()}
                          value={year}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>
              </View>

              <Text variant="bodyMedium" style={styles.datePreview}>
                Expires: {formatExpiryDate(expiryMonth, expiryYear)}
              </Text>
            </>
          )}

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={saveBeautyItem}
              loading={isLoading}
              disabled={isLoading}
              style={styles.saveButton}
              buttonColor={AppColors.beauty}
              textColor="white"
            >
              Save Beauty Product
            </Button>

            <Button
              mode="outlined"
              onPress={() => router.back()}
              style={styles.cancelButton}
              buttonColor="transparent"
              textColor={AppColors.beauty}
              theme={{
                colors: {
                  outline: AppColors.beauty
                }
              }}
            >
              Cancel
            </Button>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f5ff",
  },
  card: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: "bold",
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryChip: {
    marginRight: 8,
  },
  expiryTypeContainer: {
    marginBottom: 16,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  typeChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  paoContainer: {
    marginBottom: 16,
  },
  paoChip: {
    marginRight: 8,
  },
  dateButton: {
    marginBottom: 16,
  },
  buttonContainer: {
    marginTop: 16,
  },
  saveButton: {
    marginBottom: 8,
  },
  cancelButton: {
    marginBottom: 8,
  },
  sectionTitle: {
    marginBottom: 12,
    marginTop: 8,
    fontWeight: "600",
  },
  datePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 16,
  },
  pickerWrapper: {
    flex: 1,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#8b8b8b",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "white",
  },
  picker: {
    height: 60,
  },
  datePreview: {
    textAlign: "center",
    marginBottom: 16,
    padding: 8,
    backgroundColor: "#f3e8ff",
    borderRadius: 8,
    color: AppColors.switchOn,
    fontWeight: "600",
  },
});
