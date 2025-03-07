/**
 * Media utilities for Nova Chat
 * Handles voice recording and file sharing
 */

// Maximum file size in bytes (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed file types for sharing
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'audio/mpeg',
  'audio/wav',
  'audio/webm',
  'video/mp4',
  'video/webm',
];

// Check if the browser supports audio recording
export function isAudioRecordingSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === 'function'
  );
}

// Check if the browser supports file sharing
export function isFileSharingSupported(): boolean {
  return typeof window !== 'undefined' && 'FileReader' in window;
}

// Start recording audio
export async function startRecording(): Promise<{
  mediaRecorder: MediaRecorder;
  audioChunks: Blob[];
}> {
  if (!isAudioRecordingSupported()) {
    throw new Error('Audio recording is not supported on this device');
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks: Blob[] = [];

    mediaRecorder.addEventListener('dataavailable', (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    });

    mediaRecorder.start();

    return { mediaRecorder, audioChunks };
  } catch (error) {
    console.error('Error starting audio recording:', error);
    throw new Error('Failed to start audio recording');
  }
}

// Stop recording audio and get the audio blob
export function stopRecording(
  mediaRecorder: MediaRecorder,
  audioChunks: Blob[]
): Promise<Blob> {
  return new Promise((resolve) => {
    mediaRecorder.addEventListener('stop', () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      resolve(audioBlob);

      // Stop all audio tracks
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    });

    mediaRecorder.stop();
  });
}

// Convert a blob to a base64 string
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert blob to base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Convert a base64 string to a blob
export function base64ToBlob(base64: string, type: string): Blob {
  const byteString = atob(base64.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type });
}

// Validate a file for sharing
export function validateFile(file: File): {
  valid: boolean;
  error?: string;
} {
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds the maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    };
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'File type not supported',
    };
  }

  return { valid: true };
}

// Get file type category
export function getFileTypeCategory(mimeType: string): 'image' | 'audio' | 'video' | 'document' {
  if (mimeType.startsWith('image/')) {
    return 'image';
  } else if (mimeType.startsWith('audio/')) {
    return 'audio';
  } else if (mimeType.startsWith('video/')) {
    return 'video';
  } else {
    return 'document';
  }
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}

// Generate a thumbnail for an image file
export async function generateImageThumbnail(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 200;
        const MAX_HEIGHT = 200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        } else {
          reject(new Error('Failed to create canvas context'));
        }
      };
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      if (e.target?.result) {
        img.src = e.target.result as string;
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    reader.readAsDataURL(file);
  });
} 