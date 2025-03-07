'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageSquare, Phone, Settings, User } from 'lucide-react'

export default function NavigationBar() {
  const pathname = usePathname() || '/'

  const isActive = (path: string) => {
    if (path === '/chats' && pathname.startsWith('/chat/')) {
      return true
    }
    return pathname === path
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2">
      <div className="container mx-auto px-4">
        <div className="flex justify-around items-center">
          <Link href="/chats" className={`flex flex-col items-center ${isActive('/chats') ? 'text-primary' : 'text-gray-500'}`}>
            <MessageSquare className="h-6 w-6" />
            <span className="text-xs mt-1">Chats</span>
          </Link>
          <Link href="/calls" className={`flex flex-col items-center ${isActive('/calls') ? 'text-primary' : 'text-gray-500'}`}>
            <Phone className="h-6 w-6" />
            <span className="text-xs mt-1">Calls</span>
          </Link>
          <Link href="/profile" className={`flex flex-col items-center ${isActive('/profile') ? 'text-primary' : 'text-gray-500'}`}>
            <User className="h-6 w-6" />
            <span className="text-xs mt-1">Profile</span>
          </Link>
          <Link href="/settings" className={`flex flex-col items-center ${isActive('/settings') ? 'text-primary' : 'text-gray-500'}`}>
            <Settings className="h-6 w-6" />
            <span className="text-xs mt-1">Settings</span>
          </Link>
        </div>
      </div>
    </nav>
  )
} 