'use client'

import { useState, useEffect } from 'react'
import { Bell, X, MessageCircle, Phone, User } from 'lucide-react'
import useNotifications from '@/hooks/useNotifications'

interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'message' | 'call' | 'system';
  timestamp: number;
  read: boolean;
}

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { isSupported, permission, subscribe, sendNotification } = useNotifications()

  // Load notifications from local storage on component mount
  useEffect(() => {
    const storedNotifications = localStorage.getItem('nova_chat_notifications')
    if (storedNotifications) {
      try {
        setNotifications(JSON.parse(storedNotifications))
      } catch (error) {
        console.error('Failed to parse stored notifications:', error)
      }
    }
  }, [])

  // Save notifications to local storage when they change
  useEffect(() => {
    localStorage.setItem('nova_chat_notifications', JSON.stringify(notifications))
  }, [notifications])

  // Add a new notification
  const addNotification = (title: string, body: string, type: 'message' | 'call' | 'system' = 'message') => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      title,
      body,
      type,
      timestamp: Date.now(),
      read: false,
    }
    
    setNotifications(prev => [newNotification, ...prev].slice(0, 20)) // Keep only the 20 most recent notifications
    
    // Show a browser notification if supported and permission granted
    if (isSupported && permission === 'granted') {
      sendNotification(title, body)
    }
  }

  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    )
  }

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  // Remove a notification
  const removeNotification = (id: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    )
  }

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([])
  }

  // Get the number of unread notifications
  const unreadCount = notifications.filter(notification => !notification.read).length

  // Format timestamp to relative time (e.g., "2 hours ago")
  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    } else {
      return 'Just now'
    }
  }

  // Get the icon for a notification type
  const getNotificationIcon = (type: 'message' | 'call' | 'system') => {
    switch (type) {
      case 'message':
        return <MessageCircle className="w-5 h-5 text-primary-blue" />
      case 'call':
        return <Phone className="w-5 h-5 text-green-500" />
      case 'system':
        return <User className="w-5 h-5 text-yellow-500" />
    }
  }

  // For demo purposes, add some sample notifications
  useEffect(() => {
    if (notifications.length === 0) {
      addNotification('Sarah Johnson', 'Hey, how are you doing?', 'message')
      addNotification('Missed Call', 'David Wilson tried to call you', 'call')
      addNotification('New Login', 'Your account was accessed from a new device', 'system')
    }
  }, [])

  return (
    <div className="relative">
      {/* Notification bell icon */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="relative p-2 text-text-dark hover:text-primary-blue focus:outline-none"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-primary-blue rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
          <div className="p-3 bg-primary-blue text-white flex justify-between items-center">
            <h3 className="text-lg font-medium">Notifications</h3>
            <div className="flex space-x-2">
              {notifications.length > 0 && (
                <>
                  <button 
                    onClick={markAllAsRead} 
                    className="text-xs bg-white bg-opacity-20 hover:bg-opacity-30 px-2 py-1 rounded"
                  >
                    Mark all as read
                  </button>
                  <button 
                    onClick={clearAllNotifications} 
                    className="text-xs bg-white bg-opacity-20 hover:bg-opacity-30 px-2 py-1 rounded"
                  >
                    Clear all
                  </button>
                </>
              )}
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-white hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-text-light">
                No notifications
              </div>
            ) : (
              <div>
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`p-3 border-b border-gray-100 hover:bg-gray-50 flex ${!notification.read ? 'bg-blue-50' : ''}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="mr-3">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="text-sm font-medium text-text-dark">{notification.title}</h4>
                        <span className="text-xs text-text-light">{formatRelativeTime(notification.timestamp)}</span>
                      </div>
                      <p className="text-sm text-text-light mt-1">{notification.body}</p>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        removeNotification(notification.id)
                      }} 
                      className="ml-2 text-text-light hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 