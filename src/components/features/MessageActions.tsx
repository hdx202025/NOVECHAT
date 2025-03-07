import { useState } from 'react';
import { Forward, Trash2, Reply, Copy, X, Check, Pin, PinOff, Globe, Clock, Bell, FileText, Bookmark, Archive } from 'lucide-react';
import { useRealtime, Message } from '@/contexts/RealtimeContext';
import MessageTranslator from './MessageTranslator';
import MessageScheduler from './MessageScheduler';
import MessageReminder from './MessageReminder';
import MessageTemplates from './MessageTemplates';
import BookmarksManager from './BookmarksManager';

interface MessageActionsProps {
  message: Message;
  isCurrentUserMessage: boolean;
  onClose: () => void;
}

export default function MessageActions({
  message,
  isCurrentUserMessage,
  onClose,
}: MessageActionsProps) {
  const { 
    chats, 
    forwardMessage, 
    deleteMessage, 
    pinMessage, 
    unpinMessage, 
    saveMessageTemplate,
    bookmarkMessage,
    unbookmarkMessage,
    archiveChat
  } = useRealtime();
  const [showForwardOptions, setShowForwardOptions] = useState(false);
  const [selectedChats, setSelectedChats] = useState<number[]>([]);
  const [showDeleteOptions, setShowDeleteOptions] = useState(false);
  const [showTranslator, setShowTranslator] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [copied, setCopied] = useState(false);

  // Filter out the current chat for forwarding options
  const forwardableChats = chats.filter(chat => chat.id !== message.chatId);

  // Handle forwarding a message
  const handleForward = async () => {
    if (selectedChats.length === 0) return;
    
    await forwardMessage(message.chatId, message.id, selectedChats);
    setShowForwardOptions(false);
    onClose();
  };

  // Handle deleting a message
  const handleDelete = (forEveryone: boolean) => {
    deleteMessage(message.chatId, message.id, forEveryone);
    setShowDeleteOptions(false);
    onClose();
  };

  // Handle copying message text
  const handleCopy = () => {
    if (message.text) {
      navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    onClose();
  };

  // Handle pinning/unpinning a message
  const handlePinToggle = () => {
    if (message.isPinned) {
      unpinMessage(message.chatId, message.id);
    } else {
      pinMessage(message.chatId, message.id);
    }
    onClose();
  };
  
  // Handle saving as template
  const handleSaveAsTemplate = () => {
    setShowTemplates(true);
  };
  
  // Handle template selection
  const handleTemplateSelected = (text: string) => {
    // This would typically be used to insert the template into a message input
    console.log('Template selected:', text);
    onClose();
  };

  // Toggle chat selection for forwarding
  const toggleChatSelection = (chatId: number) => {
    setSelectedChats(prev => 
      prev.includes(chatId)
        ? prev.filter(id => id !== chatId)
        : [...prev, chatId]
    );
  };

  // Handle bookmarking/unbookmarking a message
  const handleBookmarkToggle = () => {
    if (message.isBookmarked) {
      unbookmarkMessage(message.chatId, message.id);
    } else {
      bookmarkMessage(message.chatId, message.id);
    }
    onClose();
  };

  // Handle archiving a chat
  const handleArchiveChat = () => {
    archiveChat(message.chatId);
    onClose();
  };

  // If the message is deleted, only show limited options
  if (message.isDeleted) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4 w-64">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium">Message options</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="text-sm text-gray-500 italic mb-3">
          This message was deleted
        </div>
      </div>
    );
  }

  // Show message translator
  if (showTranslator) {
    return (
      <MessageTranslator 
        message={message}
        onClose={() => setShowTranslator(false)}
      />
    );
  }

  // Show message scheduler
  if (showScheduler) {
    return (
      <MessageScheduler
        chatId={message.chatId}
        initialText={message.text}
        media={message.mediaType ? {
          type: message.mediaType,
          url: message.mediaUrl || '',
          thumbnail: message.mediaThumbnail,
          name: message.mediaName,
          size: message.mediaSize,
        } : undefined}
        onClose={() => setShowScheduler(false)}
        onScheduled={onClose}
      />
    );
  }
  
  // Show message reminder
  if (showReminder) {
    return (
      <MessageReminder
        chatId={message.chatId}
        messageId={message.id}
        onClose={() => setShowReminder(false)}
      />
    );
  }
  
  // Show message templates
  if (showTemplates) {
    return (
      <MessageTemplates
        onSelectTemplate={handleTemplateSelected}
        onClose={() => setShowTemplates(false)}
      />
    );
  }

  // Show forwarding options
  if (showForwardOptions) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4 w-64">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium">Forward to</h3>
          <button 
            onClick={() => setShowForwardOptions(false)} 
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {forwardableChats.length === 0 ? (
          <div className="text-sm text-gray-500 italic">
            No chats available to forward to
          </div>
        ) : (
          <>
            <div className="max-h-48 overflow-y-auto mb-3">
              {forwardableChats.map(chat => (
                <div 
                  key={chat.id}
                  className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
                  onClick={() => toggleChatSelection(chat.id)}
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                    <span className="text-sm font-medium text-gray-700">
                      {chat.isGroup ? 'G' : chat.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{chat.name}</div>
                    <div className="text-xs text-gray-500">
                      {chat.isGroup ? `${chat.members.length} members` : 'Direct message'}
                    </div>
                  </div>
                  {selectedChats.includes(chat.id) && (
                    <Check className="w-4 h-4 text-green-500" />
                  )}
                </div>
              ))}
            </div>
            
            <button
              onClick={handleForward}
              disabled={selectedChats.length === 0}
              className={`w-full py-2 rounded-lg flex items-center justify-center ${
                selectedChats.length > 0
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Forward className="w-4 h-4 mr-1" />
              Forward ({selectedChats.length})
            </button>
          </>
        )}
      </div>
    );
  }

  // Show delete options
  if (showDeleteOptions) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4 w-64">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium">Delete message</h3>
          <button 
            onClick={() => setShowDeleteOptions(false)} 
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="space-y-2">
          <button
            onClick={() => handleDelete(false)}
            className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center"
          >
            <Trash2 className="w-4 h-4 mr-1 text-gray-600" />
            Delete for me
          </button>
          
          {isCurrentUserMessage && (
            <button
              onClick={() => handleDelete(true)}
              className="w-full py-2 bg-red-100 hover:bg-red-200 rounded-lg flex items-center justify-center"
            >
              <Trash2 className="w-4 h-4 mr-1 text-red-600" />
              Delete for everyone
            </button>
          )}
        </div>
      </div>
    );
  }

  // Show bookmarks manager
  if (showBookmarks) {
    return (
      <BookmarksManager
        onClose={() => setShowBookmarks(false)}
        onScrollToMessage={(chatId, messageId) => {
          // Handle scrolling to message
          console.log('Scroll to message:', chatId, messageId);
          setShowBookmarks(false);
          onClose();
        }}
      />
    );
  }

  // Main message actions menu
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-64">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium">Message options</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-2">
        <button
          onClick={() => setShowForwardOptions(true)}
          className="w-full py-2 hover:bg-gray-100 rounded-lg flex items-center"
        >
          <Forward className="w-4 h-4 mr-2 text-blue-500" />
          <span>Forward</span>
        </button>
        
        <button
          onClick={() => setShowDeleteOptions(true)}
          className="w-full py-2 hover:bg-gray-100 rounded-lg flex items-center"
        >
          <Trash2 className="w-4 h-4 mr-2 text-red-500" />
          <span>Delete</span>
        </button>
        
        {message.text && (
          <button
            onClick={handleCopy}
            className="w-full py-2 hover:bg-gray-100 rounded-lg flex items-center"
          >
            <Copy className="w-4 h-4 mr-2 text-gray-500" />
            <span>{copied ? 'Copied!' : 'Copy text'}</span>
          </button>
        )}
        
        <button
          onClick={handlePinToggle}
          className="w-full py-2 hover:bg-gray-100 rounded-lg flex items-center"
        >
          {message.isPinned ? (
            <>
              <PinOff className="w-4 h-4 mr-2 text-gray-500" />
              <span>Unpin message</span>
            </>
          ) : (
            <>
              <Pin className="w-4 h-4 mr-2 text-gray-500" />
              <span>Pin message</span>
            </>
          )}
        </button>
        
        {message.text && (
          <button
            onClick={() => setShowTranslator(true)}
            className="w-full py-2 hover:bg-gray-100 rounded-lg flex items-center"
          >
            <Globe className="w-4 h-4 mr-2 text-green-500" />
            <span>Translate</span>
          </button>
        )}
        
        <button
          onClick={() => setShowReminder(true)}
          className="w-full py-2 hover:bg-gray-100 rounded-lg flex items-center"
        >
          <Bell className="w-4 h-4 mr-2 text-yellow-500" />
          <span>Remind me</span>
        </button>
        
        {isCurrentUserMessage && (
          <button
            onClick={() => setShowScheduler(true)}
            className="w-full py-2 hover:bg-gray-100 rounded-lg flex items-center"
          >
            <Clock className="w-4 h-4 mr-2 text-purple-500" />
            <span>Schedule similar</span>
          </button>
        )}
        
        {message.text && (
          <button
            onClick={handleSaveAsTemplate}
            className="w-full py-2 hover:bg-gray-100 rounded-lg flex items-center"
          >
            <FileText className="w-4 h-4 mr-2 text-blue-500" />
            <span>Save as template</span>
          </button>
        )}
        
        <button
          onClick={handleBookmarkToggle}
          className="w-full py-2 hover:bg-gray-100 rounded-lg flex items-center"
        >
          <Bookmark className={`w-4 h-4 mr-2 ${message.isBookmarked ? 'text-blue-500' : 'text-gray-500'}`} />
          <span>{message.isBookmarked ? 'Remove bookmark' : 'Bookmark'}</span>
        </button>

        <button
          onClick={() => setShowBookmarks(true)}
          className="w-full py-2 hover:bg-gray-100 rounded-lg flex items-center"
        >
          <Bookmark className="w-4 h-4 mr-2 text-blue-500" />
          <span>View bookmarks</span>
        </button>

        <button
          onClick={handleArchiveChat}
          className="w-full py-2 hover:bg-gray-100 rounded-lg flex items-center"
        >
          <Archive className="w-4 h-4 mr-2 text-gray-500" />
          <span>Archive chat</span>
        </button>
        
        <button
          onClick={onClose}
          className="w-full py-2 hover:bg-gray-100 rounded-lg flex items-center"
        >
          <Reply className="w-4 h-4 mr-2 text-gray-500" />
          <span>Reply</span>
        </button>
      </div>
    </div>
  );
} 