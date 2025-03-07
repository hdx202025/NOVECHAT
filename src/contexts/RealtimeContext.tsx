'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import useEncryption from '@/hooks/useEncryption'

// Define the types for our messages and chats
export interface Message {
  id: string;
  chatId: number;
  senderId: number;
  text: string;
  encryptedText?: string;
  timestamp: number;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  isEncrypted: boolean;
  mediaType?: 'image' | 'audio' | 'video' | 'document';
  mediaUrl?: string;
  mediaThumbnail?: string;
  mediaName?: string;
  mediaSize?: number;
  reactions?: Record<number, string>; // userId -> emoji
  readBy?: number[]; // array of userIds who have read the message
  isDeleted?: boolean; // whether the message has been deleted
  forwardedFrom?: {
    chatId: number;
    messageId: string;
    chatName?: string;
  }; // information about forwarded message
  isPinned?: boolean; // whether the message is pinned
  scheduledFor?: number; // timestamp for scheduled messages
  originalLanguage?: string; // original language of the message
  translations?: Record<string, string>; // language code -> translated text
  reminderTime?: number; // timestamp for reminder
  isTemplate?: boolean; // whether the message is a template
  templateCategory?: string; // category for template organization
  isBookmarked?: boolean; // whether the message is bookmarked
  bookmarkNote?: string; // optional note for bookmarked message
  bookmarkCategory?: string; // category for bookmarked message
}

export interface Chat {
  id: number;
  name: string;
  isGroup: boolean;
  isChannel?: boolean; // Whether this is a channel
  members: number[];
  moderators?: number[]; // Moderators for channels
  description?: string; // Channel/Group description
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  online?: boolean;
  pinnedMessages?: string[]; // array of pinned message IDs
  isArchived?: boolean; // whether the chat is archived
  archivedAt?: number; // when the chat was archived
  channelType?: 'public' | 'private'; // Type of channel
  allowedActions?: { // Channel permissions
    canPost: boolean;
    canInvite: boolean;
    canPin: boolean;
  };
}

// Message template interface
export interface MessageTemplate {
  id: string;
  text: string;
  category: string;
  createdAt: number;
  usageCount: number;
}

// Bookmark category interface
export interface BookmarkCategory {
  id: string;
  name: string;
  color: string;
  createdAt: number;
}

// Define the context type
interface RealtimeContextType {
  chats: Chat[];
  messages: Record<number, Message[]>; // chatId -> messages
  currentUser: { id: number; name: string };
  sendMessage: (chatId: number, text: string, media?: {
    type: 'image' | 'audio' | 'video' | 'document';
    url: string;
    thumbnail?: string;
    name?: string;
    size?: number;
  }) => Promise<void>;
  createChat: (name: string, members: number[], isGroup: boolean, options?: {
    isChannel?: boolean;
    description?: string;
    channelType?: 'public' | 'private';
    moderators?: number[];
  }) => Promise<number>;
  markAsRead: (chatId: number, messageId: string) => void;
  getUnreadCount: () => number;
  addReaction: (chatId: number, messageId: string, emoji: string) => void;
  removeReaction: (chatId: number, messageId: string) => void;
  getReadReceipts: (chatId: number, messageId: string) => number[];
  setTyping: (chatId: number, isTyping: boolean) => void;
  getTypingUsers: (chatId: number) => { userId: number; name: string }[];
  forwardMessage: (fromChatId: number, messageId: string, toChatIds: number[]) => Promise<void>;
  deleteMessage: (chatId: number, messageId: string, forEveryone: boolean) => void;
  pinMessage: (chatId: number, messageId: string) => void;
  unpinMessage: (chatId: number, messageId: string) => void;
  getPinnedMessages: (chatId: number) => Message[];
  searchMessages: (chatId: number, query: string) => Message[];
  scheduleMessage: (chatId: number, text: string, scheduledTime: number, media?: {
    type: 'image' | 'audio' | 'video' | 'document';
    url: string;
    thumbnail?: string;
    name?: string;
    size?: number;
  }) => Promise<void>;
  getScheduledMessages: (chatId: number) => Message[];
  cancelScheduledMessage: (chatId: number, messageId: string) => void;
  translateMessage: (chatId: number, messageId: string, targetLanguage: string) => Promise<string>;
  getAvailableLanguages: () => { code: string; name: string }[];
  setMessageReminder: (chatId: number, messageId: string, reminderTime: number) => void;
  getMessageReminders: () => { message: Message; chatName: string }[];
  cancelMessageReminder: (chatId: number, messageId: string) => void;
  saveMessageTemplate: (text: string, category: string) => string;
  getMessageTemplates: () => MessageTemplate[];
  getMessageTemplateCategories: () => string[];
  deleteMessageTemplate: (templateId: string) => void;
  updateMessageTemplate: (templateId: string, updates: Partial<Omit<MessageTemplate, 'id'>>) => void;
  incrementTemplateUsage: (templateId: string) => void;
  archiveChat: (chatId: number) => void;
  unarchiveChat: (chatId: number) => void;
  getArchivedChats: () => Chat[];
  bookmarkMessage: (chatId: number, messageId: string, note?: string, category?: string) => void;
  unbookmarkMessage: (chatId: number, messageId: string) => void;
  getBookmarkedMessages: () => { message: Message; chatName: string }[];
  updateBookmarkNote: (chatId: number, messageId: string, note: string) => void;
  updateBookmarkCategory: (chatId: number, messageId: string, category: string) => void;
  createBookmarkCategory: (name: string, color: string) => string;
  getBookmarkCategories: () => BookmarkCategory[];
  deleteBookmarkCategory: (categoryId: string) => void;
  // New channel-specific functions
  updateChannelSettings: (chatId: number, settings: {
    description?: string;
    channelType?: 'public' | 'private';
    allowedActions?: {
      canPost: boolean;
      canInvite: boolean;
      canPin: boolean;
    };
  }) => void;
  addModerator: (chatId: number, userId: number) => void;
  removeModerator: (chatId: number, userId: number) => void;
  getModerators: (chatId: number) => number[];
  isUserModerator: (chatId: number, userId: number) => boolean;
}

