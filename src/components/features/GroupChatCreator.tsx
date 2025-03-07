'use client'

import { useState } from 'react'
import { X, Search, Check, Users } from 'lucide-react'
import { useRealtime } from '@/contexts/RealtimeContext'
import { useRouter } from 'next/navigation'

interface GroupChatCreatorProps {
  onClose: () => void;
}

// Mock contacts data (in a real app, this would come from an API)
const contacts = [
  { id: 2, name: 'Sarah Johnson', avatar: 'https://picsum.photos/id/64/200', online: true },
  { id: 3, name: 'David Wilson', avatar: 'https://picsum.photos/id/91/200', online: true },
  { id: 4, name: 'Emma Thompson', avatar: 'https://picsum.photos/id/26/200', online: false },
  { id: 5, name: 'Maria Garcia', avatar: 'https://picsum.photos/id/54/200', online: true },
]

export default function GroupChatCreator({ onClose }: GroupChatCreatorProps) {
  const router = useRouter()
  const { createChat } = useRealtime()
  const [groupName, setGroupName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedContacts, setSelectedContacts] = useState<number[]>([])

  // Filter contacts based on search query
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Toggle contact selection
  const toggleContact = (contactId: number) => {
    setSelectedContacts(prev =>
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    )
  }

  // Handle creating the group
  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedContacts.length === 0) return

    try {
      const chatId = await createChat(groupName.trim(), selectedContacts, true)
      router.push(`/chat/${chatId}`)
      onClose()
    } catch (error) {
      console.error('Failed to create group chat:', error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium flex items-center">
            <Users className="w-5 h-5 text-gray-500 mr-2" />
            Create Group Chat
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Group name input */}
        <div className="p-4 border-b">
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Group name"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Contact search */}
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
        <div className="max-h-[300px] overflow-y-auto">
          {filteredContacts.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No contacts found
            </div>
          ) : (
            <div className="divide-y">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => toggleContact(contact.id)}
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
                  {selectedContacts.includes(contact.id) && (
                    <Check className="w-5 h-5 text-green-500" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create button */}
        <div className="p-4 border-t">
          <button
            onClick={handleCreateGroup}
            disabled={!groupName.trim() || selectedContacts.length === 0}
            className={`w-full py-2 rounded-lg flex items-center justify-center ${
              groupName.trim() && selectedContacts.length > 0
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Create Group
          </button>
        </div>
      </div>
    </div>
  )
} 