'use client'

import { ArrowLeft, MoreVertical, Send, Search, Pin, Clock, Calendar, FileText, Paperclip, Smile } from 'lucide-react'
import ChatMessage from '@/components/features/ChatMessage'
import MediaControls from '@/components/features/MediaControls'
import TypingIndicator from '@/components/features/TypingIndicator'
import MessageActions from '@/components/features/MessageActions'
import { useState } from 'react'
import Link from 'next/link'

type Props = {
  params: { id: string }
}

export default function ChatPage({ params }: Props) {
  const chatId = parseInt(params.id)
  const [newMessage, setNewMessage] = useState('')
  const [showSearch, setShowSearch] = useState(false)

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <Link href="/chats" className="mr-4">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h2 className="font-semibold">Chat {chatId}</h2>
            <p className="text-sm text-gray-500">Online</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={() => setShowSearch(!showSearch)}>
            <Search className="h-6 w-6" />
          </button>
          <button>
            <MoreVertical className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <ChatMessage 
          message="Hello! How are you?"
          timestamp="10:30 AM"
          isOwn={false}
        />
        <ChatMessage 
          message="I'm good, thanks! How about you?"
          timestamp="10:31 AM"
          isOwn={true}
        />
      </div>

      {/* Input Area */}
      <div className="border-t p-4">
        <div className="flex items-center space-x-2">
          <button>
            <Paperclip className="h-6 w-6" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500"
          />
          <button>
            <Smile className="h-6 w-6" />
          </button>
          <button className="bg-blue-500 text-white rounded-full p-2">
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
} 