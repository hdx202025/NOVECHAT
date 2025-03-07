'use client'

import { useEffect, useState } from 'react'

type Props = {
  usersTyping: number
}

export default function TypingIndicator({ usersTyping }: Props) {
  const [dots, setDots] = useState('.')

  useEffect(() => {
    if (usersTyping === 0) return

    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '.' : prev + '.'))
    }, 500)

    return () => clearInterval(interval)
  }, [usersTyping])

  if (usersTyping === 0) return null

  return (
    <div className="flex items-center space-x-2 text-sm text-gray-500 p-2">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
      </div>
      <span>
        {usersTyping === 1
          ? 'Someone is typing'
          : `${usersTyping} people are typing`}
        {dots}
      </span>
    </div>
  )
} 