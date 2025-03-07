'use client'

import { useState, useRef, useEffect } from 'react';
import { Check, CheckCheck, File, Image, Music, Video, MoreVertical, Pin } from 'lucide-react';
import { Message } from '@/contexts/RealtimeContext';
import { formatFileSize } from '@/utils/media';
import MessageReactions from './MessageReactions';
import ReadReceipts from './ReadReceipts';
import MessageActions from './MessageActions';
import { useRealtime } from '@/contexts/RealtimeContext';

type ChatMessageProps = {
  message: string
  timestamp: string
  isOwn: boolean
}

export default function ChatMessage({ message, timestamp, isOwn }: ChatMessageProps) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[70%] rounded-lg p-3 ${isOwn ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
        <p>{message}</p>
        <p className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>{timestamp}</p>
      </div>
    </div>
  )
} 