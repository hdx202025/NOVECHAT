import { useState } from 'react';
import { Bell, Calendar, Clock, X } from 'lucide-react';
import { useRealtime, Message } from '@/contexts/RealtimeContext';

interface MessageReminderProps {
  chatId: number;
  messageId: string;
  onClose: () => void;
}

export default function MessageReminder({ chatId, messageId, onClose }: MessageReminderProps) {
  const { messages, setMessageReminder } = useRealtime();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState('');
  
  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];
  
  // Find the message
  const message = messages[chatId]?.find(msg => msg.id === messageId);
  
  // If message not found, show error
  if (!message) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md">
        <div className="text-red-500">Message not found</div>
        <button
          onClick={onClose}
          className="mt-2 px-4 py-2 bg-gray-200 rounded-lg"
        >
          Close
        </button>
      </div>
    );
  }
  
  // Format message preview
  const formatMessagePreview = (message: Message): string => {
    if (message.isDeleted) {
      return 'This message was deleted';
    }
    
    if (message.mediaType) {
      return `[${message.mediaType.charAt(0).toUpperCase() + message.mediaType.slice(1)}] ${message.text || ''}`;
    }
    
    return message.text || '';
  };
  
  // Handle setting a reminder
  const handleSetReminder = () => {
    try {
      // Validate inputs
      if (!date || !time) {
        setError('Please select both date and time');
        return;
      }
      
      // Create a Date object from the selected date and time
      const reminderDateTime = new Date(`${date}T${time}`);
      
      // Validate that the reminder time is in the future
      if (reminderDateTime.getTime() <= Date.now()) {
        setError('Reminder time must be in the future');
        return;
      }
      
      // Set the reminder
      setMessageReminder(chatId, messageId, reminderDateTime.getTime());
      
      // Close the reminder dialog
      onClose();
    } catch (error) {
      setError((error as Error).message);
    }
  };
  
  // Predefined reminder options
  const reminderOptions = [
    { label: 'In 30 minutes', getValue: () => new Date(Date.now() + 30 * 60 * 1000) },
    { label: 'In 1 hour', getValue: () => new Date(Date.now() + 60 * 60 * 1000) },
    { label: 'Tomorrow', getValue: () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);
      return tomorrow;
    }},
    { label: 'Next week', getValue: () => {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      nextWeek.setHours(9, 0, 0, 0);
      return nextWeek;
    }},
  ];
  
  // Set a predefined reminder
  const setPredefinedReminder = (getDate: () => Date) => {
    const reminderDate = getDate();
    
    // Format date and time for the inputs
    const formattedDate = reminderDate.toISOString().split('T')[0];
    const formattedTime = `${reminderDate.getHours().toString().padStart(2, '0')}:${reminderDate.getMinutes().toString().padStart(2, '0')}`;
    
    setDate(formattedDate);
    setTime(formattedTime);
    setError('');
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium flex items-center">
            <Bell className="w-5 h-5 mr-2 text-yellow-500" />
            Set Reminder
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4">
          {/* Message preview */}
          <div className="mb-4 p-3 bg-gray-100 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Reminder for:</div>
            <div className="text-sm">{formatMessagePreview(message)}</div>
          </div>
          
          {/* Predefined reminder options */}
          <div className="mb-4">
            <div className="text-sm font-medium mb-2">Quick options:</div>
            <div className="grid grid-cols-2 gap-2">
              {reminderOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setPredefinedReminder(option.getValue)}
                  className="py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-left"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Custom date and time selectors */}
          <div className="text-sm font-medium mb-2">Custom reminder:</div>
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
          
          {/* Set reminder button */}
          <button
            onClick={handleSetReminder}
            disabled={!date || !time}
            className={`w-full py-2 rounded-lg flex items-center justify-center ${
              date && time
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Bell className="w-4 h-4 mr-2" />
            Set Reminder
          </button>
        </div>
      </div>
    </div>
  );
} 