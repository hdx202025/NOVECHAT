'use client'

import { ArrowLeft, MoreVertical, Send, Search, Pin, Clock, Calendar, FileText, Paperclip, Smile } from 'lucide-react'
import ChatMessage from '@/components/features/ChatMessage'
import MediaControls from '@/components/features/MediaControls'
import TypingIndicator from '@/components/features/TypingIndicator'
import MessageActions from '@/components/features/MessageActions'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useMessages } from '@/hooks/useMessages'
import { formatDistanceToNow } from 'date-fns'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Props = {
  params: { id: string }
}

export default function ChatPage({ params }: Props) {
  const chatId = parseInt(params.id)
  const [newMessage, setNewMessage] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const { messages, loading, error, sendMessage } = useMessages(chatId)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/signin')
      } else {
        setUserId(user.id)
      }
    }
    checkAuth()
  }, [router])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      await sendMessage(newMessage)
      setNewMessage('')
    }
  }

  if (!userId) {
    return <div className="flex items-center justify-center h-screen">Checking authentication...</div>
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>
  }

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
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message.message}
            timestamp={formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
            isOwn={message.sender_id === userId}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="border-t p-4">
        <div className="flex items-center space-x-2">
          <button type="button">
            <Paperclip className="h-6 w-6" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500"
          />
          <button type="button">
            <Smile className="h-6 w-6" />
          </button>
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className={`rounded-full p-2 ${
              newMessage.trim() ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'
            }`}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  )
} 