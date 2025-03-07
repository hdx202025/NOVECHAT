'use client'

import Link from 'next/link'
import { Mail } from 'lucide-react'

export default function Verify() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-50 px-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-primary-blue" />
          </div>
          
          <h1 className="text-2xl font-bold text-text-dark mb-4">Check Your Email</h1>
          <p className="text-text-light mb-6">
            We've sent you a verification link to your email address. Please click the link to verify your account.
          </p>
          
          <div className="space-y-4">
            <Link
              href="/auth/signin"
              className="block w-full bg-primary-blue text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Return to Sign In
            </Link>
            
            <p className="text-sm text-text-light">
              Didn't receive the email? Check your spam folder or{' '}
              <Link href="/auth/signup" className="text-primary-blue hover:underline">
                try again
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 