import { useState } from 'react';
import { Clock, ChevronDown, ChevronUp, X, Calendar } from 'lucide-react';
import { useRealtime, Message } from '@/contexts/RealtimeContext';

interface ScheduledMessagesProps {
  chatId: number;
}

export default function ScheduledMessages({ chatId }: ScheduledMessagesProps) {
  const { getScheduledMessages, cancelScheduledMessage } = useRealtime();
  const [expanded, setExpanded] = useState(false);
  
  // Get scheduled messages for this chat
  const scheduledMessages = getScheduledMessages(chatId);
  
  // If there are no scheduled messages, don't render anything
  if (scheduledMessages.length === 0) {
    return null;
  }
  
  // Format message preview text
  const formatMessagePreview = (message: Message): string => {
    if (message.mediaType) {
      return `[${message.mediaType.charAt(0).toUpperCase() + message.mediaType.slice(1)}] ${message.text || ''}`;
    }
    
    return message.text || '';
  };
  
  // Format scheduled time
  const formatScheduledTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.getDate() === now.getDate() && 
                    date.getMonth() === now.getMonth() && 
                    date.getFullYear() === now.getFullYear();
    
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    
    if (isToday) {
      return `Today at ${timeString}`;
    }
    
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isTomorrow = date.getDate() === tomorrow.getDate() && 
                       date.getMonth() === tomorrow.getMonth() && 
                       date.getFullYear() === tomorrow.getFullYear();
    
    if (isTomorrow) {
      return `Tomorrow at ${timeString}`;
    }
    
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    };
    
    return date.toLocaleDateString('en-US', options);
  };
  
  // Handle canceling a scheduled message
  const handleCancel = (messageId: string) => {
    cancelScheduledMessage(chatId, messageId);
  };
  
  // Collapsed view (just shows count)
  if (!expanded) {
    return (
      <div className="bg-purple-50 border-l-4 border-purple-500 p-2 mb-2">
        <div className="flex items-center">
          <button
            onClick={() => setExpanded(true)}
            className="flex items-center flex-1 text-left"
          >
            <Clock className="w-4 h-4 text-purple-500 mr-2" />
            <div className="flex-1">
              <div className="text-xs text-purple-700 font-medium">
                {scheduledMessages.length} scheduled {scheduledMessages.length === 1 ? 'message' : 'messages'}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
    );
  }
  
  // Expanded view (shows all scheduled messages)
  return (
    <div className="bg-purple-50 border-l-4 border-purple-500 p-2 mb-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Clock className="w-4 h-4 text-purple-500 mr-2" />
          <span className="text-xs text-purple-700 font-medium">
            {scheduledMessages.length} scheduled {scheduledMessages.length === 1 ? 'message' : 'messages'}
          </span>
        </div>
        <button
          onClick={() => setExpanded(false)}
          className="p-1 text-gray-500 hover:text-gray-700"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-2">
        {scheduledMessages.map(message => (
          <div 
            key={message.id}
            className="p-2 bg-white rounded-lg"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="text-sm text-gray-700">
                  {formatMessagePreview(message)}
                </div>
                <div className="text-xs text-gray-500 mt-1 flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatScheduledTime(message.scheduledFor || 0)}
                </div>
              </div>
              <button
                onClick={() => handleCancel(message.id)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 