'use client'

import { useState } from 'react'
import { X, Search, Check, Users, Globe, Lock, Settings } from 'lucide-react'
import { useRealtime } from '@/contexts/RealtimeContext'
import { useRouter } from 'next/navigation'

interface ChannelCreatorProps {
  onClose: () => void;
}

// Mock contacts data (in a real app, this would come from an API)
const contacts = [
  { id: 2, name: 'Sarah Johnson', avatar: 'https://picsum.photos/id/64/200', online: true },
  { id: 3, name: 'David Wilson', avatar: 'https://picsum.photos/id/91/200', online: true },
  { id: 4, name: 'Emma Thompson', avatar: 'https://picsum.photos/id/26/200', online: false },
  { id: 5, name: 'Maria Garcia', avatar: 'https://picsum.photos/id/54/200', online: true },
]

export default function ChannelCreator({ onClose }: ChannelCreatorProps) {
  const router = useRouter()
  const { createChat } = useRealtime()
  const [channelName, setChannelName] = useState('')
  const [description, setDescription] = useState('')
  const [channelType, setChannelType] = useState<'public' | 'private'>('public')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedModerators, setSelectedModerators] = useState<number[]>([])
  const [step, setStep] = useState<'info' | 'moderators'>('info')

  // Filter contacts based on search query
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Toggle moderator selection
  const toggleModerator = (contactId: number) => {
    setSelectedModerators(prev =>
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    )
  }

  // Handle creating the channel
  const handleCreateChannel = async () => {
    if (!channelName.trim()) return

    try {
      const chatId = await createChat(
        channelName.trim(),
        [], // Initially empty for channels
        true, // isGroup
        {
          isChannel: true,
          description: description.trim(),
          channelType,
          moderators: selectedModerators
        }
      )
      router.push(`/chat/${chatId}`)
      onClose()
    } catch (error) {
      console.error('Failed to create channel:', error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium flex items-center">
            <Globe className="w-5 h-5 text-gray-500 mr-2" />
            Create Channel
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'info' ? (
          <>
            {/* Channel Info */}
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Channel Name
                </label>
                <input
                  type="text"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  placeholder="Enter channel name"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your channel"
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Channel Type
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => setChannelType('public')}
                    className={`w-full p-3 rounded-lg border flex items-center ${
                      channelType === 'public'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300'
                    }`}
                  >
                    <Globe className={`w-5 h-5 ${
                      channelType === 'public' ? 'text-blue-500' : 'text-gray-500'
                    } mr-2`} />
                    <div className="text-left">
                      <div className="font-medium">Public Channel</div>
                      <div className="text-sm text-gray-500">Anyone can find and join</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setChannelType('private')}
                    className={`w-full p-3 rounded-lg border flex items-center ${
                      channelType === 'private'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300'
                    }`}
                  >
                    <Lock className={`w-5 h-5 ${
                      channelType === 'private' ? 'text-blue-500' : 'text-gray-500'
                    } mr-2`} />
                    <div className="text-left">
                      <div className="font-medium">Private Channel</div>
                      <div className="text-sm text-gray-500">Only invited people can join</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Next button */}
            <div className="p-4 border-t">
              <button
                onClick={() => setStep('moderators')}
                disabled={!channelName.trim()}
                className={`w-full py-2 rounded-lg ${
                  channelName.trim()
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Next: Add Moderators
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Moderator selection */}
            <div className="p-4 border-b">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search contacts..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Contact list */}
            <div className="max-h-60 overflow-y-auto">
              {filteredContacts.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No contacts found
                </div>
              ) : (
                <div className="divide-y">
                  {filteredContacts.map((contact) => (
                    <div
                      key={contact.id}
                      onClick={() => toggleModerator(contact.id)}
                      className="p-4 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-base font-semibold text-gray-700">
                              {contact.name.charAt(0)}
                            </span>
                          </div>
                          {contact.online && (
                            <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="ml-3">
                          <div className="font-medium">{contact.name}</div>
                          <div className="text-sm text-gray-500">
                            {contact.online ? 'Online' : 'Offline'}
                          </div>
                        </div>
                      </div>
                      {selectedModerators.includes(contact.id) && (
                        <Check className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Create button */}
            <div className="p-4 border-t flex space-x-3">
              <button
                onClick={() => setStep('info')}
                className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleCreateChannel}
                className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Create Channel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
} 