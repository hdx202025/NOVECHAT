'use client'

import { useState, useEffect } from 'react';
import { 
  isBiometricsAvailable, 
  hasPlatformAuthenticator, 
  registerBiometric, 
  verifyBiometric 
} from '@/utils/biometrics';

interface UseBiometricsReturn {
  isAvailable: boolean;
  isSupported: boolean;
  isRegistered: boolean;
  isVerifying: boolean;
  error: string | null;
  register: (userId: string, username: string) => Promise<boolean>;
  verify: () => Promise<boolean>;
}

export default function useBiometrics(): UseBiometricsReturn {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if biometrics are available and supported
  useEffect(() => {
    const checkBiometrics = async () => {
      try {
        // Check if the API is available
        const available = isBiometricsAvailable();
        setIsAvailable(available);

        if (available) {
          // Check if the device has a platform authenticator
          const supported = await hasPlatformAuthenticator();
          setIsSupported(supported);

          // Check if the user has registered biometrics
          const credentialId = localStorage.getItem('nova_chat_biometric_id');
          setIsRegistered(!!credentialId);
        }
      } catch (error) {
        console.error('Error checking biometrics:', error);
        setError('Failed to check biometric capabilities');
      }
    };

    checkBiometrics();
  }, []);

  // Register biometrics
  const register = async (userId: string, username: string): Promise<boolean> => {
    setError(null);

    if (!isAvailable || !isSupported) {
      setError('Biometric authentication is not available on this device');
      return false;
    }

    try {
      await registerBiometric(userId, username);
      setIsRegistered(true);
      return true;
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to register biometric authentication');
      }
      return false;
    }
  };

  // Verify biometrics
  const verify = async (): Promise<boolean> => {
    setError(null);
    setIsVerifying(true);

    if (!isAvailable || !isSupported) {
      setError('Biometric authentication is not available on this device');
      setIsVerifying(false);
      return false;
    }

    if (!isRegistered) {
      setError('No biometric credential found. Please register first.');
      setIsVerifying(false);
      return false;
    }

    try {
      const result = await verifyBiometric();
      setIsVerifying(false);
      return result;
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to verify biometric authentication');
      }
      setIsVerifying(false);
      return false;
    }
  };

  return {
    isAvailable,
    isSupported,
    isRegistered,
    isVerifying,
    error,
    register,
    verify
  };
} 