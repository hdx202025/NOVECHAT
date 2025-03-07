import { useState } from 'react';
import { Archive, X, Search, MessageCircle } from 'lucide-react';
import { useRealtime, Chat } from '@/contexts/RealtimeContext';

interface ArchivedChatsProps {
  onClose: () => void;
  onChatSelect?: (chatId: number) => void;
}

export default function ArchivedChats({ onClose, onChatSelect }: ArchivedChatsProps) {
  const { getArchivedChats, unarchiveChat } = useRealtime();
  const [searchQuery, setSearchQuery] = useState('');

  // Get archived chats
  const archivedChats = getArchivedChats();

  // Filter chats by search query
  const filteredChats = archivedChats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format timestamp
  const formatTimestamp = (timestamp?: number): string => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit'
      });
    }
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  // Handle unarchiving a chat
  const handleUnarchive = (chatId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    unarchiveChat(chatId);
  };

  // Handle selecting a chat
  const handleChatSelect = (chatId: number) => {
    onChatSelect?.(chatId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium flex items-center">
            <Archive className="w-5 h-5 text-gray-500 mr-2" />
            Archived Chats
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search archived chats..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              {searchQuery
                ? 'No archived chats match your search'
                : 'No archived chats'}
            </div>
          ) : (
            <div className="divide-y">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => handleChatSelect(chat.id)}
                  className="p-4 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-start">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-lg font-semibold text-gray-700">
                          {chat.isGroup ? 'G' : chat.name.charAt(0)}
                        </span>
                      </div>
                      {chat.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>

                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900">
                          {chat.name}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(chat.archivedAt)}
                        </span>
                      </div>

                      <div className="mt-1 flex items-center justify-between">
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {chat.lastMessage || 'No messages'}
                        </p>
                        <button
                          onClick={(e) => handleUnarchive(chat.id, e)}
                          className="text-blue-500 hover:text-blue-600 text-sm"
                        >
                          Unarchive
                        </button>
                      </div>

                      {chat.isGroup && (
                        <div className="mt-1 text-xs text-gray-400">
                          {chat.members.length} members
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 