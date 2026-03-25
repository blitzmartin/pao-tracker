import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

//  Get notification date as 9am on the first day of the month of the expiry date
export const getNotificationDateFromExpiry = (expiryISO: string): Date => {
  const expiry = new Date(expiryISO);

  /******************** DEBUG MODE ********************/
  // Trigger notification after 5 seconds instead of calculating the date from expiry
  const DEBUG_MODE = true;
  if (DEBUG_MODE) {
    // 👉 trigger tra 10 secondi
    const now = new Date();
    now.setSeconds(now.getSeconds() + 5);
    return now;
  }
  /********************  END DEBUG MODE  ********************/

  return new Date(
    expiry.getFullYear(),
    expiry.getMonth(),
    1,
    9,
    0,
    0
  );
}

// Check if notifications are enabled
export const areNotificationsEnabled = async (): Promise<boolean> => {
  return (await AsyncStorage.getItem("notificationsEnabled")) === "true";
}

// Check if notifications permission is granted
export const requestNotificationPermission = async (): Promise<boolean> => {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

// Schedule a notification for an item if notifications are enabled and permission is granted
export const scheduleNotificationForItem = async (item: {
  id: string;
  name: string;
  expiryDate: string;
}) => {
  const enabled = await areNotificationsEnabled();
  if (!enabled) return;

  const notifyAt = getNotificationDateFromExpiry(item.expiryDate);

  if (notifyAt <= new Date()) return;

  await Notifications.scheduleNotificationAsync({
    identifier: item.id,
    content: {
      title: "Product expiring soon",
      body: `${item.name} expires this month`,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: notifyAt,
    },
  });
}

// Cancel a scheduled notification for an item
export const cancelNotification = async (id: string) => {
  await Notifications.cancelScheduledNotificationAsync(id);
}

// Reschedule all notifications for all items (used when app starts or when notifications are toggled on)
export const rescheduleAllNotifications = async () => {
  const enabled = await areNotificationsEnabled();
  if (!enabled) return;

  const stored = await AsyncStorage.getItem("beautyItems");
  const items = stored ? JSON.parse(stored) : [];

  const scheduled =
    await Notifications.getAllScheduledNotificationsAsync();

  for (const n of scheduled) {
    await Notifications.cancelScheduledNotificationAsync(n.identifier);
  }

  for (const item of items) {
    const notifyAt = getNotificationDateFromExpiry(item.expiryDate);

    if (notifyAt > new Date()) {
      await Notifications.scheduleNotificationAsync({
        identifier: item.id,
        content: {
          title: "Product expiring soon",
          body: `${item.name} expires this month`,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: notifyAt,
        },
      });
    }
  }
}

// Enable notifications (persist only)
export const setNotificationsEnabled = async (value: boolean) => {
  await AsyncStorage.setItem("notificationsEnabled", value ? "true" : "false");
}

// Cancel ALL notifications
export const cancelAllNotifications = async () => {
 Notifications.cancelAllScheduledNotificationsAsync()
}