// Create the context
const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined)

// Mock data for initial chats
const initialChats: Chat[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    isGroup: false,
    members: [1, 2], // Current user (1) and Sarah (2)
    avatar: 'https://picsum.photos/id/64/200',
    lastMessage: 'Are we still meeting tomorrow?',
    lastMessageTime: '10:42 AM',
    unreadCount: 2,
    online: true,
  },
  {
    id: 2,
    name: 'Tech Group Chat',
    isGroup: true,
    members: [1, 2, 3, 4], // Current user (1), Sarah (2), David (3), Emma (4)
    avatar: 'https://picsum.photos/id/65/200',
    lastMessage: 'Alex: I just released the new update',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    online: false,
  },
  {
    id: 3,
    name: 'David Wilson',
    isGroup: false,
    members: [1, 3], // Current user (1) and David (3)
    avatar: 'https://picsum.photos/id/91/200',
    lastMessage: 'Thanks for the information!',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    online: true,
  },
  {
    id: 4,
    name: 'Emma Thompson',
    isGroup: false,
    members: [1, 4], // Current user (1) and Emma (4)
    avatar: 'https://picsum.photos/id/26/200',
    lastMessage: 'Can you send me the document?',
    lastMessageTime: 'Monday',
    unreadCount: 0,
    online: false,
  },
  {
    id: 5,
    name: 'Work Team',
    isGroup: true,
    members: [1, 3, 4, 5], // Current user (1), David (3), Emma (4), Maria (5)
    avatar: 'https://picsum.photos/id/54/200',
    lastMessage: 'Maria: Let\'s discuss this in the meeting',
    lastMessageTime: 'Monday',
    unreadCount: 0,
    online: false,
  },
]

// Mock data for initial messages
const initialMessages: Record<number, Message[]> = {
  1: [
    {
      id: '1',
      chatId: 1,
      senderId: 2, // Sarah
      text: 'Hey there! How are you doing today?',
      timestamp: Date.now() - 1000 * 60 * 60, // 1 hour ago
      status: 'read',
      isEncrypted: true,
    },
    {
      id: '2',
      chatId: 1,
      senderId: 1, // Current user
      text: 'I\'m good, thanks for asking! Just finishing up some work. How about you?',
      timestamp: Date.now() - 1000 * 60 * 58, // 58 minutes ago
      status: 'read',
      isEncrypted: true,
    },
    {
      id: '3',
      chatId: 1,
      senderId: 2, // Sarah
      text: 'Pretty good! I was wondering if we\'re still meeting tomorrow for coffee?',
      timestamp: Date.now() - 1000 * 60 * 57, // 57 minutes ago
      status: 'read',
      isEncrypted: true,
    },
    {
      id: '4',
      chatId: 1,
      senderId: 1, // Current user
      text: 'Yes, definitely! How about 10 AM at the usual place?',
      timestamp: Date.now() - 1000 * 60 * 55, // 55 minutes ago
      status: 'read',
      isEncrypted: true,
    },
    {
      id: '5',
      chatId: 1,
      senderId: 2, // Sarah
      text: 'Perfect! Looking forward to catching up.',
      timestamp: Date.now() - 1000 * 60 * 54, // 54 minutes ago
      status: 'read',
      isEncrypted: true,
    },
    {
      id: '6',
      chatId: 1,
      senderId: 1, // Current user
      text: 'Me too! See you tomorrow.',
      timestamp: Date.now() - 1000 * 60 * 52, // 52 minutes ago
      status: 'read',
      isEncrypted: true,
    },
    {
      id: '7',
      chatId: 1,
      senderId: 2, // Sarah
      text: 'By the way, I found this interesting article about the topic we discussed last time. I\'ll share it with you tomorrow.',
      timestamp: Date.now() - 1000 * 60 * 50, // 50 minutes ago
      status: 'delivered',
      isEncrypted: true,
    },
    {
      id: '8',
      chatId: 1,
      senderId: 2, // Sarah
      text: 'Are we still meeting tomorrow?',
      timestamp: Date.now() - 1000 * 60 * 10, // 10 minutes ago
      status: 'delivered',
      isEncrypted: true,
    },
  ],
  3: [
    {
      id: '1',
      chatId: 3,
      senderId: 3, // David
      text: 'Hi, I wanted to share some information with you about the project.',
      timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
      status: 'read',
      isEncrypted: true,
    },
    {
      id: '2',
      chatId: 3,
      senderId: 1, // Current user
      text: 'Thanks for the information!',
      timestamp: Date.now() - 1000 * 60 * 60 * 23, // 23 hours ago
      status: 'read',
      isEncrypted: true,
    },
  ],
}

