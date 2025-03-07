'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft, MoreVertical, Send, Search, Pin, Clock, Calendar, FileText, Paperclip, Smile, Template } from 'lucide-react'
import ChatMessage from '@/components/features/ChatMessage'
import MediaControls from '@/components/features/MediaControls'
import TypingIndicator from '@/components/features/TypingIndicator'
import PinnedMessages from '@/components/features/PinnedMessages'
import ScheduledMessages from '@/components/features/ScheduledMessages'
import MessageSearch from '@/components/features/MessageSearch'
import MessageScheduler from '@/components/features/MessageScheduler'
import MessageTemplates from '@/components/features/MessageTemplates'
import { useRealtime, Message } from '@/contexts/RealtimeContext'
import Header from '@/components/layout/Header'
import { useParams } from 'next/navigation'

export default function ChatPage() {
  const { id } = useParams()
  const chatId = parseInt(id as string)
  const [newMessage, setNewMessage] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [showScheduler, setShowScheduler] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const { chats, messages, currentUser, sendMessage, markAsRead, setTyping, getTypingUsers, getPinnedMessages } = useRealtime()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messageRefs = useRef<Record<string, HTMLDivElement>>({})
  
  // Find the current chat
  const currentChat = chats.find(chat => chat.id === chatId)
  
  // Get messages for this chat
  const chatMessages = messages[chatId] || []
  
  // Get typing users
  const typingUsers = getTypingUsers(chatId)
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])
  
  // Mark unread messages as read
  useEffect(() => {
    if (currentChat?.unreadCount && currentChat.unreadCount > 0) {
      // Find unread messages
      const unreadMessages = chatMessages
        .filter(msg => msg.senderId !== currentUser.id && msg.status !== 'read')
        .map(msg => msg.id)
      
      // Mark each message as read
      unreadMessages.forEach(messageId => {
        markAsRead(chatId, messageId)
      })
    }
  }, [chatId, chatMessages, currentChat, currentUser.id, markAsRead])

  // Handle sending a text message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      await sendMessage(chatId, newMessage)
      setNewMessage('')
      // Clear typing indicator when sending a message
      setTyping(chatId, false)
    }
  }

  // Handle sending a media message
  const handleSendMedia = async (text: string, media: {
    type: 'image' | 'audio' | 'video' | 'document';
    url: string;
    thumbnail?: string;
    name?: string;
    size?: number;
  }) => {
    await sendMessage(chatId, text, media)
    // Clear typing indicator when sending a message
    setTyping(chatId, false)
  }
  
  // Handle typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setNewMessage(value)
    
    // Set typing indicator when user is typing
    if (value.trim()) {
      setTyping(chatId, true)
    } else {
      setTyping(chatId, false)
    }
  }
  
  // Scroll to a specific message
  const scrollToMessage = (messageId: string) => {
    const messageElement = messageRefs.current[messageId]
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      
      // Highlight the message briefly
      messageElement.classList.add('bg-blue-100')
      setTimeout(() => {
        messageElement.classList.remove('bg-blue-100')
      }, 2000)
    }
  }
  
  // Handle template selection
  const handleTemplateSelected = (text: string) => {
    setNewMessage(text)
    setShowTemplates(false)
  }

  if (!currentChat) {
    return (
      <div className="min-h-screen bg-background-white flex flex-col items-center justify-center">
        <p className="text-text-dark">Chat not found</p>
        <Link href="/chats" className="mt-4 text-primary-blue">
          Back to chats
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <Link href="/chats" className="mr-2 hover:scale-110 transition-transform duration-300">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3 hover:bg-gray-200 transition-colors duration-300">
              <span className="text-lg font-semibold text-gray-700">
                {currentChat.isGroup ? 'G' : currentChat.name.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="font-semibold hover:text-primary-blue transition-colors duration-300">{currentChat.name}</h2>
              <p className="text-xs text-gray-500">
                {currentChat.isGroup 
                  ? `${currentChat.members.length} members` 
                  : currentChat.online ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
        </div>
        <div className="flex space-x-4">
          <button 
            className="text-gray-600 hover:text-primary-blue hover:scale-110 transition-all duration-300"
            onClick={() => setShowSearch(!showSearch)}
          >
            <Search className="w-5 h-5" />
          </button>
          <button 
            className="text-gray-600 hover:text-primary-blue hover:scale-110 transition-all duration-300"
            onClick={() => setShowScheduler(true)}
          >
            <Clock className="w-5 h-5" />
          </button>
          <button className="text-gray-600 hover:text-primary-blue hover:scale-110 transition-all duration-300">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search interface */}
      {showSearch && (
        <MessageSearch 
          chatId={chatId}
          onScrollToMessage={scrollToMessage}
          onClose={() => setShowSearch(false)}
        />
      )}

      {/* Pinned messages */}
      <PinnedMessages 
        chatId={chatId}
        onScrollToMessage={scrollToMessage}
      />

      {/* Scheduled messages */}
      <ScheduledMessages chatId={chatId} />

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="space-y-2">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              ref={el => {
                if (el) messageRefs.current[message.id] = el;
              }}
              className="transition-colors duration-300"
            >
              <ChatMessage
                message={message}
                isCurrentUser={message.senderId === currentUser.id}
              />
            </div>
          ))}
          
          {/* Typing indicator */}
          {typingUsers.length > 0 && (
            <TypingIndicator 
              isTyping={true} 
              userName={typingUsers.length === 1 ? typingUsers[0].name : undefined}
            />
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Media controls */}
      <MediaControls onSendMedia={handleSendMedia} />

      {/* Message input */}
      <form onSubmit={handleSendMessage} className="p-2 bg-white border-t border-gray-100 flex items-center">
        <button
          type="button"
          onClick={() => setShowTemplates(true)}
          className="p-2 text-gray-500 hover:text-blue-500"
        >
          <FileText className="w-5 h-5" />
        </button>
        <input
          type="text"
          value={newMessage}
          onChange={handleInputChange}
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 mx-2 focus:outline-none focus:ring-1 focus:ring-primary-blue focus:border-primary-blue"
          placeholder="Message"
        />
        <button 
          type="submit" 
          disabled={!newMessage.trim()}
          className={`p-2 rounded-full ${newMessage.trim() ? 'text-primary-blue' : 'text-gray-300'}`}
        >
          <Send className="w-6 h-6" />
        </button>
      </form>

      {/* Message scheduler modal */}
      {showScheduler && (
        <MessageScheduler
          chatId={chatId}
          onClose={() => setShowScheduler(false)}
        />
      )}
      
      {/* Message templates modal */}
      {showTemplates && (
        <MessageTemplates
          onSelectTemplate={handleTemplateSelected}
          onClose={() => setShowTemplates(false)}
        />
      )}
    </div>
  )
} 