/**
 * Push notification utilities for Nova Chat
 * Uses the Web Push API for push notifications
 */

// Extended NotificationOptions interface to include additional properties
interface ExtendedNotificationOptions extends NotificationOptions {
  vibrate?: number[];
  actions?: NotificationAction[];
}

// Notification action interface
interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

// Check if push notifications are supported
export function isPushSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window
  );
}

// Request permission for push notifications
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isPushSupported()) {
    throw new Error('Push notifications are not supported on this device');
  }
  
  try {
    return await Notification.requestPermission();
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    throw new Error('Failed to request notification permission');
  }
}

// Get the current notification permission
export function getNotificationPermission(): NotificationPermission {
  if (!isPushSupported()) {
    return 'denied';
  }
  
  return Notification.permission;
}

// Subscribe to push notifications
export async function subscribeToPushNotifications(): Promise<PushSubscription | null> {
  if (!isPushSupported()) {
    throw new Error('Push notifications are not supported on this device');
  }
  
  if (Notification.permission !== 'granted') {
    const permission = await requestNotificationPermission();
    if (permission !== 'granted') {
      throw new Error('Notification permission denied');
    }
  }
  
  try {
    // Get the service worker registration
    const registration = await navigator.serviceWorker.ready;
    
    // Subscribe to push notifications
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        // This should be your VAPID public key in a real app
        'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U'
      ),
    });
    
    // In a real app, you would send this subscription to your server
    console.log('Push notification subscription:', subscription);
    
    // Store the subscription in local storage
    localStorage.setItem('nova_chat_push_subscription', JSON.stringify(subscription));
    
    return subscription;
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    throw new Error('Failed to subscribe to push notifications');
  }
}

// Unsubscribe from push notifications
export async function unsubscribeFromPushNotifications(): Promise<boolean> {
  if (!isPushSupported()) {
    return false;
  }
  
  try {
    // Get the service worker registration
    const registration = await navigator.serviceWorker.ready;
    
    // Get the push subscription
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      // Unsubscribe from push notifications
      const result = await subscription.unsubscribe();
      
      // Remove the subscription from local storage
      localStorage.removeItem('nova_chat_push_subscription');
      
      return result;
    }
    
    return false;
  } catch (error) {
    console.error('Error unsubscribing from push notifications:', error);
    return false;
  }
}

// Show a notification
export function showNotification(title: string, options?: ExtendedNotificationOptions): void {
  if (!isPushSupported() || Notification.permission !== 'granted') {
    console.warn('Cannot show notification: permission not granted');
    return;
  }
  
  // Default options
  const defaultOptions: ExtendedNotificationOptions = {
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: 'open',
        title: 'Open',
      },
      {
        action: 'close',
        title: 'Close',
      },
    ],
  };
  
  // Merge options
  const mergedOptions = { ...defaultOptions, ...options };
  
  // Show the notification
  new Notification(title, mergedOptions);
}

// Helper function to convert base64 to Uint8Array
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
} 