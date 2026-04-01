import { AppHeader } from "@/components/AppHeader";
import { useNotificationSettings } from "@/hooks/useNotifications";
import { AppColors } from "@/utils/Theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  Dialog,
  List,
  Portal,
  RadioButton,
  Switch,
  Text,
} from "react-native-paper";

export default function SettingsScreen() {
  const [clearDataDialogVisible, setClearDataDialogVisible] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [deleteBeautyItems, setDeleteBeautyItems] = useState(true);
  const [dateFormat, setDateFormat] = useState<"DD-MM-YYYY" | "MM-DD-YYYY">(
    "DD-MM-YYYY",
  );
  const [dateFormatDialogVisible, setDateFormatDialogVisible] = useState(false);

  const { enabled, toggle, loading } = useNotificationSettings();

  useEffect(() => {
    loadDateFormat();
  }, []);

  const loadDateFormat = async () => {
    try {
      const savedFormat = await AsyncStorage.getItem("dateFormat");
      if (
        savedFormat &&
        (savedFormat === "DD-MM-YYYY" || savedFormat === "MM-DD-YYYY")
      ) {
        setDateFormat(savedFormat);
      }
    } catch (error) {
      console.error("Error loading date format:", error);
    }
  };

  const saveDateFormat = async (format: "DD-MM-YYYY" | "MM-DD-YYYY") => {
    try {
      await AsyncStorage.setItem("dateFormat", format);
      setDateFormat(format);
      setDateFormatDialogVisible(false);
      Alert.alert("Success", `Date format changed to ${format}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      Alert.alert("Error", `Failed to save date format preference: ${message}`);
    }
  };

  const showDateFormatDialog = () => {
    setDateFormatDialogVisible(true);
  };

  const hideDateFormatDialog = () => {
    setDateFormatDialogVisible(false);
  };

  const showClearDataDialog = () => {
    setDeleteBeautyItems(true);
    setClearDataDialogVisible(true);
  };

  const confirmClearAllData = async () => {
    try {
      await AsyncStorage.removeItem("beautyItems");
      setClearDataDialogVisible(false);
      Alert.alert("Success", "All beauty items have been cleared.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      Alert.alert("Error", `Failed to clear data.t: ${message}`);
    }
  };

  const hideClearDataDialog = () => {
    setClearDataDialogVisible(false);
  };

  return (
    <View style={styles.container}>
      <AppHeader />
      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineSmall">Display Preferences</Text>
            <List.Item
              title="Date Format"
              description={`Currently using: ${dateFormat}`}
            />
            <Button
              mode="outlined"
              onPress={showDateFormatDialog}
              buttonColor="transparent"
              textColor="#4B5563"
              theme={{ colors: { outline: "#4B5563" } }}
            >
              Change
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineSmall">Data Management</Text>
            <Text variant="bodyMedium" style={styles.description}>
              All your data is stored locally on your device. No cloud storage
              is used.
            </Text>
            <Button
              mode="outlined"
              onPress={showClearDataDialog}
              style={styles.button}
              buttonColor="#ffebee"
              textColor="#d32f2f"
            >
              Clear All Data
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineSmall">Notifications</Text>

            <Text variant="bodyMedium" style={styles.description}>
              Get reminded on the first day of the month when a product is about
              to expire.
            </Text>

            <List.Item
              title="Enable notifications"
              right={() => (
                <Switch
                  value={enabled}
                  onValueChange={async () => {
                    const result = await toggle();
                    if (result?.success === false) {
                      Alert.alert(
                        "Permission required",
                        "Please enable notifications permissions in your device settings.",
                      );
                    }
                  }}
                  disabled={loading}
                  trackColor={{ false: "#B2B2B2", true: AppColors.brandColor }}
                  color={AppColors.switchOn}
                />
              )}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card} onPress={() => router.push("/about")}>
          <Card.Content>
            <View style={styles.aboutHeader}>
              <Text variant="headlineSmall">About</Text>
              <List.Icon
                icon="information"
                color="#4B5563"
                style={styles.infoIcon}
              />
            </View>
            <Text variant="bodyMedium" style={styles.description}>
              Learn about this app and our mission at Paper Board Labs.
            </Text>
          </Card.Content>
        </Card>

        <Portal>
          <Dialog
            visible={clearDataDialogVisible}
            onDismiss={hideClearDataDialog}
            style={styles.dialog}
          >
            <Dialog.Title style={styles.dialogTitle}>Clear Data</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium" style={styles.dialogContent}>
                This will delete all your beauty products data. This action
                cannot be undone.
              </Text>
            </Dialog.Content>
            <Dialog.Actions style={styles.dialogActions}>
              <Button
                onPress={hideClearDataDialog}
                textColor={AppColors.settings}
                style={styles.cancelButton}
              >
                Cancel
              </Button>
              <Button
                onPress={confirmClearAllData}
                mode="contained"
                buttonColor="#d32f2f"
                textColor="#ffffff"
                style={styles.deleteButton}
              >
                Delete Data
              </Button>
            </Dialog.Actions>
          </Dialog>

          <Dialog
            visible={dateFormatDialogVisible}
            onDismiss={hideDateFormatDialog}
            style={styles.dialog}
          >
            <Dialog.Title style={styles.dialogTitle}>
              Choose Date Format
            </Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium" style={styles.dialogContent}>
                Select your preferred date format for displaying dates
                throughout the app.
              </Text>

              <View style={styles.radioContainer}>
                <View style={styles.radioRow}>
                  <RadioButton
                    value="DD-MM-YYYY"
                    status={
                      dateFormat === "DD-MM-YYYY" ? "checked" : "unchecked"
                    }
                    onPress={() => setDateFormat("DD-MM-YYYY")}
                    color="#4B5563"
                  />
                  <Text variant="bodyMedium" style={styles.radioLabel}>
                    DD-MM-YYYY (e.g., 25-12-2026)
                  </Text>
                </View>

                <View style={styles.radioRow}>
                  <RadioButton
                    value="MM-DD-YYYY"
                    status={
                      dateFormat === "MM-DD-YYYY" ? "checked" : "unchecked"
                    }
                    onPress={() => setDateFormat("MM-DD-YYYY")}
                    color="#4B5563"
                  />
                  <Text variant="bodyMedium" style={styles.radioLabel}>
                    MM-DD-YYYY (e.g., 12-25-2026)
                  </Text>
                </View>
              </View>
            </Dialog.Content>
            <Dialog.Actions style={styles.dialogActions}>
              <Button
                onPress={hideDateFormatDialog}
                textColor={AppColors.settings}
                style={styles.cancelButton}
              >
                Cancel
              </Button>
              <Button
                onPress={() => saveDateFormat(dateFormat)}
                mode="contained"
                buttonColor="#4B5563"
                textColor="#ffffff"
                style={styles.confirmButton}
              >
                Save
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: 16,
    marginBottom: 8,
  },
  description: {
    marginTop: 8,
  },
  button: {
    marginTop: 8,
  },
  dialog: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
  },
  dialogTitle: {
    color: "#374151",
    fontWeight: "bold",
  },
  dialogContent: {
    color: "#374151",
    lineHeight: 22,
  },
  dialogActions: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  cancelButton: {
    marginRight: 8,
  },
  deleteButton: {
    minWidth: 100,
  },
  checkboxContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  checkboxLabel: {
    marginLeft: 8,
    color: "#374151",
    flex: 1,
  },
  radioContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  radioLabel: {
    marginLeft: 8,
    color: "#374151",
    flex: 1,
  },
  confirmButton: {
    minWidth: 100,
  },
  aboutHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  infoIcon: {
    margin: 0,
  },
});