// Provider component
export function RealtimeProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<Chat[]>(initialChats)
  const [messages, setMessages] = useState<Record<number, Message[]>>({})
  const [currentUser] = useState({ id: 1, name: 'John Doe' })
  const [typingUsers, setTypingUsers] = useState<Record<number, Record<number, { timestamp: number; name: string }>>>({})
  const [messageTemplates, setMessageTemplates] = useState<MessageTemplate[]>([
    { id: 'template_1', text: 'Hello, how are you?', category: 'Greetings', createdAt: Date.now() - 86400000, usageCount: 5 },
    { id: 'template_2', text: 'I\'ll be there in 10 minutes.', category: 'Status', createdAt: Date.now() - 172800000, usageCount: 3 },
    { id: 'template_3', text: 'Can we schedule a meeting tomorrow?', category: 'Business', createdAt: Date.now() - 259200000, usageCount: 2 },
    { id: 'template_4', text: 'Happy birthday! 🎂', category: 'Celebrations', createdAt: Date.now() - 345600000, usageCount: 1 },
  ])
  const [bookmarkCategories, setBookmarkCategories] = useState<BookmarkCategory[]>([
    { id: 'category_1', name: 'Important', color: '#FF5252', createdAt: Date.now() - 86400000 },
    { id: 'category_2', name: 'Work', color: '#4CAF50', createdAt: Date.now() - 172800000 },
    { id: 'category_3', name: 'Personal', color: '#2196F3', createdAt: Date.now() - 259200000 },
    { id: 'category_4', name: 'Ideas', color: '#FFC107', createdAt: Date.now() - 345600000 },
  ])
  const { encrypt, decrypt, encryptionReady } = useEncryption()

  // Load chats and messages from local storage on component mount
  useEffect(() => {
    const storedChats = localStorage.getItem('nova_chat_chats')
    const storedMessages = localStorage.getItem('nova_chat_messages')
    
    if (storedChats) {
      try {
        setChats(JSON.parse(storedChats))
      } catch (error) {
        console.error('Failed to parse stored chats:', error)
      }
    }
    
    if (storedMessages) {
      try {
        setMessages(JSON.parse(storedMessages))
      } catch (error) {
        console.error('Failed to parse stored messages:', error)
      }
    }
  }, [])

  // Save chats and messages to local storage when they change
  useEffect(() => {
    localStorage.setItem('nova_chat_chats', JSON.stringify(chats))
  }, [chats])

  useEffect(() => {
    localStorage.setItem('nova_chat_messages', JSON.stringify(messages))
  }, [messages])

  // Format timestamp to readable time
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  // Send a message
  const sendMessage = async (
    chatId: number, 
    text: string, 
    media?: {
      type: 'image' | 'audio' | 'video' | 'document';
      url: string;
      thumbnail?: string;
      name?: string;
      size?: number;
    }
  ) => {
    // Generate a unique ID for the message
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = Date.now();
    
    // Create the message object
    const message: Message = {
      id: messageId,
      chatId,
      senderId: currentUser.id,
      text,
      timestamp,
      status: 'sending',
      isEncrypted: false,
    };
    
    // Add media information if provided
    if (media) {
      message.mediaType = media.type;
      message.mediaUrl = media.url;
      message.mediaThumbnail = media.thumbnail;
      message.mediaName = media.name;
      message.mediaSize = media.size;
    }
    
    // Add the message to the messages state
    setMessages(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), message],
    }));
    
    // Update the chat's last message
    setChats(prev => 
      prev.map(chat => {
        if (chat.id === chatId) {
          const lastMessageText = media 
            ? `[${media.type.charAt(0).toUpperCase() + media.type.slice(1)}]${text ? ` ${text}` : ''}`
            : text;
            
          return {
            ...chat,
            lastMessage: lastMessageText,
            lastMessageTime: formatTime(timestamp),
          };
        }
        return chat;
      })
    );
    
    // Simulate sending the message
    setTimeout(() => {
      // Update message status to sent
      setMessages(prev => ({
        ...prev,
        [chatId]: prev[chatId].map(msg => 
          msg.id === messageId ? { ...msg, status: 'sent' } : msg
        ),
      }));
      
      // Simulate message delivery after a delay
      setTimeout(() => {
        // Update message status to delivered
        setMessages(prev => ({
          ...prev,
          [chatId]: prev[chatId].map(msg => 
            msg.id === messageId ? { ...msg, status: 'delivered' } : msg
          ),
        }));
      }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
    }, 500 + Math.random() * 1000); // Random delay between 0.5-1.5 seconds
  };

  // Create a new chat
  const createChat = async (
    name: string, 
    members: number[], 
    isGroup: boolean,
    options?: {
      isChannel?: boolean;
      description?: string;
      channelType?: 'public' | 'private';
      moderators?: number[];
    }
  ): Promise<number> => {
    // Create a new chat ID
    const newChatId = Math.max(...chats.map(chat => chat.id)) + 1

    // Create the new chat
    const newChat: Chat = {
      id: newChatId,
      name,
      isGroup,
      isChannel: options?.isChannel || false,
      members: [currentUser.id, ...members],
      moderators: options?.moderators || (options?.isChannel ? [currentUser.id] : undefined),
      description: options?.description,
      channelType: options?.channelType,
      unreadCount: 0,
      online: false,
      avatar: isGroup ? undefined : `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/200`,
      allowedActions: options?.isChannel ? {
        canPost: true,
        canInvite: true,
        canPin: false
      } : undefined
    }

    // Add the chat to the list
    setChats(prevChats => [...prevChats, newChat])

    // Initialize empty message list for the chat
    setMessages(prevMessages => ({
      ...prevMessages,
      [newChatId]: [],
    }))

    return newChatId
  }

  // Add a reaction to a message
  const addReaction = (chatId: number, messageId: string, emoji: string) => {
    setMessages(prev => ({
      ...prev,
      [chatId]: prev[chatId].map(msg => {
        if (msg.id === messageId) {
          const reactions = msg.reactions || {};
          return {
            ...msg,
            reactions: {
              ...reactions,
              [currentUser.id]: emoji
            }
          };
        }
        return msg;
      })
    }));
  };
  
  // Remove a reaction from a message
  const removeReaction = (chatId: number, messageId: string) => {
    setMessages(prev => ({
      ...prev,
      [chatId]: prev[chatId].map(msg => {
        if (msg.id === messageId && msg.reactions) {
          const { [currentUser.id]: _, ...remainingReactions } = msg.reactions;
          return {
            ...msg,
            reactions: remainingReactions
          };
        }
        return msg;
      })
    }));
  };
  
  // Get read receipts for a message
  const getReadReceipts = (chatId: number, messageId: string): number[] => {
    const message = messages[chatId]?.find(msg => msg.id === messageId);
    return message?.readBy || [];
  };

  // Mark a message as read
  const markAsRead = (chatId: number, messageId: string) => {
    setMessages(prev => ({
      ...prev,
      [chatId]: prev[chatId].map(msg => {
        if (msg.id === messageId) {
          // Update status to read
          const updatedMsg = { ...msg, status: 'read' as const };
          
          // Add current user to readBy array if not already there
          if (msg.senderId !== currentUser.id) {
            const readBy = msg.readBy || [];
            if (!readBy.includes(currentUser.id)) {
              updatedMsg.readBy = [...readBy, currentUser.id];
            }
          }
          
          return updatedMsg;
        }
        return msg;
      })
    }));
    
    // Update unread count in chat
    setChats(prev => 
      prev.map(chat => 
        chat.id === chatId 
          ? { ...chat, unreadCount: 0 } 
          : chat
      )
    );
  };

  // Get total unread count across all chats
  const getUnreadCount = () => {
    return chats.reduce((total, chat) => total + chat.unreadCount, 0)
  }

  // Set typing status
  const setTyping = (chatId: number, isTyping: boolean) => {
    if (isTyping) {
      // Add current user to typing users
      setTypingUsers(prev => ({
        ...prev,
        [chatId]: {
          ...(prev[chatId] || {}),
          [currentUser.id]: {
            timestamp: Date.now(),
            name: currentUser.name
          }
        }
      }));
      
      // Automatically clear typing status after 5 seconds
      setTimeout(() => {
        setTypingUsers(prev => {
          if (!prev[chatId] || !prev[chatId][currentUser.id]) return prev;
          
          const { [currentUser.id]: _, ...otherUsers } = prev[chatId];
          return {
            ...prev,
            [chatId]: otherUsers
          };
        });
      }, 5000);
    } else {
      // Remove current user from typing users
      setTypingUsers(prev => {
        if (!prev[chatId]) return prev;
        
        const { [currentUser.id]: _, ...otherUsers } = prev[chatId];
        return {
          ...prev,
          [chatId]: otherUsers
        };
      });
    }
  };
  
  // Get users who are typing in a chat
  const getTypingUsers = (chatId: number): { userId: number; name: string }[] => {
    if (!typingUsers[chatId]) return [];
    
    // Filter out current user and expired typing statuses (older than 5 seconds)
    const now = Date.now();
    return Object.entries(typingUsers[chatId])
      .filter(([userId, data]) => {
        return parseInt(userId) !== currentUser.id && now - data.timestamp < 5000;
      })
      .map(([userId, data]) => ({
        userId: parseInt(userId),
        name: data.name
      }));
  };

  // Forward a message to other chats
  const forwardMessage = async (fromChatId: number, messageId: string, toChatIds: number[]): Promise<void> => {
    // Find the original message
    const originalMessage = messages[fromChatId]?.find(msg => msg.id === messageId);
    if (!originalMessage) return;
    
    // Get the chat name for the forwarded message reference
    const fromChat = chats.find(chat => chat.id === fromChatId);
    const fromChatName = fromChat?.name || 'Unknown chat';
    
    // Forward to each target chat
    for (const toChatId of toChatIds) {
      // Create a new message ID
      const newMessageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const timestamp = Date.now();
      
      // Create the forwarded message
      const forwardedMessage: Message = {
        id: newMessageId,
        chatId: toChatId,
        senderId: currentUser.id,
        text: originalMessage.text,
        timestamp,
        status: 'sending',
        isEncrypted: originalMessage.isEncrypted,
        forwardedFrom: {
          chatId: fromChatId,
          messageId: originalMessage.id,
          chatName: fromChatName
        }
      };
      
      // Copy media information if present
      if (originalMessage.mediaType) {
        forwardedMessage.mediaType = originalMessage.mediaType;
        forwardedMessage.mediaUrl = originalMessage.mediaUrl;
        forwardedMessage.mediaThumbnail = originalMessage.mediaThumbnail;
        forwardedMessage.mediaName = originalMessage.mediaName;
        forwardedMessage.mediaSize = originalMessage.mediaSize;
      }
      
      // Add the message to the messages state
      setMessages(prev => ({
        ...prev,
        [toChatId]: [...(prev[toChatId] || []), forwardedMessage],
      }));
      
      // Update the chat's last message
      setChats(prev => 
        prev.map(chat => {
          if (chat.id === toChatId) {
            const lastMessageText = originalMessage.mediaType 
              ? `[${originalMessage.mediaType.charAt(0).toUpperCase() + originalMessage.mediaType.slice(1)}] Forwarded message`
              : `Forwarded: ${originalMessage.text.substring(0, 30)}${originalMessage.text.length > 30 ? '...' : ''}`;
              
            return {
              ...chat,
              lastMessage: lastMessageText,
              lastMessageTime: formatTime(timestamp),
            };
          }
          return chat;
        })
      );
      
      // Simulate sending the message
      setTimeout(() => {
        // Update message status to sent
        setMessages(prev => ({
          ...prev,
          [toChatId]: prev[toChatId].map(msg => 
            msg.id === newMessageId ? { ...msg, status: 'sent' } : msg
          ),
        }));
        
        // Simulate message delivery after a delay
        setTimeout(() => {
          // Update message status to delivered
          setMessages(prev => ({
            ...prev,
            [toChatId]: prev[toChatId].map(msg => 
              msg.id === newMessageId ? { ...msg, status: 'delivered' } : msg
            ),
          }));
        }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
      }, 500 + Math.random() * 1000); // Random delay between 0.5-1.5 seconds
    }
  };
  
  // Delete a message
  const deleteMessage = (chatId: number, messageId: string, forEveryone: boolean) => {
    // Find the message
    const message = messages[chatId]?.find(msg => msg.id === messageId);
    if (!message) return;
    
    // Check if the user can delete for everyone
    const canDeleteForEveryone = message.senderId === currentUser.id;
    
    if (forEveryone && canDeleteForEveryone) {
      // Delete for everyone - mark as deleted
      setMessages(prev => ({
        ...prev,
        [chatId]: prev[chatId].map(msg => 
          msg.id === messageId ? { ...msg, isDeleted: true, text: 'This message was deleted' } : msg
        ),
      }));
      
      // Update the chat's last message if this was the last message
      const chatMessages = messages[chatId] || [];
      if (chatMessages.length > 0 && chatMessages[chatMessages.length - 1].id === messageId) {
        setChats(prev => 
          prev.map(chat => {
            if (chat.id === chatId) {
              return {
                ...chat,
                lastMessage: 'This message was deleted',
              };
            }
            return chat;
          })
        );
      }
    } else {
      // Delete just for the current user - remove from their view
      setMessages(prev => ({
        ...prev,
        [chatId]: prev[chatId].filter(msg => msg.id !== messageId),
      }));
    }
  };

  // Pin a message
  const pinMessage = (chatId: number, messageId: string) => {
    // Find the message
    const message = messages[chatId]?.find(msg => msg.id === messageId);
    if (!message) return;
    
    // Update the message to mark it as pinned
    setMessages(prev => ({
      ...prev,
      [chatId]: prev[chatId].map(msg => 
        msg.id === messageId ? { ...msg, isPinned: true } : msg
      ),
    }));
    
    // Add the message ID to the chat's pinned messages array
    setChats(prev => 
      prev.map(chat => {
        if (chat.id === chatId) {
          const pinnedMessages = chat.pinnedMessages || [];
          if (!pinnedMessages.includes(messageId)) {
            return {
              ...chat,
              pinnedMessages: [...pinnedMessages, messageId],
            };
          }
        }
        return chat;
      })
    );
  };
  
  // Unpin a message
  const unpinMessage = (chatId: number, messageId: string) => {
    // Find the message
    const message = messages[chatId]?.find(msg => msg.id === messageId);
    if (!message) return;
    
    // Update the message to mark it as not pinned
    setMessages(prev => ({
      ...prev,
      [chatId]: prev[chatId].map(msg => 
        msg.id === messageId ? { ...msg, isPinned: false } : msg
      ),
    }));
    
    // Remove the message ID from the chat's pinned messages array
    setChats(prev => 
      prev.map(chat => {
        if (chat.id === chatId && chat.pinnedMessages) {
          return {
            ...chat,
            pinnedMessages: chat.pinnedMessages.filter(id => id !== messageId),
          };
        }
        return chat;
      })
    );
  };
  
  // Get all pinned messages for a chat
  const getPinnedMessages = (chatId: number): Message[] => {
    const chat = chats.find(c => c.id === chatId);
    if (!chat || !chat.pinnedMessages || chat.pinnedMessages.length === 0) {
      return [];
    }
    
    const chatMessages = messages[chatId] || [];
    return chatMessages.filter(msg => msg.isPinned && !msg.isDeleted);
  };
  
  // Search messages in a chat
  const searchMessages = (chatId: number, query: string): Message[] => {
    if (!query.trim()) return [];
    
    const chatMessages = messages[chatId] || [];
    const lowerCaseQuery = query.toLowerCase();
    
    return chatMessages.filter(msg => {
      // Skip deleted messages
      if (msg.isDeleted) return false;
      
      // Search in message text
      if (msg.text && msg.text.toLowerCase().includes(lowerCaseQuery)) {
        return true;
      }
      
      // Search in media name
      if (msg.mediaName && msg.mediaName.toLowerCase().includes(lowerCaseQuery)) {
        return true;
      }
      
      return false;
    });
  };

  // Schedule a message to be sent later
  const scheduleMessage = async (
    chatId: number, 
    text: string, 
    scheduledTime: number,
    media?: {
      type: 'image' | 'audio' | 'video' | 'document';
      url: string;
      thumbnail?: string;
      name?: string;
      size?: number;
    }
  ): Promise<void> => {
    // Validate scheduled time (must be in the future)
    if (scheduledTime <= Date.now()) {
      throw new Error('Scheduled time must be in the future');
    }
    
    // Generate a unique ID for the message
    const messageId = `scheduled_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create the scheduled message object
    const scheduledMessage: Message = {
      id: messageId,
      chatId,
      senderId: currentUser.id,
      text,
      timestamp: Date.now(), // Creation timestamp
      scheduledFor: scheduledTime, // When to send
      status: 'sending',
      isEncrypted: false,
      originalLanguage: 'en', // Default to English
    };
    
    // Add media information if provided
    if (media) {
      scheduledMessage.mediaType = media.type;
      scheduledMessage.mediaUrl = media.url;
      scheduledMessage.mediaThumbnail = media.thumbnail;
      scheduledMessage.mediaName = media.name;
      scheduledMessage.mediaSize = media.size;
    }
    
    // Add the scheduled message to the messages state
    setMessages(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), scheduledMessage],
    }));
    
    // Set up a timeout to "send" the message when the scheduled time arrives
    const timeUntilSend = scheduledTime - Date.now();
    setTimeout(() => {
      // Remove the scheduled message
      setMessages(prev => ({
        ...prev,
        [chatId]: prev[chatId].filter(msg => msg.id !== messageId),
      }));
      
      // Send the actual message
      sendMessage(chatId, text, media);
    }, timeUntilSend);
  };
  
  // Get all scheduled messages for a chat
  const getScheduledMessages = (chatId: number): Message[] => {
    const chatMessages = messages[chatId] || [];
    return chatMessages.filter(msg => msg.scheduledFor && msg.scheduledFor > Date.now());
  };
  
  // Cancel a scheduled message
  const cancelScheduledMessage = (chatId: number, messageId: string): void => {
    // Find the message
    const message = messages[chatId]?.find(msg => msg.id === messageId);
    if (!message || !message.scheduledFor) return;
    
    // Remove the scheduled message from the messages state
    setMessages(prev => ({
      ...prev,
      [chatId]: prev[chatId].filter(msg => msg.id !== messageId),
    }));
  };
  
  // Available languages for translation
  const availableLanguages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },
  ];
  
  // Get available languages for translation
  const getAvailableLanguages = () => availableLanguages;
  
  // Translate a message to another language
  const translateMessage = async (
    chatId: number, 
    messageId: string, 
    targetLanguage: string
  ): Promise<string> => {
    // Find the message
    const message = messages[chatId]?.find(msg => msg.id === messageId);
    if (!message || !message.text) {
      throw new Error('Message not found or has no text');
    }
    
    // Check if translation already exists
    if (message.translations && message.translations[targetLanguage]) {
      return message.translations[targetLanguage];
    }
    
    // In a real app, you would call a translation API here
    // For this demo, we'll simulate translation with a simple function
    const translatedText = simulateTranslation(message.text, targetLanguage);
    
    // Store the translation in the message
    setMessages(prev => ({
      ...prev,
      [chatId]: prev[chatId].map(msg => {
        if (msg.id === messageId) {
          const translations = msg.translations || {};
          return {
            ...msg,
            originalLanguage: msg.originalLanguage || 'en',
            translations: {
              ...translations,
              [targetLanguage]: translatedText,
            },
          };
        }
        return msg;
      }),
    }));
    
    return translatedText;
  };
  
  // Simulate translation (in a real app, this would call a translation API)
  const simulateTranslation = (text: string, targetLanguage: string): string => {
    // This is just a simple simulation for demo purposes
    const prefixes: Record<string, string> = {
      'es': '[ES] ',
      'fr': '[FR] ',
      'de': '[DE] ',
      'it': '[IT] ',
      'pt': '[PT] ',
      'ru': '[RU] ',
      'zh': '[ZH] ',
      'ja': '[JA] ',
      'ko': '[KO] ',
      'ar': '[AR] ',
      'hi': '[HI] ',
    };
    
    return `${prefixes[targetLanguage] || ''}${text}`;
  };

  // Set a reminder for a message
  const setMessageReminder = (chatId: number, messageId: string, reminderTime: number): void => {
    // Validate reminder time (must be in the future)
    if (reminderTime <= Date.now()) {
      throw new Error('Reminder time must be in the future');
    }
    
    // Find the message
    const message = messages[chatId]?.find(msg => msg.id === messageId);
    if (!message) return;
    
    // Update the message with the reminder time
    setMessages(prev => ({
      ...prev,
      [chatId]: prev[chatId].map(msg => 
        msg.id === messageId ? { ...msg, reminderTime } : msg
      ),
    }));
    
    // Set up a timeout to show the reminder when the time arrives
    const timeUntilReminder = reminderTime - Date.now();
    setTimeout(() => {
      // In a real app, this would trigger a notification
      console.log(`Reminder for message: ${message.text}`);
      
      // Clear the reminder after it's shown
      setMessages(prev => ({
        ...prev,
        [chatId]: prev[chatId].map(msg => 
          msg.id === messageId ? { ...msg, reminderTime: undefined } : msg
        ),
      }));
    }, timeUntilReminder);
  };
  
  // Get all messages with reminders
  const getMessageReminders = (): { message: Message; chatName: string }[] => {
    const reminders: { message: Message; chatName: string }[] = [];
    
    // Loop through all chats and messages to find those with reminders
    Object.entries(messages).forEach(([chatIdStr, chatMessages]) => {
      const chatId = parseInt(chatIdStr);
      const chat = chats.find(c => c.id === chatId);
      if (!chat) return;
      
      chatMessages.forEach(message => {
        if (message.reminderTime && message.reminderTime > Date.now()) {
          reminders.push({
            message,
            chatName: chat.name,
          });
        }
      });
    });
    
    // Sort by reminder time (earliest first)
    return reminders.sort((a, b) => 
      (a.message.reminderTime || 0) - (b.message.reminderTime || 0)
    );
  };
  
  // Cancel a message reminder
  const cancelMessageReminder = (chatId: number, messageId: string): void => {
    // Find the message
    const message = messages[chatId]?.find(msg => msg.id === messageId);
    if (!message || !message.reminderTime) return;
    
    // Remove the reminder
    setMessages(prev => ({
      ...prev,
      [chatId]: prev[chatId].map(msg => 
        msg.id === messageId ? { ...msg, reminderTime: undefined } : msg
      ),
    }));
  };
  
  // Save a message as a template
  const saveMessageTemplate = (text: string, category: string): string => {
    // Generate a unique ID for the template
    const templateId = `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create the template
    const newTemplate: MessageTemplate = {
      id: templateId,
      text,
      category,
      createdAt: Date.now(),
      usageCount: 0,
    };
    
    // Add the template to the state
    setMessageTemplates(prev => [...prev, newTemplate]);
    
    return templateId;
  };
  
  // Get all message templates
  const getMessageTemplates = (): MessageTemplate[] => {
    // Return templates sorted by usage count (most used first)
    return [...messageTemplates].sort((a, b) => b.usageCount - a.usageCount);
  };
  
  // Get all message template categories
  const getMessageTemplateCategories = (): string[] => {
    // Get unique categories
    const categories = new Set(messageTemplates.map(template => template.category));
    return Array.from(categories);
  };
  
  // Delete a message template
  const deleteMessageTemplate = (templateId: string): void => {
    setMessageTemplates(prev => prev.filter(template => template.id !== templateId));
  };
  
  // Update a message template
  const updateMessageTemplate = (templateId: string, updates: Partial<Omit<MessageTemplate, 'id'>>): void => {
    setMessageTemplates(prev => 
      prev.map(template => 
        template.id === templateId 
          ? { ...template, ...updates } 
          : template
      )
    );
  };
  
  // Increment the usage count for a template
  const incrementTemplateUsage = (templateId: string): void => {
    setMessageTemplates(prev => 
      prev.map(template => 
        template.id === templateId 
          ? { ...template, usageCount: template.usageCount + 1 } 
          : template
      )
    );
  };

  // Archive a chat
  const archiveChat = (chatId: number): void => {
    // Find the chat
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;
    
    // Update the chat to mark it as archived
    setChats(prev => 
      prev.map(c => 
        c.id === chatId 
          ? { 
              ...c, 
              isArchived: true, 
              archivedAt: Date.now() 
            } 
          : c
      )
    );
  };
  
  // Unarchive a chat
  const unarchiveChat = (chatId: number): void => {
    // Find the chat
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;
    
    // Update the chat to mark it as not archived
    setChats(prev => 
      prev.map(c => 
        c.id === chatId 
          ? { 
              ...c, 
              isArchived: false, 
              archivedAt: undefined 
            } 
          : c
      )
    );
  };
  
  // Get all archived chats
  const getArchivedChats = (): Chat[] => {
    return chats.filter(chat => chat.isArchived);
  };
  
  // Bookmark a message
  const bookmarkMessage = (chatId: number, messageId: string, note?: string, category?: string): void => {
    // Find the message
    const message = messages[chatId]?.find(msg => msg.id === messageId);
    if (!message) return;
    
    // Update the message to mark it as bookmarked
    setMessages(prev => ({
      ...prev,
      [chatId]: prev[chatId].map(msg => 
        msg.id === messageId 
          ? { 
              ...msg, 
              isBookmarked: true,
              bookmarkNote: note,
              bookmarkCategory: category
            } 
          : msg
      ),
    }));
  };
  
  // Unbookmark a message
  const unbookmarkMessage = (chatId: number, messageId: string): void => {
    // Find the message
    const message = messages[chatId]?.find(msg => msg.id === messageId);
    if (!message) return;
    
    // Update the message to mark it as not bookmarked
    setMessages(prev => ({
      ...prev,
      [chatId]: prev[chatId].map(msg => 
        msg.id === messageId 
          ? { 
              ...msg, 
              isBookmarked: false,
              bookmarkNote: undefined,
              bookmarkCategory: undefined
            } 
          : msg
      ),
    }));
  };
  
  // Get all bookmarked messages
  const getBookmarkedMessages = (): { message: Message; chatName: string }[] => {
    const bookmarked: { message: Message; chatName: string }[] = [];
    
    // Loop through all chats and messages to find bookmarked ones
    Object.entries(messages).forEach(([chatIdStr, chatMessages]) => {
      const chatId = parseInt(chatIdStr);
      const chat = chats.find(c => c.id === chatId);
      if (!chat) return;
      
      chatMessages.forEach(message => {
        if (message.isBookmarked) {
          bookmarked.push({
            message,
            chatName: chat.name,
          });
        }
      });
    });
    
    // Sort by timestamp (newest first)
    return bookmarked.sort((a, b) => b.message.timestamp - a.message.timestamp);
  };
  
  // Update bookmark note
  const updateBookmarkNote = (chatId: number, messageId: string, note: string): void => {
    // Find the message
    const message = messages[chatId]?.find(msg => msg.id === messageId);
    if (!message || !message.isBookmarked) return;
    
    // Update the bookmark note
    setMessages(prev => ({
      ...prev,
      [chatId]: prev[chatId].map(msg => 
        msg.id === messageId 
          ? { 
              ...msg, 
              bookmarkNote: note
            } 
          : msg
      ),
    }));
  };
  
  // Update bookmark category
  const updateBookmarkCategory = (chatId: number, messageId: string, category: string): void => {
    // Find the message
    const message = messages[chatId]?.find(msg => msg.id === messageId);
    if (!message || !message.isBookmarked) return;
    
    // Update the bookmark category
    setMessages(prev => ({
      ...prev,
      [chatId]: prev[chatId].map(msg => 
        msg.id === messageId 
          ? { 
              ...msg, 
              bookmarkCategory: category
            } 
          : msg
      ),
    }));
  };
  
  // Create a new bookmark category
  const createBookmarkCategory = (name: string, color: string): string => {
    // Generate a unique ID for the category
    const categoryId = `category_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create the category
    const newCategory: BookmarkCategory = {
      id: categoryId,
      name,
      color,
      createdAt: Date.now(),
    };
    
    // Add the category to the state
    setBookmarkCategories(prev => [...prev, newCategory]);
    
    return categoryId;
  };
  
  // Get all bookmark categories
  const getBookmarkCategories = (): BookmarkCategory[] => {
    // Return categories sorted by creation time (newest first)
    return [...bookmarkCategories].sort((a, b) => b.createdAt - a.createdAt);
  };
  
  // Delete a bookmark category
  const deleteBookmarkCategory = (categoryId: string): void => {
    // Remove the category
    setBookmarkCategories(prev => prev.filter(category => category.id !== categoryId));
    
    // Update all messages with this category to have no category
    Object.keys(messages).forEach(chatIdStr => {
      const chatId = parseInt(chatIdStr);
      
      setMessages(prev => ({
        ...prev,
        [chatId]: prev[chatId].map(msg => 
          msg.bookmarkCategory === categoryId 
            ? { ...msg, bookmarkCategory: undefined } 
            : msg
        ),
      }));
    });
  };

  // Add new channel management functions
  const updateChannelSettings = (chatId: number, settings: {
    description?: string;
    channelType?: 'public' | 'private';
    allowedActions?: {
      canPost: boolean;
      canInvite: boolean;
      canPin: boolean;
    };
  }) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId
        ? { ...chat, ...settings }
        : chat
    ));
  };

  const addModerator = (chatId: number, userId: number) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId && chat.isChannel
        ? { ...chat, moderators: [...(chat.moderators || []), userId] }
        : chat
    ));
  };

  const removeModerator = (chatId: number, userId: number) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId && chat.isChannel
        ? { ...chat, moderators: chat.moderators?.filter(id => id !== userId) }
        : chat
    ));
  };

  const getModerators = (chatId: number): number[] => {
    const chat = chats.find(c => c.id === chatId);
    return chat?.moderators || [];
  };

  const isUserModerator = (chatId: number, userId: number): boolean => {
    const chat = chats.find(c => c.id === chatId);
    return chat?.moderators?.includes(userId) || false;
  };

  return (
    <RealtimeContext.Provider
      value={{
        chats,
        messages,
        currentUser,
        sendMessage,
        createChat,
        markAsRead,
        getUnreadCount,
        addReaction,
        removeReaction,
        getReadReceipts,
        setTyping,
        getTypingUsers,
        forwardMessage,
        deleteMessage,
        pinMessage,
        unpinMessage,
        getPinnedMessages,
        searchMessages,
        scheduleMessage,
        getScheduledMessages,
        cancelScheduledMessage,
        translateMessage,
        getAvailableLanguages,
        setMessageReminder,
        getMessageReminders,
        cancelMessageReminder,
        saveMessageTemplate,
        getMessageTemplates,
        getMessageTemplateCategories,
        deleteMessageTemplate,
        updateMessageTemplate,
        incrementTemplateUsage,
        archiveChat,
        unarchiveChat,
        getArchivedChats,
        bookmarkMessage,
        unbookmarkMessage,
        getBookmarkedMessages,
        updateBookmarkNote,
        updateBookmarkCategory,
        createBookmarkCategory,
        getBookmarkCategories,
        deleteBookmarkCategory,
        // Add new channel functions to context
        updateChannelSettings,
        addModerator,
        removeModerator,
        getModerators,
        isUserModerator
      }}
    >
      {children}
    </RealtimeContext.Provider>
  )
}

// Custom hook to use the context
export function useRealtime() {
  const context = useContext(RealtimeContext)
  if (context === undefined) {
    throw new Error('useRealtime must be used within a RealtimeProvider')
  }
  return context
} 