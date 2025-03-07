'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Lock, Phone, Fingerprint } from 'lucide-react'
import useBiometrics from '@/hooks/useBiometrics'

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('+49')
  const [password, setPassword] = useState('')
  const [userId, setUserId] = useState('user123') // In a real app, this would be generated or retrieved
  const { isAvailable, isSupported, isRegistered, error, register, verify } = useBiometrics()
  const [biometricStatus, setBiometricStatus] = useState<'available' | 'unavailable' | 'registered' | 'verifying' | 'verified' | 'failed'>('unavailable')

  // Check biometric availability on component mount
  useEffect(() => {
    if (isAvailable && isSupported) {
      setBiometricStatus(isRegistered ? 'registered' : 'available')
    } else {
      setBiometricStatus('unavailable')
    }
  }, [isAvailable, isSupported, isRegistered])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would handle authentication
    console.log('Login attempt with:', { phoneNumber, password })
  }

  const handleBiometricRegister = async () => {
    if (biometricStatus === 'available') {
      try {
        setBiometricStatus('verifying')
        const success = await register(userId, phoneNumber)
        setBiometricStatus(success ? 'registered' : 'failed')
      } catch (error) {
        console.error('Biometric registration error:', error)
        setBiometricStatus('failed')
      }
    }
  }

  const handleBiometricLogin = async () => {
    if (biometricStatus === 'registered') {
      try {
        setBiometricStatus('verifying')
        const success = await verify()
        setBiometricStatus(success ? 'verified' : 'failed')
        
        if (success) {
          // In a real app, this would authenticate the user
          console.log('Biometric authentication successful')
          // Redirect to chats page after successful authentication
          window.location.href = '/chats'
        }
      } catch (error) {
        console.error('Biometric verification error:', error)
        setBiometricStatus('failed')
      }
    }
  }

  return (
    <div className="min-h-screen bg-background-white flex flex-col">
      {/* Status bar - 44px height */}
      <div className="h-11 bg-white border-b border-gray-100 flex items-center px-4">
        <Link href="/" className="text-primary-blue">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-lg font-medium text-text-dark mx-auto">Login</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary-blue mb-2">NOVA CHAT</h1>
            <h2 className="text-2xl font-bold text-text-dark">Welcome Back</h2>
            <p className="text-text-light mt-2">Sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-text-dark mb-1">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-text-light" />
                </div>
                <input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary-blue focus:border-primary-blue"
                  placeholder="+49 123 456 7890"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-dark mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-text-light" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary-blue focus:border-primary-blue"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary-blue hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue"
              >
                Sign In
              </button>
            </div>
          </form>

          {/* Biometric authentication section */}
          {biometricStatus !== 'unavailable' && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background-white text-text-light">Or use biometrics</span>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                {biometricStatus === 'available' && (
                  <button
                    type="button"
                    onClick={handleBiometricRegister}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-blue hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue"
                  >
                    <Fingerprint className="h-5 w-5 mr-2" />
                    Set Up Biometric Login
                  </button>
                )}

                {biometricStatus === 'registered' && (
                  <button
                    type="button"
                    onClick={handleBiometricLogin}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-blue hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue"
                  >
                    <Fingerprint className="h-5 w-5 mr-2" />
                    Sign In with Biometrics
                  </button>
                )}

                {biometricStatus === 'verifying' && (
                  <div className="text-center">
                    <Fingerprint className="h-8 w-8 mx-auto text-primary-blue animate-pulse" />
                    <p className="mt-2 text-sm text-text-dark">Verifying...</p>
                  </div>
                )}

                {biometricStatus === 'verified' && (
                  <div className="text-center">
                    <Fingerprint className="h-8 w-8 mx-auto text-green-500" />
                    <p className="mt-2 text-sm text-green-500">Verified! Redirecting...</p>
                  </div>
                )}

                {biometricStatus === 'failed' && (
                  <div className="text-center">
                    <Fingerprint className="h-8 w-8 mx-auto text-red-500" />
                    <p className="mt-2 text-sm text-red-500">
                      {error || 'Verification failed. Please try again.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link href="/forgot-password" className="text-primary-blue hover:underline">
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 