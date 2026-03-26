import { useCallback, useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { getSetting, setSetting } from '@/lib/db/settings';

const NOTIF_HOUR_KEY = 'notifHour';
const NOTIF_ENABLED_KEY = 'notifEnabled';
const NOTIF_ID_KEY = 'notifId';

export function useNotifications() {
  const [enabled, setEnabled] = useState(false);
  const [hour, setHour] = useState(21);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Notifications.getPermissionsAsync();
      setPermissionGranted(status === 'granted');
      const storedHour = await getSetting(NOTIF_HOUR_KEY);
      const storedEnabled = await getSetting(NOTIF_ENABLED_KEY);
      if (storedHour) setHour(parseInt(storedHour, 10));
      if (storedEnabled === 'true') setEnabled(true);
    })();
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    const { status } = await Notifications.requestPermissionsAsync();
    const granted = status === 'granted';
    setPermissionGranted(granted);
    return granted;
  }, []);

  const scheduleNotification = useCallback(async (h: number) => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Habita',
        body: "Don't forget to log your habits today!",
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: h,
        minute: 0,
      },
    });
    await setSetting(NOTIF_ID_KEY, id);
  }, []);

  const enable = useCallback(async () => {
    let granted = permissionGranted;
    if (!granted) granted = await requestPermission();
    if (!granted) return;
    await scheduleNotification(hour);
    await setSetting(NOTIF_ENABLED_KEY, 'true');
    await setSetting(NOTIF_HOUR_KEY, String(hour));
    setEnabled(true);
  }, [hour, permissionGranted, requestPermission, scheduleNotification]);

  const disable = useCallback(async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await setSetting(NOTIF_ENABLED_KEY, 'false');
    setEnabled(false);
  }, []);

  const changeHour = useCallback(async (h: number) => {
    setHour(h);
    await setSetting(NOTIF_HOUR_KEY, String(h));
    if (enabled) await scheduleNotification(h);
  }, [enabled, scheduleNotification]);

  return { enabled, hour, permissionGranted, enable, disable, changeHour };
}
