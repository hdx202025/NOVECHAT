'use client'

import { useState, useEffect } from 'react';
import {
  isPushSupported,
  getNotificationPermission,
  requestNotificationPermission,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  showNotification
} from '@/utils/notifications';

interface UseNotificationsReturn {
  isSupported: boolean;
  permission: NotificationPermission;
  isSubscribed: boolean;
  error: string | null;
  requestPermission: () => Promise<NotificationPermission>;
  subscribe: () => Promise<boolean>;
  unsubscribe: () => Promise<boolean>;
  sendNotification: (title: string, body: string) => void;
}

export default function useNotifications(): UseNotificationsReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if push notifications are supported and get current permission
  useEffect(() => {
    const checkNotifications = () => {
      try {
        const supported = isPushSupported();
        setIsSupported(supported);

        if (supported) {
          const currentPermission = getNotificationPermission();
          setPermission(currentPermission);

          // Check if the user is subscribed
          const subscription = localStorage.getItem('nova_chat_push_subscription');
          setIsSubscribed(!!subscription);
        }
      } catch (error) {
        console.error('Error checking notifications:', error);
        setError('Failed to check notification capabilities');
      }
    };

    checkNotifications();
  }, []);

  // Request permission for push notifications
  const requestPermission = async (): Promise<NotificationPermission> => {
    setError(null);

    if (!isSupported) {
      setError('Push notifications are not supported on this device');
      return 'denied';
    }

    try {
      const newPermission = await requestNotificationPermission();
      setPermission(newPermission);
      return newPermission;
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to request notification permission');
      }
      return 'denied';
    }
  };

  // Subscribe to push notifications
  const subscribe = async (): Promise<boolean> => {
    setError(null);

    if (!isSupported) {
      setError('Push notifications are not supported on this device');
      return false;
    }

    if (permission !== 'granted') {
      const newPermission = await requestPermission();
      if (newPermission !== 'granted') {
        setError('Notification permission denied');
        return false;
      }
    }

    try {
      const subscription = await subscribeToPushNotifications();
      setIsSubscribed(!!subscription);
      return !!subscription;
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to subscribe to push notifications');
      }
      return false;
    }
  };

  // Unsubscribe from push notifications
  const unsubscribe = async (): Promise<boolean> => {
    setError(null);

    if (!isSupported) {
      setError('Push notifications are not supported on this device');
      return false;
    }

    try {
      const result = await unsubscribeFromPushNotifications();
      setIsSubscribed(!result);
      return result;
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to unsubscribe from push notifications');
      }
      return false;
    }
  };

  // Send a notification
  const sendNotification = (title: string, body: string): void => {
    setError(null);

    if (!isSupported) {
      setError('Push notifications are not supported on this device');
      return;
    }

    if (permission !== 'granted') {
      setError('Notification permission not granted');
      return;
    }

    try {
      showNotification(title, { body });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to show notification');
      }
    }
  };

  return {
    isSupported,
    permission,
    isSubscribed,
    error,
    requestPermission,
    subscribe,
    unsubscribe,
    sendNotification
  };
} 