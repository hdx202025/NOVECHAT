'use client'

import Link from 'next/link'
import { Menu } from 'lucide-react'
import NotificationCenter from '@/components/features/NotificationCenter'
import { useState } from 'react'

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  backUrl?: string;
}

export default function Header({ title, showBackButton = false, backUrl = '/' }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="h-11 bg-white border-b border-gray-100 flex items-center justify-between px-4 sticky top-0 z-10">
      <div className="flex items-center">
        {showBackButton ? (
          <Link href={backUrl} className="text-primary-blue mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
        ) : (
          <button 
            onClick={() => setMenuOpen(!menuOpen)} 
            className="text-text-dark mr-3 md:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
        <h1 className="text-lg font-bold text-text-dark">{title}</h1>
      </div>
      
      <div className="flex items-center space-x-2">
        <NotificationCenter />
      </div>
      
      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-11 left-0 right-0 bg-white shadow-lg z-20 md:hidden">
          <nav className="py-2">
            <ul>
              <li>
                <Link 
                  href="/profile" 
                  className="block px-4 py-2 text-text-dark hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link 
                  href="/settings" 
                  className="block px-4 py-2 text-text-dark hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Settings
                </Link>
              </li>
              <li>
                <button 
                  className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                  onClick={() => {
                    // Handle logout
                    setMenuOpen(false)
                  }}
                >
                  Log Out
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  )
} 