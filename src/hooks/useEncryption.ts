'use client'

import { useState, useEffect } from 'react';
import { 
  generateEncryptionKey, 
  exportKey, 
  importKey, 
  encryptMessage, 
  decryptMessage 
} from '@/utils/encryption';

interface UseEncryptionReturn {
  encryptionReady: boolean;
  encrypt: (message: string) => Promise<string>;
  decrypt: (encryptedMessage: string) => Promise<string>;
  exportCurrentKey: () => Promise<string>;
  importNewKey: (keyString: string) => Promise<void>;
}

export default function useEncryption(): UseEncryptionReturn {
  const [encryptionKey, setEncryptionKey] = useState<CryptoKey | null>(null);
  const [encryptionReady, setEncryptionReady] = useState(false);

  // Initialize encryption on component mount
  useEffect(() => {
    const initializeEncryption = async () => {
      try {
        // Check if we have a stored key
        const storedKey = localStorage.getItem('nova_chat_encryption_key');
        
        if (storedKey) {
          // Import existing key
          const key = await importKey(storedKey);
          setEncryptionKey(key);
        } else {
          // Generate new key
          const key = await generateEncryptionKey();
          const exportedKey = await exportKey(key);
          
          // Store key for future use
          localStorage.setItem('nova_chat_encryption_key', exportedKey);
          setEncryptionKey(key);
        }
        
        setEncryptionReady(true);
      } catch (error) {
        console.error('Failed to initialize encryption:', error);
        // Fallback to generate a new key if there was an error
        try {
          const key = await generateEncryptionKey();
          const exportedKey = await exportKey(key);
          localStorage.setItem('nova_chat_encryption_key', exportedKey);
          setEncryptionKey(key);
          setEncryptionReady(true);
        } catch (fallbackError) {
          console.error('Critical encryption failure:', fallbackError);
        }
      }
    };

    initializeEncryption();
  }, []);

  // Encrypt a message
  const encrypt = async (message: string): Promise<string> => {
    if (!encryptionKey) {
      throw new Error('Encryption key not initialized');
    }
    return await encryptMessage(message, encryptionKey);
  };

  // Decrypt a message
  const decrypt = async (encryptedMessage: string): Promise<string> => {
    if (!encryptionKey) {
      throw new Error('Encryption key not initialized');
    }
    return await decryptMessage(encryptedMessage, encryptionKey);
  };

  // Export the current key as a string
  const exportCurrentKey = async (): Promise<string> => {
    if (!encryptionKey) {
      throw new Error('Encryption key not initialized');
    }
    return await exportKey(encryptionKey);
  };

  // Import a new key from a string
  const importNewKey = async (keyString: string): Promise<void> => {
    try {
      const key = await importKey(keyString);
      setEncryptionKey(key);
      localStorage.setItem('nova_chat_encryption_key', keyString);
    } catch (error) {
      console.error('Failed to import encryption key:', error);
      throw new Error('Invalid encryption key format');
    }
  };

  return {
    encryptionReady,
    encrypt,
    decrypt,
    exportCurrentKey,
    importNewKey
  };
} 