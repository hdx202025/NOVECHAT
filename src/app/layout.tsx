import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import { RealtimeProvider } from '@/contexts/RealtimeContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Nova Chat - Secure Messaging App',
  description: 'A secure, encrypted messaging app built with Next.js and Tailwind CSS',
  manifest: '/manifest.json',
  themeColor: '#0088CC',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Nova Chat'
  },
  icons: {},
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="application-name" content="Nova Chat" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Nova Chat" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#0088CC" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className={`${inter.className} min-h-screen bg-background-white`}>
        <RealtimeProvider>
          {children}
        </RealtimeProvider>
        <Script id="register-service-worker" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(
                  function(registration) {
                    console.log('Service Worker registration successful with scope: ', registration.scope);
                  },
                  function(err) {
                    console.log('Service Worker registration failed: ', err);
                  }
                );
              });
            }
          `}
        </Script>
      </body>
    </html>
  )
} 