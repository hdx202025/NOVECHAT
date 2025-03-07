import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export type Message = {
  id: string
  chat_id: number
  sender_id: string
  message: string
  created_at: string
  status: 'sent' | 'delivered' | 'read'
  media_url?: string
  media_type?: string
}

export function useMessages(chatId: number) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Fetch initial messages
    fetchMessages()

    // Subscribe to new messages
    const channel = supabase
      .channel(`chat:${chatId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMessages((prev) => [...prev, payload.new as Message])
          } else if (payload.eventType === 'UPDATE') {
            setMessages((prev) =>
              prev.map((message) =>
                message.id === payload.new.id ? { ...message, ...payload.new } : message
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setMessages((prev) =>
              prev.filter((message) => message.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [chatId])

  const fetchMessages = async () => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true })

      if (supabaseError) throw supabaseError

      setMessages(data || [])
      setLoading(false)
    } catch (err) {
      const error = err as Error
      setError(error.message)
      setLoading(false)
    }
  }

  const sendMessage = async (message: string, mediaUrl?: string, mediaType?: string) => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) throw authError
      
      if (!user) {
        router.push('/auth/signin')
        return
      }

      const { error: insertError } = await supabase.from('messages').insert({
        chat_id: chatId,
        sender_id: user.id,
        message,
        media_url: mediaUrl,
        media_type: mediaType,
      })

      if (insertError) throw insertError
    } catch (err) {
      const error = err as Error
      setError(error.message)
    }
  }

  const updateMessageStatus = async (messageId: string, status: 'delivered' | 'read') => {
    try {
      const { error: updateError } = await supabase
        .from('messages')
        .update({ status })
        .eq('id', messageId)

      if (updateError) throw updateError
    } catch (err) {
      const error = err as Error
      setError(error.message)
    }
  }

  return {
    messages,
    loading,
    error,
    sendMessage,
    updateMessageStatus,
  }
} 