import { areNotificationsEnabled, cancelAllNotifications, requestNotificationPermission, rescheduleAllNotifications, setNotificationsEnabled } from '@/utils/notificationsUtils';
import { useEffect, useState } from "react";

export function useNotificationSettings() {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const val = await areNotificationsEnabled();
      setEnabled(val);
         // Reschedule notifications if they are enabled
      if (val) {
        await rescheduleAllNotifications();
      }
      setLoading(false);
    })();
  }, []);

const enable = async () => {
  setLoading(true);

  const granted = await requestNotificationPermission();

  if (!granted) {
    setLoading(false);
    return { success: false, reason: "permission-denied" };
  }

  await setNotificationsEnabled(true);
  setEnabled(true);

  await rescheduleAllNotifications();

  setLoading(false);

  return { success: true };
};

const disable = async () => {
  setLoading(true);

  await setNotificationsEnabled(false);
  setEnabled(false);

  await cancelAllNotifications();

  setLoading(false);
};

const toggle = async () => {
  if (loading) return;

  if (enabled) {
    await disable();
  } else {
    return await enable();
  }
};

  return {
    enabled,
    loading,
    enable,
    disable,
    toggle,
  };
}
