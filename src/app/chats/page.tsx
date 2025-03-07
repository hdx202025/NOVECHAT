'use client'

import { useState } from 'react'
import { Search, Edit, Plus, Users, Archive, Globe } from 'lucide-react'
import ChatListItem from '@/components/features/ChatListItem'
import GroupChatCreator from '@/components/features/GroupChatCreator'
import ChannelCreator from '@/components/features/ChannelCreator'
import ArchivedChats from '@/components/features/ArchivedChats'
import { useRealtime } from '@/contexts/RealtimeContext'
import { useRouter } from 'next/navigation'

export default function ChatsPage() {
  const router = useRouter()
  const { chats } = useRealtime()
  const [searchQuery, setSearchQuery] = useState('')
  const [showGroupCreator, setShowGroupCreator] = useState(false)
  const [showChannelCreator, setShowChannelCreator] = useState(false)
  const [showArchivedChats, setShowArchivedChats] = useState(false)

  // Filter chats by search query
  const filteredChats = chats.filter(chat => 
    !chat.isArchived && (
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  // Handle chat selection
  const handleChatSelect = (chatId: number) => {
    router.push(`/chat/${chatId}`)
  }

  // Group chats by type
  const groupedChats = filteredChats.reduce((acc, chat) => {
    if (chat.isChannel) {
      acc.channels.push(chat)
    } else if (chat.isGroup) {
      acc.groups.push(chat)
    } else {
      acc.direct.push(chat)
    }
    return acc
  }, { direct: [], groups: [], channels: [] } as { direct: typeof chats, groups: typeof chats, channels: typeof chats })

  return (
    <div className="min-h-screen bg-background-white">
      {/* Search and actions */}
      <div className="p-4 border-b">
        <div className="relative mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chats..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>
        
        <div className="flex justify-between items-center">
          <button
            onClick={() => setShowArchivedChats(true)}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <Archive className="w-5 h-5 mr-1" />
            Archived
          </button>
          
          <div className="flex space-x-4">
            <button
              onClick={() => setShowChannelCreator(true)}
              className="flex items-center text-primary-blue hover:text-blue-600"
            >
              <Globe className="w-5 h-5 mr-1" />
              New Channel
            </button>
            
            <button
              onClick={() => setShowGroupCreator(true)}
              className="flex items-center text-primary-blue hover:text-blue-600"
            >
              <Users className="w-5 h-5 mr-1" />
              New Group
            </button>
          </div>
        </div>
      </div>

      {/* Chat list */}
      <div className="divide-y">
        {filteredChats.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            {searchQuery
              ? 'No chats match your search'
              : 'No chats available'}
          </div>
        ) : (
          <>
            {/* Channels section */}
            {groupedChats.channels.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-500">Channels</h3>
                </div>
                {groupedChats.channels.map((chat) => (
                  <ChatListItem
                    key={chat.id}
                    chat={chat}
                    onClick={() => handleChatSelect(chat.id)}
                  />
                ))}
              </div>
            )}

            {/* Groups section */}
            {groupedChats.groups.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-500">Groups</h3>
                </div>
                {groupedChats.groups.map((chat) => (
                  <ChatListItem
                    key={chat.id}
                    chat={chat}
                    onClick={() => handleChatSelect(chat.id)}
                  />
                ))}
              </div>
            )}

            {/* Direct messages section */}
            {groupedChats.direct.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-500">Direct Messages</h3>
                </div>
                {groupedChats.direct.map((chat) => (
                  <ChatListItem
                    key={chat.id}
                    chat={chat}
                    onClick={() => handleChatSelect(chat.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating action button for new chat */}
      <button
        onClick={() => router.push('/contacts')}
        className="fixed right-4 bottom-20 w-14 h-14 bg-primary-blue text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
      >
        <Edit className="w-6 h-6" />
      </button>

      {/* Group chat creator modal */}
      {showGroupCreator && (
        <GroupChatCreator onClose={() => setShowGroupCreator(false)} />
      )}

      {/* Channel creator modal */}
      {showChannelCreator && (
        <ChannelCreator onClose={() => setShowChannelCreator(false)} />
      )}

      {/* Archived chats modal */}
      {showArchivedChats && (
        <ArchivedChats
          onClose={() => setShowArchivedChats(false)}
          onChatSelect={handleChatSelect}
        />
      )}
    </div>
  )
} 