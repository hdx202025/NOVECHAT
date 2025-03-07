import { useState, useEffect } from 'react';
import { Search, X, ArrowUp, ArrowDown } from 'lucide-react';
import { useRealtime, Message } from '@/contexts/RealtimeContext';

interface MessageSearchProps {
  chatId: number;
  onScrollToMessage?: (messageId: string) => void;
  onClose: () => void;
}

export default function MessageSearch({ chatId, onScrollToMessage, onClose }: MessageSearchProps) {
  const { searchMessages } = useRealtime();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Message[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Search for messages when the query changes
  useEffect(() => {
    if (query.trim().length >= 2) {
      const searchResults = searchMessages(chatId, query);
      setResults(searchResults);
      setCurrentIndex(0);
    } else {
      setResults([]);
    }
  }, [query, chatId, searchMessages]);
  
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
  
  // Navigate to previous result
  const goToPrevious = () => {
    if (results.length === 0) return;
    setCurrentIndex(prev => (prev === 0 ? results.length - 1 : prev - 1));
    
    if (onScrollToMessage && results.length > 0) {
      onScrollToMessage(results[currentIndex === 0 ? results.length - 1 : currentIndex - 1].id);
    }
  };
  
  // Navigate to next result
  const goToNext = () => {
    if (results.length === 0) return;
    setCurrentIndex(prev => (prev === results.length - 1 ? 0 : prev + 1));
    
    if (onScrollToMessage && results.length > 0) {
      onScrollToMessage(results[currentIndex === results.length - 1 ? 0 : currentIndex + 1].id);
    }
  };
  
  // Handle clicking on a search result
  const handleResultClick = (messageId: string) => {
    if (onScrollToMessage) {
      onScrollToMessage(messageId);
    }
  };
  
  // Clear search
  const clearSearch = () => {
    setQuery('');
    setResults([]);
  };
  
  return (
    <div className="bg-white border-b border-gray-200 p-2">
      <div className="flex items-center mb-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-500" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search in conversation..."
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>
        <button
          onClick={onClose}
          className="ml-2 p-2 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      {results.length > 0 && (
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">
              {results.length} {results.length === 1 ? 'result' : 'results'}
            </span>
            <div className="flex items-center">
              <button
                onClick={goToPrevious}
                className="p-1 text-gray-500 hover:text-gray-700"
                disabled={results.length <= 1}
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <span className="text-xs mx-1">
                {currentIndex + 1}/{results.length}
              </span>
              <button
                onClick={goToNext}
                className="p-1 text-gray-500 hover:text-gray-700"
                disabled={results.length <= 1}
              >
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="max-h-48 overflow-y-auto">
            {results.map((message, index) => (
              <div
                key={message.id}
                className={`p-2 rounded-lg cursor-pointer ${
                  index === currentIndex ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => handleResultClick(message.id)}
              >
                <div className="text-sm text-gray-700">
                  {formatMessagePreview(message)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  From: {message.senderId === 1 ? 'You' : `User ${message.senderId}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {query.trim().length >= 2 && results.length === 0 && (
        <div className="text-sm text-gray-500 text-center py-2">
          No messages found matching "{query}"
        </div>
      )}
    </div>
  );
} 