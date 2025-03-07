/**
 * Biometric authentication utilities for Nova Chat
 * Uses the Web Authentication API (WebAuthn) for biometric authentication
 */

// Check if biometric authentication is available on the device
export function isBiometricsAvailable(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.PublicKeyCredential !== undefined &&
    typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function'
  );
}

// Check if the device has a platform authenticator (fingerprint, face ID, etc.)
export async function hasPlatformAuthenticator(): Promise<boolean> {
  if (!isBiometricsAvailable()) {
    return false;
  }
  
  try {
    return await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch (error) {
    console.error('Error checking platform authenticator:', error);
    return false;
  }
}

// Convert a string to a Uint8Array
function stringToBuffer(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

// Convert a Uint8Array to a base64 string
function bufferToBase64(buffer: ArrayBuffer): string {
  // Convert ArrayBuffer to binary string
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  // Convert binary string to base64
  return btoa(binary);
}

// Convert a base64 string to a Uint8Array
function base64ToBuffer(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Register a new biometric credential
export async function registerBiometric(userId: string, username: string): Promise<string> {
  if (!isBiometricsAvailable()) {
    throw new Error('Biometric authentication is not available on this device');
  }
  
  // Create a challenge
  const challenge = new Uint8Array(32);
  window.crypto.getRandomValues(challenge);
  
  // Create the credential options
  const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
    challenge,
    rp: {
      name: 'Nova Chat',
      id: window.location.hostname,
    },
    user: {
      id: stringToBuffer(userId),
      name: username,
      displayName: username,
    },
    pubKeyCredParams: [
      { type: 'public-key', alg: -7 }, // ES256
      { type: 'public-key', alg: -257 }, // RS256
    ],
    authenticatorSelection: {
      authenticatorAttachment: 'platform',
      userVerification: 'required',
      requireResidentKey: false,
    },
    timeout: 60000,
    attestation: 'none',
  };
  
  try {
    // Create the credential
    const credential = await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions,
    }) as PublicKeyCredential;
    
    // Get the attestation response
    const response = credential.response as AuthenticatorAttestationResponse;
    
    // Convert the credential ID to a base64 string for storage
    const credentialId = bufferToBase64(credential.rawId);
    
    // In a real app, you would send this to your server
    console.log('Registered biometric credential:', credentialId);
    
    // Store the credential ID in local storage
    localStorage.setItem('nova_chat_biometric_id', credentialId);
    
    return credentialId;
  } catch (error) {
    console.error('Error registering biometric:', error);
    throw new Error('Failed to register biometric authentication');
  }
}

// Verify a biometric credential
export async function verifyBiometric(): Promise<boolean> {
  if (!isBiometricsAvailable()) {
    throw new Error('Biometric authentication is not available on this device');
  }
  
  // Get the stored credential ID
  const credentialId = localStorage.getItem('nova_chat_biometric_id');
  if (!credentialId) {
    throw new Error('No biometric credential found. Please register first.');
  }
  
  // Create a challenge
  const challenge = new Uint8Array(32);
  window.crypto.getRandomValues(challenge);
  
  // Create the credential options
  const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
    challenge,
    allowCredentials: [
      {
        id: base64ToBuffer(credentialId),
        type: 'public-key',
        transports: ['internal'],
      },
    ],
    timeout: 60000,
    userVerification: 'required',
  };
  
  try {
    // Get the credential
    const assertion = await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions,
    }) as PublicKeyCredential;
    
    // In a real app, you would verify this with your server
    console.log('Verified biometric credential');
    
    return true;
  } catch (error) {
    console.error('Error verifying biometric:', error);
    return false;
  }
} 