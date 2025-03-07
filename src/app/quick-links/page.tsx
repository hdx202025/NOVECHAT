'use client'

import { useState } from 'react'
import { Search, Star, Clock, Plus, Edit2, Trash2 } from 'lucide-react'
import Header from '@/components/layout/Header'
import NavigationBar from '@/components/layout/NavigationBar'

interface QuickLink {
  id: string;
  title: string;
  url: string;
  category: string;
  isFavorite: boolean;
  lastAccessed?: number;
}

export default function QuickLinksPage() {
  const [links, setLinks] = useState<QuickLink[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nova_chat_quick_links')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingLink, setEditingLink] = useState<QuickLink | null>(null)
  const [newLink, setNewLink] = useState({
    title: '',
    url: '',
    category: '',
  })

  // Save links to localStorage whenever they change
  const saveLinks = (updatedLinks: QuickLink[]) => {
    setLinks(updatedLinks)
    localStorage.setItem('nova_chat_quick_links', JSON.stringify(updatedLinks))
  }

  // Add or update a link
  const handleSaveLink = () => {
    if (!newLink.title || !newLink.url) return

    if (editingLink) {
      // Update existing link
      const updatedLinks = links.map(link =>
        link.id === editingLink.id
          ? { ...link, ...newLink }
          : link
      )
      saveLinks(updatedLinks)
    } else {
      // Add new link
      const newLinkItem: QuickLink = {
        id: Date.now().toString(),
        ...newLink,
        isFavorite: false,
      }
      saveLinks([...links, newLinkItem])
    }

    setNewLink({ title: '', url: '', category: '' })
    setEditingLink(null)
    setShowAddModal(false)
  }

  // Delete a link
  const handleDeleteLink = (id: string) => {
    const updatedLinks = links.filter(link => link.id !== id)
    saveLinks(updatedLinks)
  }

  // Toggle favorite status
  const handleToggleFavorite = (id: string) => {
    const updatedLinks = links.map(link =>
      link.id === id ? { ...link, isFavorite: !link.isFavorite } : link
    )
    saveLinks(updatedLinks)
  }

  // Handle link click
  const handleLinkClick = (link: QuickLink) => {
    const updatedLinks = links.map(l =>
      l.id === link.id ? { ...l, lastAccessed: Date.now() } : l
    )
    saveLinks(updatedLinks)
    window.open(link.url, '_blank')
  }

  // Filter and sort links
  const filteredLinks = links
    .filter(link =>
      link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      // Sort by favorite first, then by last accessed
      if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1
      return (b.lastAccessed || 0) - (a.lastAccessed || 0)
    })

  // Get unique categories
  const categories = Array.from(new Set(links.map(link => link.category)))

  return (
    <div className="min-h-screen bg-background-white flex flex-col">
      <Header title="Quick Links" />

      <main className="flex-1 overflow-y-auto pb-[60px]">
        {/* Search and Add */}
        <div className="p-4 sticky top-0 bg-white z-10 shadow-sm">
          <div className="relative mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search quick links..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full py-2 bg-primary-blue text-white rounded-lg flex items-center justify-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Link
          </button>
        </div>

        {/* Links List */}
        <div className="p-4">
          {categories.map(category => (
            <div key={category} className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">{category}</h2>
              <div className="space-y-3">
                {filteredLinks
                  .filter(link => link.category === category)
                  .map(link => (
                    <div
                      key={link.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-100 p-3"
                    >
                      <div className="flex items-start justify-between">
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => handleLinkClick(link)}
                        >
                          <h3 className="text-primary-blue font-medium">{link.title}</h3>
                          <p className="text-sm text-gray-500 truncate">{link.url}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleToggleFavorite(link.id)}
                            className={`p-1 rounded-full ${
                              link.isFavorite ? 'text-yellow-500' : 'text-gray-400'
                            }`}
                          >
                            <Star className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingLink(link)
                              setNewLink({
                                title: link.title,
                                url: link.url,
                                category: link.category,
                              })
                              setShowAddModal(true)
                            }}
                            className="p-1 rounded-full text-gray-400 hover:text-gray-600"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteLink(link.id)}
                            className="p-1 rounded-full text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      {link.lastAccessed && (
                        <div className="mt-2 flex items-center text-xs text-gray-400">
                          <Clock className="w-3 h-3 mr-1" />
                          Last accessed: {new Date(link.lastAccessed).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-4">
            <h2 className="text-lg font-medium mb-4">
              {editingLink ? 'Edit Link' : 'Add New Link'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newLink.title}
                  onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  placeholder="Enter link title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL
                </label>
                <input
                  type="url"
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  placeholder="Enter URL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={newLink.category}
                  onChange={(e) => setNewLink({ ...newLink, category: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  placeholder="Enter category"
                  list="categories"
                />
                <datalist id="categories">
                  {categories.map(cat => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setEditingLink(null)
                  setNewLink({ title: '', url: '', category: '' })
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveLink}
                disabled={!newLink.title || !newLink.url}
                className={`px-4 py-2 rounded-lg ${
                  newLink.title && newLink.url
                    ? 'bg-primary-blue text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {editingLink ? 'Update' : 'Add'} Link
              </button>
            </div>
          </div>
        </div>
      )}

      <NavigationBar />
    </div>
  )
} 