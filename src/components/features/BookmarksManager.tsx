import { useState, useMemo } from 'react';
import { Bookmark, Plus, X, Edit2, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { useRealtime, Message, BookmarkCategory } from '@/contexts/RealtimeContext';

interface BookmarksManagerProps {
  onClose: () => void;
  onScrollToMessage?: (chatId: number, messageId: string) => void;
}

export default function BookmarksManager({ onClose, onScrollToMessage }: BookmarksManagerProps) {
  const { 
    getBookmarkedMessages, 
    getBookmarkCategories,
    unbookmarkMessage,
    updateBookmarkNote,
    updateBookmarkCategory,
    createBookmarkCategory,
    deleteBookmarkCategory
  } = useRealtime();

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#2196F3');
  const [editingNote, setEditingNote] = useState<{ messageId: string; chatId: number } | null>(null);
  const [noteText, setNoteText] = useState('');

  // Get all bookmarked messages and categories
  const bookmarkedMessages = getBookmarkedMessages();
  const categories = getBookmarkCategories();

  // Filter messages by selected category
  const filteredMessages = useMemo(() => {
    if (!selectedCategory) return bookmarkedMessages;
    return bookmarkedMessages.filter(({ message }) => 
      message.bookmarkCategory === selectedCategory
    );
  }, [bookmarkedMessages, selectedCategory]);

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

  // Format timestamp
  const formatTimestamp = (timestamp: number): string => {
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
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  // Handle creating a new category
  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) return;
    
    const categoryId = createBookmarkCategory(newCategoryName.trim(), newCategoryColor);
    setSelectedCategory(categoryId);
    setShowCategoryForm(false);
    setNewCategoryName('');
  };

  // Handle removing a bookmark
  const handleRemoveBookmark = (chatId: number, messageId: string) => {
    unbookmarkMessage(chatId, messageId);
  };

  // Handle updating a note
  const handleUpdateNote = (chatId: number, messageId: string) => {
    if (!noteText.trim()) return;
    
    updateBookmarkNote(chatId, messageId, noteText.trim());
    setEditingNote(null);
    setNoteText('');
  };

  // Handle changing category
  const handleChangeCategory = (chatId: number, messageId: string, categoryId: string) => {
    updateBookmarkCategory(chatId, messageId, categoryId);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium flex items-center">
            <Bookmark className="w-5 h-5 text-blue-500 mr-2" />
            Bookmarked Messages
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Categories</h3>
            <button 
              onClick={() => setShowCategoryForm(!showCategoryForm)}
              className="text-blue-500 hover:text-blue-600"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {showCategoryForm && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Category name"
                className="w-full p-2 border border-gray-300 rounded-lg mb-2"
              />
              <div className="flex items-center justify-between">
                <input
                  type="color"
                  value={newCategoryColor}
                  onChange={(e) => setNewCategoryColor(e.target.value)}
                  className="w-8 h-8 rounded-full"
                />
                <button
                  onClick={handleCreateCategory}
                  disabled={!newCategoryName.trim()}
                  className="px-3 py-1 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
                >
                  Create
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-3 py-1 rounded-lg text-sm ${
                !selectedCategory 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1 rounded-lg text-sm flex items-center ${
                  selectedCategory === category.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={{ 
                  backgroundColor: selectedCategory === category.id 
                    ? undefined 
                    : category.color + '20'
                }}
              >
                <span 
                  className="w-2 h-2 rounded-full mr-1"
                  style={{ backgroundColor: category.color }}
                />
                {category.name}
                {selectedCategory === category.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteBookmarkCategory(category.id);
                      setSelectedCategory('');
                    }}
                    className="ml-2 text-white hover:text-gray-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Bookmarked messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredMessages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No bookmarked messages found
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMessages.map(({ message, chatName }) => (
                <div 
                  key={message.id}
                  className="bg-white border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {chatName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatTimestamp(message.timestamp)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleRemoveBookmark(message.chatId, message.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div 
                    className="text-gray-700 mb-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    onClick={() => onScrollToMessage?.(message.chatId, message.id)}
                  >
                    {formatMessagePreview(message)}
                  </div>

                  {/* Note */}
                  {editingNote?.messageId === message.id ? (
                    <div className="mt-2">
                      <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Add a note..."
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                        rows={2}
                      />
                      <div className="flex justify-end mt-1 space-x-2">
                        <button
                          onClick={() => {
                            setEditingNote(null);
                            setNoteText('');
                          }}
                          className="px-2 py-1 text-sm text-gray-500 hover:text-gray-700"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleUpdateNote(message.chatId, message.id)}
                          className="px-2 py-1 text-sm bg-blue-500 text-white rounded"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 flex items-start justify-between">
                      <div className="flex-1">
                        {message.bookmarkNote ? (
                          <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                            {message.bookmarkNote}
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingNote({ messageId: message.id, chatId: message.chatId });
                              setNoteText(message.bookmarkNote || '');
                            }}
                            className="text-sm text-gray-400 hover:text-gray-600"
                          >
                            Add note...
                          </button>
                        )}
                      </div>
                      {message.bookmarkNote && (
                        <button
                          onClick={() => {
                            setEditingNote({ messageId: message.id, chatId: message.chatId });
                            setNoteText(message.bookmarkNote || '');
                          }}
                          className="ml-2 text-gray-400 hover:text-gray-600"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Category selector */}
                  <div className="mt-2 flex items-center">
                    <Tag className="w-4 h-4 text-gray-400 mr-1" />
                    <select
                      value={message.bookmarkCategory || ''}
                      onChange={(e) => handleChangeCategory(message.chatId, message.id, e.target.value)}
                      className="text-sm border-none bg-transparent text-gray-600 focus:outline-none focus:ring-0"
                    >
                      <option value="">No category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
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