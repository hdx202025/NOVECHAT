import { useState } from 'react';
import { Calendar, Clock, X, Send } from 'lucide-react';
import { useRealtime } from '@/contexts/RealtimeContext';

interface MessageSchedulerProps {
  chatId: number;
  initialText?: string;
  media?: {
    type: 'image' | 'audio' | 'video' | 'document';
    url: string;
    thumbnail?: string;
    name?: string;
    size?: number;
  };
  onClose: () => void;
  onScheduled?: () => void;
}

export default function MessageScheduler({
  chatId,
  initialText = '',
  media,
  onClose,
  onScheduled,
}: MessageSchedulerProps) {
  const { scheduleMessage } = useRealtime();
  const [text, setText] = useState(initialText);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState('');
  
  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];
  
  // Handle scheduling a message
  const handleSchedule = async () => {
    try {
      // Validate inputs
      if (!date || !time) {
        setError('Please select both date and time');
        return;
      }
      
      // Create a Date object from the selected date and time
      const scheduledDateTime = new Date(`${date}T${time}`);
      
      // Validate that the scheduled time is in the future
      if (scheduledDateTime.getTime() <= Date.now()) {
        setError('Scheduled time must be in the future');
        return;
      }
      
      // Schedule the message
      await scheduleMessage(chatId, text, scheduledDateTime.getTime(), media);
      
      // Call the onScheduled callback if provided
      if (onScheduled) {
        onScheduled();
      }
      
      // Close the scheduler
      onClose();
    } catch (error) {
      setError((error as Error).message);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium">Schedule Message</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4">
          {/* Message input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your message..."
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
            />
          </div>
          
          {/* Media preview if available */}
          {media && (
            <div className="mb-4 p-2 bg-gray-100 rounded-lg">
              <div className="text-sm font-medium">
                {media.type.charAt(0).toUpperCase() + media.type.slice(1)} attachment
              </div>
              {media.name && (
                <div className="text-xs text-gray-500">{media.name}</div>
              )}
            </div>
          )}
          
          {/* Date and time selectors */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={today}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Clock className="w-4 h-4 inline mr-1" />
                Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          {/* Error message */}
          {error && (
            <div className="mb-4 text-sm text-red-500">{error}</div>
          )}
          
          {/* Schedule button */}
          <button
            onClick={handleSchedule}
            disabled={!text.trim() || !date || !time}
            className={`w-full py-2 rounded-lg flex items-center justify-center ${
              text.trim() && date && time
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4 mr-2" />
            Schedule Message
          </button>
        </div>
      </div>
    </div>
  );
} 