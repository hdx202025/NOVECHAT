import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export type TypingUser = {
  user_id: string
  is_typing: boolean
  updated_at: string
}

export function useTypingStatus(chatId: number) {
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([])
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Subscribe to typing status changes
    const channel = supabase
      .channel(`typing:${chatId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'typing_status',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            setTypingUsers((prev) => {
              const existing = prev.find((user) => user.user_id === payload.new.user_id)
              if (existing) {
                return prev.map((user) =>
                  user.user_id === payload.new.user_id ? { ...user, ...payload.new } : user
                )
              }
              return [...prev, payload.new as TypingUser]
            })
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [chatId])

  const setTypingStatus = useCallback(async (isTyping: boolean) => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) throw authError
      
      if (!user) {
        router.push('/auth/signin')
        return
      }

      const { error: upsertError } = await supabase
        .from('typing_status')
        .upsert(
          {
            chat_id: chatId,
            user_id: user.id,
            is_typing: isTyping,
          },
          {
            onConflict: 'chat_id,user_id',
          }
        )

      if (upsertError) throw upsertError
    } catch (err) {
      const error = err as Error
      setError(error.message)
    }
  }, [chatId, router])

  // Clean up typing status when component unmounts
  useEffect(() => {
    return () => {
      setTypingStatus(false)
    }
  }, [setTypingStatus])

  return {
    typingUsers: typingUsers.filter((user) => user.is_typing),
    error,
    setTypingStatus,
  }
} 