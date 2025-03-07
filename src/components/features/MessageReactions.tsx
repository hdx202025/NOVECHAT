import { useState } from 'react';
import { Smile, X } from 'lucide-react';
import { useRealtime } from '@/contexts/RealtimeContext';

// Common emoji reactions
const COMMON_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '👏', '🎉', '🙏'];

interface MessageReactionsProps {
  chatId: number;
  messageId: string;
  reactions?: Record<number, string>;
  isCurrentUserMessage: boolean;
}

export default function MessageReactions({
  chatId,
  messageId,
  reactions = {},
  isCurrentUserMessage,
}: MessageReactionsProps) {
  const { addReaction, removeReaction, currentUser } = useRealtime();
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  // Get all unique reactions
  const uniqueReactions = Object.values(reactions).reduce<Record<string, number>>(
    (acc, emoji) => {
      acc[emoji] = (acc[emoji] || 0) + 1;
      return acc;
    },
    {}
  );

  // Check if current user has reacted
  const currentUserReaction = reactions[currentUser.id];

  // Handle adding a reaction
  const handleAddReaction = (emoji: string) => {
    addReaction(chatId, messageId, emoji);
    setShowReactionPicker(false);
  };

  // Handle removing a reaction
  const handleRemoveReaction = () => {
    removeReaction(chatId, messageId);
  };

  return (
    <div className="relative">
      {/* Reaction button */}
      {!isCurrentUserMessage && (
        <button
          onClick={() => setShowReactionPicker(!showReactionPicker)}
          className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
        >
          <Smile className="w-4 h-4" />
        </button>
      )}

      {/* Reaction picker */}
      {showReactionPicker && (
        <div className="absolute bottom-8 left-0 bg-white rounded-lg shadow-md p-2 z-10">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs text-gray-500">Quick reactions</span>
            <button
              onClick={() => setShowReactionPicker(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {COMMON_REACTIONS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleAddReaction(emoji)}
                className="text-xl hover:bg-gray-100 p-1 rounded"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Display reactions */}
      {Object.keys(uniqueReactions).length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {Object.entries(uniqueReactions).map(([emoji, count]) => (
            <button
              key={emoji}
              onClick={() => {
                if (currentUserReaction === emoji) {
                  handleRemoveReaction();
                } else {
                  handleAddReaction(emoji);
                }
              }}
              className={`text-xs rounded-full px-2 py-0.5 flex items-center ${
                currentUserReaction === emoji
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <span className="mr-1">{emoji}</span>
              {count > 1 && <span>{count}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 