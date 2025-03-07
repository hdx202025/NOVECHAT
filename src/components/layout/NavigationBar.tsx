'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageCircle, Phone, User, Settings } from 'lucide-react'

export default function NavigationBar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/chats' && pathname.startsWith('/chat/')) {
      return true
    }
    return pathname === path
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-[60px] px-4 w-full">
      <Link 
        href="/profile" 
        className={`flex flex-col items-center justify-center ${
          isActive('/profile') ? 'text-primary-blue' : 'text-text-light'
        }`}
      >
        <User className="w-6 h-6" />
        <span className="text-xs mt-1">Account</span>
      </Link>
      <Link 
        href="/calls" 
        className={`flex flex-col items-center justify-center ${
          isActive('/calls') ? 'text-primary-blue' : 'text-text-light'
        }`}
      >
        <Phone className="w-6 h-6" />
        <span className="text-xs mt-1">Calls</span>
      </Link>
      <Link 
        href="/chats" 
        className={`flex flex-col items-center justify-center ${
          isActive('/chats') ? 'text-primary-blue' : 'text-text-light'
        }`}
      >
        <MessageCircle className="w-6 h-6" />
        <span className="text-xs mt-1">Chats</span>
      </Link>
      <Link 
        href="/settings" 
        className={`flex flex-col items-center justify-center ${
          isActive('/settings') ? 'text-primary-blue' : 'text-text-light'
        }`}
      >
        <Settings className="w-6 h-6" />
        <span className="text-xs mt-1">Settings</span>
      </Link>
    </nav>
  )
} 