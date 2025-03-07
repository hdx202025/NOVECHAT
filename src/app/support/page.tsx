'use client'

import { useState } from 'react'
import { ChevronDown, Mail, MessageCircle, Phone, ExternalLink, Search } from 'lucide-react'
import Header from '@/components/layout/Header'
import NavigationBar from '@/components/layout/NavigationBar'

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    category: 'Getting Started',
    question: 'How do I create a new chat?',
    answer: 'To create a new chat, click the "+" button in the bottom navigation bar or the "New Chat" button on the home screen. You can then select contacts to start a private chat or create a group chat.'
  },
  {
    category: 'Getting Started',
    question: 'How do I add contacts?',
    answer: 'You can add contacts by clicking on the "Contacts" tab in the navigation bar and then clicking the "Add Contact" button. Enter their details and send them a contact request.'
  },
  {
    category: 'Messages',
    question: 'Can I delete messages?',
    answer: 'Yes, you can delete messages by long-pressing on a message and selecting the "Delete" option. You can choose to delete the message for yourself or for everyone in the chat.'
  },
  {
    category: 'Messages',
    question: 'How do I use message templates?',
    answer: 'Message templates can be accessed by clicking the template icon in the message input area. You can create new templates, organize them by category, and quickly insert them into your messages.'
  },
  {
    category: 'Groups',
    question: 'How do I create a group?',
    answer: 'To create a group, click the "+" button and select "New Group". You can then add participants, set a group name and photo, and optionally designate group admins.'
  },
  {
    category: 'Groups',
    question: 'How do I manage group settings?',
    answer: 'Group settings can be accessed by clicking the group name at the top of a group chat. Here you can modify group info, manage participants, and adjust notification settings.'
  },
  {
    category: 'Privacy & Security',
    question: 'Is my data encrypted?',
    answer: 'Yes, all messages and calls in Nova Chat are end-to-end encrypted by default. Your messages can only be read by the intended recipients.'
  },
  {
    category: 'Privacy & Security',
    question: 'How do I change my privacy settings?',
    answer: 'Privacy settings can be found in the Settings menu under "Privacy & Security". Here you can adjust who can see your profile, last seen status, and other privacy options.'
  }
]

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  // Get unique categories
  const categories = Array.from(new Set(FAQ_DATA.map(item => item.category)))

  // Filter FAQ items based on search
  const filteredFAQ = FAQ_DATA.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Toggle FAQ item expansion
  const toggleItem = (question: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev)
      if (next.has(question)) {
        next.delete(question)
      } else {
        next.add(question)
      }
      return next
    })
  }

  return (
    <div className="min-h-screen bg-background-white flex flex-col">
      <Header title="Support" />

      <main className="flex-1 overflow-y-auto pb-[60px]">
        {/* Search */}
        <div className="p-4 sticky top-0 bg-white z-10 shadow-sm">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search help articles..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Contact Support */}
        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="mailto:support@novachat.com"
              className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-primary-blue"
            >
              <Mail className="w-6 h-6 text-primary-blue" />
              <div className="ml-3">
                <h3 className="font-medium">Email Support</h3>
                <p className="text-sm text-gray-500">support@novachat.com</p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
            </a>
            <a
              href="tel:+1234567890"
              className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-primary-blue"
            >
              <Phone className="w-6 h-6 text-primary-blue" />
              <div className="ml-3">
                <h3 className="font-medium">Phone Support</h3>
                <p className="text-sm text-gray-500">Mon-Fri, 9AM-5PM EST</p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
            </a>
            <a
              href="/chat/support"
              className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-primary-blue"
            >
              <MessageCircle className="w-6 h-6 text-primary-blue" />
              <div className="ml-3">
                <h3 className="font-medium">Live Chat</h3>
                <p className="text-sm text-gray-500">Chat with our support team</p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
            </a>
          </div>
        </div>

        {/* FAQ */}
        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Frequently Asked Questions
          </h2>
          {searchQuery ? (
            // Show all matching FAQ items when searching
            <div className="space-y-4">
              {filteredFAQ.map(item => (
                <div
                  key={item.question}
                  className="bg-white rounded-lg shadow-sm border border-gray-100"
                >
                  <button
                    onClick={() => toggleItem(item.question)}
                    className="w-full text-left p-4 flex items-center justify-between"
                  >
                    <span className="font-medium">{item.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transform transition-transform ${
                        expandedItems.has(item.question) ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expandedItems.has(item.question) && (
                    <div className="px-4 pb-4">
                      <p className="text-gray-600">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            // Show categorized FAQ items when not searching
            <div className="space-y-6">
              {categories.map(category => (
                <div key={category}>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">
                    {category}
                  </h3>
                  <div className="space-y-4">
                    {FAQ_DATA
                      .filter(item => item.category === category)
                      .map(item => (
                        <div
                          key={item.question}
                          className="bg-white rounded-lg shadow-sm border border-gray-100"
                        >
                          <button
                            onClick={() => toggleItem(item.question)}
                            className="w-full text-left p-4 flex items-center justify-between"
                          >
                            <span className="font-medium">{item.question}</span>
                            <ChevronDown
                              className={`w-5 h-5 text-gray-400 transform transition-transform ${
                                expandedItems.has(item.question) ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                          {expandedItems.has(item.question) && (
                            <div className="px-4 pb-4">
                              <p className="text-gray-600">{item.answer}</p>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Additional Resources */}
        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Additional Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/docs"
              className="block p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-primary-blue"
            >
              <h3 className="font-medium mb-1">Documentation</h3>
              <p className="text-sm text-gray-500">
                Detailed guides and API documentation
              </p>
            </a>
            <a
              href="/blog"
              className="block p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-primary-blue"
            >
              <h3 className="font-medium mb-1">Blog</h3>
              <p className="text-sm text-gray-500">
                Latest updates and feature announcements
              </p>
            </a>
            <a
              href="/community"
              className="block p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-primary-blue"
            >
              <h3 className="font-medium mb-1">Community Forum</h3>
              <p className="text-sm text-gray-500">
                Connect with other Nova Chat users
              </p>
            </a>
            <a
              href="/tutorials"
              className="block p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-primary-blue"
            >
              <h3 className="font-medium mb-1">Video Tutorials</h3>
              <p className="text-sm text-gray-500">
                Step-by-step guides and walkthroughs
              </p>
            </a>
          </div>
        </div>
      </main>

      <NavigationBar />
    </div>
  )
} 