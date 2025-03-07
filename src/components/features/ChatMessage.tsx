'use client'

import { useState, useRef, useEffect } from 'react';
import { Check, CheckCheck, File, Image, Music, Video, MoreVertical, Pin } from 'lucide-react';
import { Message } from '@/contexts/RealtimeContext';
import { formatFileSize } from '@/utils/media';
import MessageReactions from './MessageReactions';
import ReadReceipts from './ReadReceipts';
import MessageActions from './MessageActions';
import { useRealtime } from '@/contexts/RealtimeContext';

interface ChatMessageProps {
  message: Message;
  isCurrentUser: boolean;
}

export default function ChatMessage({ message, isCurrentUser }: ChatMessageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const { chats } = useRealtime();
  const actionsRef = useRef<HTMLDivElement>(null);
  
  // Get the chat to determine if it's a group
  const chat = chats.find(c => c.id === message.chatId);
  const isGroup = chat?.isGroup || false;

  // Close actions menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target as Node)) {
        setShowActions(false);
      }
    };

    if (showActions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showActions]);

  // Get status icon based on message status
  const getStatusIcon = () => {
    switch (message.status) {
      case 'sent':
        return <Check className="w-4 h-4 text-gray-500" />;
      case 'delivered':
        return <CheckCheck className="w-4 h-4 text-gray-500" />;
      case 'read':
        return <CheckCheck className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  // Format timestamp to readable time
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  // Get icon for media type
  const getMediaIcon = () => {
    switch (message.mediaType) {
      case 'image':
        return <Image className="w-5 h-5" />;
      case 'audio':
        return <Music className="w-5 h-5" />;
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'document':
        return <File className="w-5 h-5" />;
      default:
        return null;
    }
  };

  // Render media content
  const renderMedia = () => {
    if (!message.mediaType || !message.mediaUrl) return null;

    switch (message.mediaType) {
      case 'image':
        return (
          <div className="mb-1">
            <div 
              className={`relative ${showFullImage ? 'max-w-full' : 'max-w-[240px]'} overflow-hidden rounded-lg cursor-pointer`}
              onClick={() => setShowFullImage(!showFullImage)}
            >
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                  <Image className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <img
                src={message.mediaUrl}
                alt="Image"
                className={`w-full ${imageLoaded ? 'block' : 'hidden'} rounded-lg`}
                onLoad={() => setImageLoaded(true)}
              />
            </div>
          </div>
        );
      case 'audio':
        return (
          <div className="mb-1">
            <div className="flex items-center p-2 bg-white rounded-lg shadow-sm">
              <Music className="w-5 h-5 text-blue-500 mr-2" />
              <div className="flex-1">
                <audio controls className="w-full max-w-[240px]">
                  <source src={message.mediaUrl} type="audio/webm" />
                  Your browser does not support the audio element.
                </audio>
                {message.mediaName && (
                  <div className="text-xs text-gray-500 mt-1">
                    {message.mediaName} {message.mediaSize && `(${formatFileSize(message.mediaSize)})`}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'video':
        return (
          <div className="mb-1">
            <video 
              controls 
              className="max-w-[240px] rounded-lg"
              poster={message.mediaThumbnail}
            >
              <source src={message.mediaUrl} type="video/mp4" />
              Your browser does not support the video element.
            </video>
            {message.mediaName && (
              <div className="text-xs text-gray-500 mt-1">
                {message.mediaName} {message.mediaSize && `(${formatFileSize(message.mediaSize)})`}
              </div>
            )}
          </div>
        );
      case 'document':
        return (
          <div className="mb-1">
            <div className="flex items-center p-2 bg-white rounded-lg shadow-sm">
              <File className="w-5 h-5 text-blue-500 mr-2" />
              <div>
                <a 
                  href={message.mediaUrl} 
                  download={message.mediaName || 'document'}
                  className="text-sm font-medium text-blue-500 hover:underline"
                >
                  {message.mediaName || 'Document'}
                </a>
                {message.mediaSize && (
                  <div className="text-xs text-gray-500">
                    {formatFileSize(message.mediaSize)}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`flex mb-3 group ${
        isCurrentUser ? 'justify-end' : 'justify-start'
      }`}
    >
      <div className="flex flex-col max-w-[70%] relative">
        {/* Message actions button */}
        <button
          onClick={() => setShowActions(!showActions)}
          className={`absolute ${isCurrentUser ? 'left-0' : 'right-0'} -top-4 p-1 rounded-full bg-white shadow opacity-0 group-hover:opacity-100 transition-opacity`}
        >
          <MoreVertical className="w-4 h-4 text-gray-500" />
        </button>
        
        {/* Message actions menu */}
        {showActions && (
          <div 
            ref={actionsRef}
            className={`absolute z-10 ${isCurrentUser ? 'right-0' : 'left-0'} -top-4 transform ${isCurrentUser ? 'translate-y-[-100%]' : 'translate-y-[-100%]'}`}
          >
            <MessageActions 
              message={message}
              isCurrentUserMessage={isCurrentUser}
              onClose={() => setShowActions(false)}
            />
          </div>
        )}
        
        {/* Forwarded message indicator */}
        {message.forwardedFrom && (
          <div className={`text-xs italic mb-1 ${isCurrentUser ? 'text-blue-200' : 'text-gray-500'}`}>
            Forwarded from {message.forwardedFrom.chatName}
          </div>
        )}
        
        {/* Pinned message indicator */}
        {message.isPinned && (
          <div className={`flex items-center text-xs mb-1 ${isCurrentUser ? 'justify-end text-blue-200' : 'justify-start text-gray-500'}`}>
            <Pin className="w-3 h-3 mr-1" />
            <span>Pinned message</span>
          </div>
        )}
        
        <div
          className={`rounded-lg px-3 py-2 ${
            isCurrentUser
              ? 'bg-blue-500 text-white rounded-br-none'
              : 'bg-gray-200 text-gray-800 rounded-bl-none'
          } ${message.isDeleted ? 'italic opacity-75' : ''} ${message.isPinned ? 'border-l-4 border-yellow-400' : ''}`}
        >
          {renderMedia()}
          
          {message.text && <div>{message.text}</div>}
          
          <div
            className={`text-xs mt-1 flex items-center ${
              isCurrentUser ? 'justify-end' : 'justify-start'
            }`}
          >
            <span className={isCurrentUser ? 'text-blue-100' : 'text-gray-500'}>
              {formatTime(message.timestamp)}
            </span>
            
            {isCurrentUser && (
              <span className="ml-1">{getStatusIcon()}</span>
            )}
          </div>
        </div>
        
        {/* Message reactions */}
        <div className={`mt-1 flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
          <MessageReactions 
            chatId={message.chatId}
            messageId={message.id}
            reactions={message.reactions}
            isCurrentUserMessage={isCurrentUser}
          />
          
          {/* Read receipts (only for sender's messages) */}
          {isCurrentUser && message.status === 'read' && (
            <div className="ml-2">
              <ReadReceipts 
                chatId={message.chatId}
                messageId={message.id}
                readBy={message.readBy}
                isGroup={isGroup}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 