import { useState } from 'react';
import { Eye } from 'lucide-react';
import { useRealtime } from '@/contexts/RealtimeContext';
import { Chat } from '@/contexts/RealtimeContext';

interface ReadReceiptsProps {
  chatId: number;
  messageId: string;
  readBy?: number[];
  isGroup: boolean;
}

export default function ReadReceipts({
  chatId,
  messageId,
  readBy = [],
  isGroup,
}: ReadReceiptsProps) {
  const { chats, getReadReceipts } = useRealtime();
  const [showReadBy, setShowReadBy] = useState(false);

  // Get the current chat
  const chat = chats.find((c) => c.id === chatId);
  
  if (!chat) return null;

  // For group chats, show how many people have read the message
  const readCount = readBy.length;
  
  // Get user names who have read the message
  const getReadByNames = (): string[] => {
    if (!chat.isGroup) return [];
    
    return readBy.map((userId) => {
      const member = chat.members.find((m) => m === userId);
      return member ? `User ${member}` : 'Unknown user';
    });
  };

  const readByNames = getReadByNames();

  // Don't show anything if no one has read the message
  if (readCount === 0) return null;

  return (
    <div className="relative">
      {/* Read receipt indicator */}
      <button
        onClick={() => isGroup && setShowReadBy(!showReadBy)}
        className={`text-xs text-gray-500 flex items-center ${isGroup ? 'cursor-pointer hover:text-gray-700' : 'cursor-default'}`}
      >
        <Eye className="w-3 h-3 mr-1" />
        {isGroup ? `${readCount} read` : 'Read'}
      </button>

      {/* Read by list for group chats */}
      {showReadBy && isGroup && readByNames.length > 0 && (
        <div className="absolute bottom-6 right-0 bg-white rounded-lg shadow-md p-2 z-10 min-w-[150px]">
          <div className="text-xs font-medium mb-1">Read by:</div>
          <ul className="text-xs">
            {readByNames.map((name, index) => (
              <li key={index} className="py-1 border-b border-gray-100 last:border-0">
                {name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 