import { useState, useEffect } from 'react';
import { Mic, MicOff, Paperclip, X, Send, Image, File, Music, Video } from 'lucide-react';
import useMedia from '@/hooks/useMedia';
import { formatFileSize } from '@/utils/media';

interface MediaControlsProps {
  onSendMedia: (
    text: string,
    media: {
      type: 'image' | 'audio' | 'video' | 'document';
      url: string;
      thumbnail?: string;
      name?: string;
      size?: number;
    }
  ) => void;
}

export default function MediaControls({ onSendMedia }: MediaControlsProps) {
  const {
    isRecordingSupported,
    isFileSharingSupported,
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
  } = useMedia();

  const [captionText, setCaptionText] = useState('');
  const [showMediaPreview, setShowMediaPreview] = useState(false);

  // Show media preview when files are selected or audio is recorded
  useEffect(() => {
    if (selectedFiles.length > 0 || recordedAudio) {
      setShowMediaPreview(true);
    } else {
      setShowMediaPreview(false);
    }
  }, [selectedFiles, recordedAudio]);

  // Handle recording start
  const handleStartRecording = async () => {
    try {
      await startAudioRecording();
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Could not start recording. Please check your microphone permissions.');
    }
  };

  // Handle recording stop
  const handleStopRecording = async () => {
    try {
      await stopAudioRecording();
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  // Handle file selection
  const handleSelectFiles = async () => {
    try {
      await selectFiles();
    } catch (error) {
      console.error('Failed to select files:', error);
      alert('Could not select files. Please try again.');
    }
  };

  // Handle sending media
  const handleSendMedia = () => {
    // Send recorded audio
    if (recordedAudio) {
      onSendMedia(captionText, {
        type: recordedAudio.category,
        url: recordedAudio.base64,
        name: recordedAudio.name,
        size: recordedAudio.size,
      });
    }
    // Send selected files
    else if (selectedFiles.length > 0) {
      // For simplicity, we'll just send the first file
      const file = selectedFiles[0];
      onSendMedia(captionText, {
        type: file.category,
        url: file.base64,
        thumbnail: file.thumbnail,
        name: file.name,
        size: file.size,
      });
    }

    // Clear everything
    setCaptionText('');
    clearFiles();
  };

  // Format recording time
  const formatRecordingTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Get icon for file type
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <Image className="w-5 h-5" />;
    } else if (type.startsWith('audio/')) {
      return <Music className="w-5 h-5" />;
    } else if (type.startsWith('video/')) {
      return <Video className="w-5 h-5" />;
    } else {
      return <File className="w-5 h-5" />;
    }
  };

  return (
    <div className="w-full">
      {/* Media preview */}
      {showMediaPreview && (
        <div className="p-3 bg-gray-100 border-t border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium">Media Attachment</h4>
            <button
              onClick={() => {
                clearFiles();
                setCaptionText('');
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Recorded audio preview */}
            {recordedAudio && (
              <div className="relative flex items-center p-2 bg-white rounded-lg shadow-sm">
                <Music className="w-5 h-5 text-blue-500 mr-2" />
                <div>
                  <div className="text-sm font-medium">{recordedAudio.name}</div>
                  <div className="text-xs text-gray-500">{recordedAudio.sizeFormatted}</div>
                </div>
                <button
                  onClick={() => removeFile(recordedAudio.id)}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Selected files preview */}
            {selectedFiles.map((file) => (
              <div
                key={file.id}
                className="relative flex items-center p-2 bg-white rounded-lg shadow-sm"
              >
                {file.thumbnail ? (
                  <img
                    src={file.thumbnail}
                    alt={file.name}
                    className="w-10 h-10 object-cover rounded mr-2"
                  />
                ) : (
                  <div className="mr-2">{getFileIcon(file.type)}</div>
                )}
                <div>
                  <div className="text-sm font-medium truncate max-w-[150px]">{file.name}</div>
                  <div className="text-xs text-gray-500">{file.sizeFormatted}</div>
                </div>
                <button
                  onClick={() => removeFile(file.id)}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Caption input */}
          <div className="mt-2">
            <input
              type="text"
              value={captionText}
              onChange={(e) => setCaptionText(e.target.value)}
              placeholder="Add a caption..."
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Send button */}
          <div className="mt-2 flex justify-end">
            <button
              onClick={handleSendMedia}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center"
            >
              <Send className="w-4 h-4 mr-1" />
              Send
            </button>
          </div>
        </div>
      )}

      {/* Recording UI */}
      {isRecording && !showMediaPreview && (
        <div className="p-3 bg-gray-100 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-sm font-medium">Recording {formatRecordingTime(recordingTime)}</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={cancelAudioRecording}
                className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={handleStopRecording}
                className="p-2 bg-blue-500 rounded-full hover:bg-blue-600"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media controls */}
      {!isRecording && !showMediaPreview && (
        <div className="flex items-center space-x-2 p-2">
          {isRecordingSupported && (
            <button
              onClick={handleStartRecording}
              className="p-2 text-gray-500 hover:text-blue-500 focus:outline-none"
            >
              <Mic className="w-5 h-5" />
            </button>
          )}

          {isFileSharingSupported && (
            <button
              onClick={handleSelectFiles}
              className="p-2 text-gray-500 hover:text-blue-500 focus:outline-none"
            >
              <Paperclip className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
} 