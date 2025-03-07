'use client'

import { useState } from 'react'
import { Camera, Edit2 } from 'lucide-react'
import NavigationBar from '@/components/layout/NavigationBar'

export default function ProfilePage() {
  const [name, setName] = useState('John Doe')
  const [bio, setBio] = useState('Software Developer | Tech Enthusiast')
  const [phone, setPhone] = useState('+49 123 456 7890')
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = () => {
    // In a real app, this would save the profile data to the backend
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-background-white flex flex-col">
      {/* Header - 44px height */}
      <div className="h-11 bg-white border-b border-gray-100 flex items-center justify-between px-4">
        <h1 className="text-xl font-bold text-text-dark hover:text-primary-blue transition-colors duration-300">Profile</h1>
        <button 
          onClick={() => setIsEditing(!isEditing)} 
          className="text-primary-blue hover:scale-110 transition-transform duration-300"
        >
          {isEditing ? 'Cancel' : <Edit2 className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-[60px]">
        {/* Profile picture */}
        <div className="p-6 flex flex-col items-center">
          <div className="relative">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-3xl font-semibold text-gray-700">
                {name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md">
              <Camera className="w-5 h-5 text-primary-blue" />
            </button>
          </div>
        </div>

        {/* Profile info */}
        <div className="px-4 space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-light mb-1">
              Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-blue focus:border-primary-blue"
              />
            ) : (
              <p className="text-text-dark">{name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-light mb-1">
              Bio
            </label>
            {isEditing ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-blue focus:border-primary-blue"
              />
            ) : (
              <p className="text-text-dark">{bio}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-light mb-1">
              Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-blue focus:border-primary-blue"
              />
            ) : (
              <p className="text-text-dark">{phone}</p>
            )}
          </div>

          {isEditing && (
            <button
              onClick={handleSave}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary-blue hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue"
            >
              Save Changes
            </button>
          )}
        </div>

        {/* Account stats */}
        <div className="mt-8 bg-white">
          <div className="grid grid-cols-3 divide-x divide-gray-100">
            <div className="p-4 text-center">
              <p className="text-2xl font-bold text-primary-blue">152</p>
              <p className="text-sm text-text-light">Messages</p>
            </div>
            <div className="p-4 text-center">
              <p className="text-2xl font-bold text-primary-blue">28</p>
              <p className="text-sm text-text-light">Groups</p>
            </div>
            <div className="p-4 text-center">
              <p className="text-2xl font-bold text-primary-blue">5</p>
              <p className="text-sm text-text-light">Calls</p>
            </div>
          </div>
        </div>
      </div>

      <NavigationBar />
    </div>
  )
} 