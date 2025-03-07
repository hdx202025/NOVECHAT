import Header from '@/components/layout/Header'
import NavigationBar from '@/components/layout/NavigationBar'

export default function ChatsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background-white">
      <Header title="Chats" />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      <NavigationBar />
    </div>
  )
} 