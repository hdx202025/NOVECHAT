/**
 * Encryption utilities for Nova Chat
 * Uses the Web Crypto API for secure end-to-end encryption
 */

// Generate a new encryption key
export async function generateEncryptionKey(): Promise<CryptoKey> {
  return await window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true, // extractable
    ['encrypt', 'decrypt']
  );
}

// Export encryption key to string format for storage
export async function exportKey(key: CryptoKey): Promise<string> {
  const exported = await window.crypto.subtle.exportKey('raw', key);
  return arrayBufferToBase64(exported);
}

// Import encryption key from string format
export async function importKey(keyString: string): Promise<CryptoKey> {
  const keyData = base64ToArrayBuffer(keyString);
  return await window.crypto.subtle.importKey(
    'raw',
    keyData,
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );
}

// Encrypt a message
export async function encryptMessage(message: string, key: CryptoKey): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  
  // Generate a random initialization vector
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    data
  );
  
  // Combine IV and encrypted data for storage/transmission
  const combined = new Uint8Array(iv.length + encryptedData.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encryptedData), iv.length);
  
  return arrayBufferToBase64(combined.buffer);
}

// Decrypt a message
export async function decryptMessage(encryptedMessage: string, key: CryptoKey): Promise<string> {
  const combinedBuffer = base64ToArrayBuffer(encryptedMessage);
  const combined = new Uint8Array(combinedBuffer);
  
  // Extract IV and encrypted data
  const iv = combined.slice(0, 12);
  const encryptedData = combined.slice(12);
  
  const decryptedData = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    encryptedData
  );
  
  const decoder = new TextDecoder();
  return decoder.decode(decryptedData);
}

// Helper function to convert ArrayBuffer to Base64 string
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Helper function to convert Base64 string to ArrayBuffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
} 