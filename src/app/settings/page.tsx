'use client'

import { useState, useEffect } from 'react'
import { 
  Bell, 
  Moon, 
  Lock, 
  User, 
  ChevronRight, 
  Globe, 
  HelpCircle, 
  Shield, 
  Fingerprint,
  MessageSquare
} from 'lucide-react'
import NavigationBar from '@/components/layout/NavigationBar'
import useEncryption from '@/hooks/useEncryption'
import useBiometrics from '@/hooks/useBiometrics'
import useNotifications from '@/hooks/useNotifications'

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false)
  
  // Encryption settings
  const { encryptionReady, exportCurrentKey } = useEncryption()
  const [encryptionStatus, setEncryptionStatus] = useState<'active' | 'initializing' | 'error'>('initializing')
  
  // Biometric settings
  const { isAvailable: biometricsAvailable, isSupported: biometricsSupported, isRegistered: biometricsRegistered } = useBiometrics()
  const [biometricsStatus, setBiometricsStatus] = useState<'available' | 'registered' | 'unavailable'>('unavailable')
  
  // Notification settings
  const { isSupported: notificationsSupported, permission: notificationPermission, isSubscribed: notificationsSubscribed } = useNotifications()
  const [notificationsStatus, setNotificationsStatus] = useState<'enabled' | 'disabled' | 'unavailable'>('unavailable')

  // Initialize settings on component mount
  useEffect(() => {
    // Check encryption status
    if (encryptionReady) {
      setEncryptionStatus('active')
    }
    
    // Check biometrics status
    if (biometricsAvailable && biometricsSupported) {
      setBiometricsStatus(biometricsRegistered ? 'registered' : 'available')
    }
    
    // Check notifications status
    if (notificationsSupported) {
      setNotificationsStatus(
        notificationPermission === 'granted' && notificationsSubscribed
          ? 'enabled'
          : 'disabled'
      )
    }
  }, [
    encryptionReady, 
    biometricsAvailable, 
    biometricsSupported, 
    biometricsRegistered,
    notificationsSupported,
    notificationPermission,
    notificationsSubscribed
  ])

  // Export encryption key
  const handleExportEncryptionKey = async () => {
    try {
      const key = await exportCurrentKey()
      // In a real app, you would provide a way for the user to securely save this key
      alert(`Your encryption key: ${key.substring(0, 10)}...${key.substring(key.length - 10)} (Copy this somewhere safe)`)
    } catch (error) {
      console.error('Failed to export encryption key:', error)
      alert('Failed to export encryption key')
    }
  }

  return (
    <div className="min-h-screen bg-background-white flex flex-col">
      {/* Header - 44px height */}
      <div className="h-11 bg-white border-b border-gray-100 flex items-center px-4">
        <h1 className="text-xl font-bold text-text-dark">Settings</h1>
      </div>

      {/* User profile section */}
      <div className="p-4 bg-white border-b border-gray-100">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-primary-blue rounded-full flex items-center justify-center text-white text-2xl font-bold">
            JD
          </div>
          <div className="ml-4">
            <h2 className="text-lg font-medium text-text-dark">John Doe</h2>
            <p className="text-text-light">+49 123 456 7890</p>
          </div>
        </div>
      </div>

      {/* Settings list */}
      <div className="flex-1 overflow-y-auto pb-[60px]">
        {/* Security section */}
        <div className="mt-4">
          <h3 className="px-4 text-xs font-medium text-text-light uppercase tracking-wider mb-2">
            Security
          </h3>
          <div className="bg-white">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-primary-blue" />
                <span className="ml-3 text-text-dark">End-to-End Encryption</span>
              </div>
              <div className="flex items-center">
                <span className={`text-sm ${encryptionStatus === 'active' ? 'text-green-500' : 'text-yellow-500'}`}>
                  {encryptionStatus === 'active' ? 'Active' : 'Initializing...'}
                </span>
                <ChevronRight className="w-5 h-5 text-text-light ml-2" />
              </div>
            </div>
            
            {encryptionStatus === 'active' && (
              <div className="p-4 border-b border-gray-100">
                <button 
                  onClick={handleExportEncryptionKey}
                  className="w-full py-2 px-4 border border-primary-blue text-primary-blue rounded-md hover:bg-primary-blue hover:text-white transition-colors"
                >
                  Export Encryption Key
                </button>
                <p className="mt-2 text-xs text-text-light">
                  Keep your encryption key safe. You'll need it to recover your messages if you switch devices.
                </p>
              </div>
            )}
            
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center">
                <Fingerprint className="w-5 h-5 text-primary-blue" />
                <span className="ml-3 text-text-dark">Biometric Authentication</span>
              </div>
              <div className="flex items-center">
                <span className={`text-sm ${
                  biometricsStatus === 'unavailable' 
                    ? 'text-text-light' 
                    : biometricsStatus === 'registered' 
                      ? 'text-green-500' 
                      : 'text-yellow-500'
                }`}>
                  {biometricsStatus === 'unavailable' 
                    ? 'Unavailable' 
                    : biometricsStatus === 'registered' 
                      ? 'Enabled' 
                      : 'Available'}
                </span>
                <ChevronRight className="w-5 h-5 text-text-light ml-2" />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center">
                <Lock className="w-5 h-5 text-primary-blue" />
                <span className="ml-3 text-text-dark">Privacy & Security</span>
              </div>
              <ChevronRight className="w-5 h-5 text-text-light" />
            </div>
          </div>
        </div>

        {/* Notifications section */}
        <div className="mt-4">
          <h3 className="px-4 text-xs font-medium text-text-light uppercase tracking-wider mb-2">
            Notifications
          </h3>
          <div className="bg-white">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center">
                <Bell className="w-5 h-5 text-primary-blue" />
                <span className="ml-3 text-text-dark">Push Notifications</span>
              </div>
              <div className="flex items-center">
                <span className={`text-sm ${
                  notificationsStatus === 'unavailable' 
                    ? 'text-text-light' 
                    : notificationsStatus === 'enabled' 
                      ? 'text-green-500' 
                      : 'text-red-500'
                }`}>
                  {notificationsStatus === 'unavailable' 
                    ? 'Unavailable' 
                    : notificationsStatus === 'enabled' 
                      ? 'Enabled' 
                      : 'Disabled'}
                </span>
                <ChevronRight className="w-5 h-5 text-text-light ml-2" />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center">
                <MessageSquare className="w-5 h-5 text-primary-blue" />
                <span className="ml-3 text-text-dark">Message Notifications</span>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="message-notifications"
                  checked={true}
                  className="sr-only"
                />
                <label
                  htmlFor="message-notifications"
                  className="block overflow-hidden h-6 rounded-full bg-primary-blue cursor-pointer"
                >
                  <span
                    className="block h-6 w-6 rounded-full bg-white shadow transform translate-x-4"
                  ></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences section */}
        <div className="mt-4">
          <h3 className="px-4 text-xs font-medium text-text-light uppercase tracking-wider mb-2">
            Preferences
          </h3>
          <div className="bg-white">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center">
                <Moon className="w-5 h-5 text-primary-blue" />
                <span className="ml-3 text-text-dark">Dark Mode</span>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="toggle"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                  className="sr-only"
                />
                <label
                  htmlFor="toggle"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                    darkMode ? 'bg-primary-blue' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in ${
                      darkMode ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  ></span>
                </label>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center">
                <Globe className="w-5 h-5 text-primary-blue" />
                <span className="ml-3 text-text-dark">Language</span>
              </div>
              <div className="flex items-center">
                <span className="text-text-light mr-2">English</span>
                <ChevronRight className="w-5 h-5 text-text-light" />
              </div>
            </div>
          </div>
        </div>

        {/* Account section */}
        <div className="mt-4">
          <h3 className="px-4 text-xs font-medium text-text-light uppercase tracking-wider mb-2">
            Account
          </h3>
          <div className="bg-white">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center">
                <User className="w-5 h-5 text-primary-blue" />
                <span className="ml-3 text-text-dark">Profile</span>
              </div>
              <ChevronRight className="w-5 h-5 text-text-light" />
            </div>
          </div>
        </div>

        {/* Support section */}
        <div className="mt-4">
          <h3 className="px-4 text-xs font-medium text-text-light uppercase tracking-wider mb-2">
            Support
          </h3>
          <div className="bg-white">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center">
                <HelpCircle className="w-5 h-5 text-primary-blue" />
                <span className="ml-3 text-text-dark">Help & Support</span>
              </div>
              <ChevronRight className="w-5 h-5 text-text-light" />
            </div>
          </div>
        </div>

        <div className="p-4 text-center">
          <button className="text-red-500">Log Out</button>
        </div>
      </div>

      <NavigationBar />
    </div>
  )
} 