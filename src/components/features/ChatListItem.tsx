'use client'

import Link from 'next/link'
import { Globe, Lock, Users } from 'lucide-react'
import { Chat } from '@/contexts/RealtimeContext'

interface ChatListItemProps {
  chat: {
    id: number;
    name: string;
    isGroup: boolean;
    isChannel?: boolean;
    channelType?: 'public' | 'private';
    members: number[];
    avatar?: string;
    lastMessage?: string;
    lastMessageTime?: string;
    unreadCount: number;
    online?: boolean;
  };
  onClick: () => void;
}

export default function ChatListItem({ chat, onClick }: ChatListItemProps) {
  return (
    <div
      onClick={onClick}
      className="p-4 hover:bg-gray-50 cursor-pointer"
    >
      <div className="flex items-center">
        <div className="relative">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            {chat.isChannel ? (
              <Globe className="w-6 h-6 text-primary-blue" />
            ) : chat.isGroup ? (
              <Users className="w-6 h-6 text-primary-blue" />
            ) : (
              <span className="text-lg font-semibold text-gray-700">
                {chat.name.charAt(0)}
              </span>
            )}
          </div>
          {chat.online && !chat.isChannel && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          )}
          {chat.isChannel && chat.channelType === 'private' && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
              <Lock className="w-3 h-3 text-gray-500" />
            </div>
          )}
        </div>
        <div className="ml-3 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h3 className="text-sm font-medium text-gray-900">
                {chat.name}
              </h3>
              {chat.isChannel && (
                <span className="ml-2 px-2 py-0.5 bg-blue-50 text-primary-blue text-xs rounded-full">
                  {chat.channelType === 'public' ? 'Public' : 'Private'} Channel
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500">
              {chat.lastMessageTime}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <p className="text-sm text-gray-500 line-clamp-1">
              {chat.lastMessage || 'No messages'}
            </p>
            {chat.unreadCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-primary-blue rounded-full">
                {chat.unreadCount}
              </span>
            )}
          </div>
          {(chat.isGroup || chat.isChannel) && (
            <div className="mt-1 text-xs text-gray-400 flex items-center">
              <Users className="w-3 h-3 mr-1" />
              {chat.members.length} {chat.isChannel ? 'subscribers' : 'members'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 