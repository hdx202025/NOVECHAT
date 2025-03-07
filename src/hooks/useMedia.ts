import { useState, useCallback, useRef } from 'react';
import {
  isAudioRecordingSupported,
  isFileSharingSupported,
  startRecording,
  stopRecording,
  blobToBase64,
  validateFile,
  generateImageThumbnail,
  getFileTypeCategory,
  formatFileSize,
} from '@/utils/media';

interface MediaFile {
  id: string;
  name: string;
  type: string;
  size: number;
  sizeFormatted: string;
  category: 'image' | 'audio' | 'video' | 'document';
  base64: string;
  thumbnail?: string;
}

interface UseMediaReturn {
  isRecordingSupported: boolean;
  isFileSharingSupported: boolean;
  isRecording: boolean;
  recordingTime: number;
  recordedAudio: MediaFile | null;
  selectedFiles: MediaFile[];
  startAudioRecording: () => Promise<void>;
  stopAudioRecording: () => Promise<void>;
  cancelAudioRecording: () => void;
  selectFiles: () => Promise<void>;
  removeFile: (id: string) => void;
  clearFiles: () => void;
}

export default function useMedia(): UseMediaReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedAudio, setRecordedAudio] = useState<MediaFile | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<MediaFile[]>([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const isRecordingSupported = isAudioRecordingSupported();
  const isFileSupported = isFileSharingSupported();

  // Start recording audio
  const startAudioRecording = useCallback(async () => {
    if (!isRecordingSupported) {
      throw new Error('Audio recording is not supported on this device');
    }

    try {
      const { mediaRecorder, audioChunks } = await startRecording();
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = audioChunks;
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer to track recording duration
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  }, [isRecordingSupported]);

  // Stop recording audio
  const stopAudioRecording = useCallback(async () => {
    if (!mediaRecorderRef.current || !isRecording) {
      return;
    }

    try {
      const audioBlob = await stopRecording(
        mediaRecorderRef.current,
        audioChunksRef.current
      );

      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      // Convert blob to base64
      const base64 = await blobToBase64(audioBlob);
      
      // Create audio file object
      const audioFile: MediaFile = {
        id: `audio-${Date.now()}`,
        name: `Voice Message (${formatRecordingTime(recordingTime)})`,
        type: 'audio/webm',
        size: audioBlob.size,
        sizeFormatted: formatFileSize(audioBlob.size),
        category: 'audio',
        base64,
      };

      setRecordedAudio(audioFile);
      setIsRecording(false);
      
      // Reset refs
      mediaRecorderRef.current = null;
      audioChunksRef.current = [];
      
      return;
    } catch (error) {
      console.error('Error stopping recording:', error);
      throw error;
    }
  }, [isRecording, recordingTime]);

  // Cancel audio recording
  const cancelAudioRecording = useCallback(() => {
    if (!mediaRecorderRef.current || !isRecording) {
      return;
    }

    // Stop all tracks
    mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsRecording(false);
    setRecordingTime(0);
    
    // Reset refs
    mediaRecorderRef.current = null;
    audioChunksRef.current = [];
  }, [isRecording]);

  // Select files for sharing
  const selectFiles = useCallback(async () => {
    if (!isFileSupported) {
      throw new Error('File sharing is not supported on this device');
    }

    return new Promise<void>((resolve, reject) => {
      // Create file input element
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.multiple = true;
      fileInput.accept = 'image/*,audio/*,video/*,application/pdf';
      
      fileInput.onchange = async (event) => {
        const files = (event.target as HTMLInputElement).files;
        if (!files || files.length === 0) {
          resolve();
          return;
        }

        try {
          const newFiles: MediaFile[] = [];
          
          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            // Validate file
            const validation = validateFile(file);
            if (!validation.valid) {
              console.warn(`File "${file.name}" validation failed: ${validation.error}`);
              continue;
            }
            
            // Convert to base64
            const base64 = await blobToBase64(file);
            const category = getFileTypeCategory(file.type);
            
            // Generate thumbnail for images
            let thumbnail: string | undefined;
            if (category === 'image') {
              thumbnail = await generateImageThumbnail(file);
            }
            
            // Create file object
            const mediaFile: MediaFile = {
              id: `file-${Date.now()}-${i}`,
              name: file.name,
              type: file.type,
              size: file.size,
              sizeFormatted: formatFileSize(file.size),
              category,
              base64,
              thumbnail,
            };
            
            newFiles.push(mediaFile);
          }
          
          setSelectedFiles((prev) => [...prev, ...newFiles]);
          resolve();
        } catch (error) {
          console.error('Error processing files:', error);
          reject(error);
        }
      };
      
      // Trigger file selection
      fileInput.click();
    });
  }, [isFileSupported]);

  // Remove a file from selected files
  const removeFile = useCallback((id: string) => {
    setSelectedFiles((prev) => prev.filter((file) => file.id !== id));
    
    // If removing recorded audio
    if (recordedAudio && recordedAudio.id === id) {
      setRecordedAudio(null);
    }
  }, [recordedAudio]);

  // Clear all files
  const clearFiles = useCallback(() => {
    setSelectedFiles([]);
    setRecordedAudio(null);
  }, []);

  return {
    isRecordingSupported,
    isFileSharingSupported: isFileSupported,
    isRecording,
    recordingTime,
    recordedAudio,
    selectedFiles,
    startAudioRecording,
    stopAudioRecording,
    cancelAudioRecording,
    selectFiles,
    removeFile,
    clearFiles,
  };
}

// Helper function to format recording time
function formatRecordingTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
} 