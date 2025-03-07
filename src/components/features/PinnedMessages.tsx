import { useState } from 'react';
import { Pin, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useRealtime, Message } from '@/contexts/RealtimeContext';

interface PinnedMessagesProps {
  chatId: number;
  onScrollToMessage?: (messageId: string) => void;
}

export default function PinnedMessages({ chatId, onScrollToMessage }: PinnedMessagesProps) {
  const { getPinnedMessages, unpinMessage } = useRealtime();
  const [expanded, setExpanded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Get pinned messages for this chat
  const pinnedMessages = getPinnedMessages(chatId);
  
  // If there are no pinned messages, don't render anything
  if (pinnedMessages.length === 0) {
    return null;
  }
  
  // Get the current pinned message to display
  const currentMessage = pinnedMessages[currentIndex];
  
  // Format message preview text
  const formatMessagePreview = (message: Message): string => {
    if (message.isDeleted) {
      return 'This message was deleted';
    }
    
    if (message.mediaType) {
      return `[${message.mediaType.charAt(0).toUpperCase() + message.mediaType.slice(1)}] ${message.text || ''}`;
    }
    
    return message.text || '';
  };
  
  // Navigate to previous pinned message
  const goToPrevious = () => {
    setCurrentIndex(prev => (prev === 0 ? pinnedMessages.length - 1 : prev - 1));
  };
  
  // Navigate to next pinned message
  const goToNext = () => {
    setCurrentIndex(prev => (prev === pinnedMessages.length - 1 ? 0 : prev + 1));
  };
  
  // Handle unpinning a message
  const handleUnpin = (e: React.MouseEvent, messageId: string) => {
    e.stopPropagation();
    unpinMessage(chatId, messageId);
    
    // If this was the last pinned message, we're done
    if (pinnedMessages.length === 1) {
      return;
    }
    
    // Otherwise, adjust the current index if needed
    if (currentIndex >= pinnedMessages.length - 1) {
      setCurrentIndex(pinnedMessages.length - 2);
    }
  };
  
  // Handle clicking on a pinned message to scroll to it
  const handleClick = () => {
    if (onScrollToMessage) {
      onScrollToMessage(currentMessage.id);
    }
  };
  
  // Collapsed view (just shows count and current message)
  if (!expanded) {
    return (
      <div className="bg-blue-50 border-l-4 border-blue-500 p-2 mb-2">
        <div className="flex items-center">
          <button
            onClick={() => setExpanded(true)}
            className="flex items-center flex-1 text-left"
          >
            <Pin className="w-4 h-4 text-blue-500 mr-2" />
            <div className="flex-1">
              <div className="text-xs text-blue-700 font-medium">
                {pinnedMessages.length} pinned {pinnedMessages.length === 1 ? 'message' : 'messages'}
              </div>
              <div className="text-sm text-gray-700 truncate">
                {formatMessagePreview(currentMessage)}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
    );
  }
  
  // Expanded view (shows navigation between pinned messages)
  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-2 mb-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Pin className="w-4 h-4 text-blue-500 mr-2" />
          <span className="text-xs text-blue-700 font-medium">
            {pinnedMessages.length} pinned {pinnedMessages.length === 1 ? 'message' : 'messages'}
          </span>
        </div>
        <div className="flex items-center">
          <button
            onClick={goToPrevious}
            className="p-1 text-gray-500 hover:text-gray-700"
            disabled={pinnedMessages.length <= 1}
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <span className="text-xs mx-1">
            {currentIndex + 1}/{pinnedMessages.length}
          </span>
          <button
            onClick={goToNext}
            className="p-1 text-gray-500 hover:text-gray-700"
            disabled={pinnedMessages.length <= 1}
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            onClick={() => setExpanded(false)}
            className="p-1 ml-2 text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div 
        className="p-2 bg-white rounded-lg cursor-pointer hover:bg-gray-50"
        onClick={handleClick}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="text-sm text-gray-700">
              {formatMessagePreview(currentMessage)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              From: {currentMessage.senderId === 1 ? 'You' : `User ${currentMessage.senderId}`}
            </div>
          </div>
          <button
            onClick={(e) => handleUnpin(e, currentMessage.id)}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
} 