import Image from 'next/image'
import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, Video } from 'lucide-react'
import NavigationBar from '@/components/layout/NavigationBar'

// Mock data for calls list
const callsList = [
  {
    id: 1,
    name: 'Sarah Johnson',
    time: '10:42 AM',
    type: 'incoming',
    isVideo: false,
    missed: false,
    avatar: 'https://picsum.photos/id/64/200',
  },
  {
    id: 2,
    name: 'David Wilson',
    time: 'Yesterday',
    type: 'outgoing',
    isVideo: true,
    missed: false,
    avatar: 'https://picsum.photos/id/91/200',
  },
  {
    id: 3,
    name: 'Emma Thompson',
    time: 'Yesterday',
    type: 'incoming',
    isVideo: false,
    missed: true,
    avatar: 'https://picsum.photos/id/26/200',
  },
  {
    id: 4,
    name: 'Alex Rodriguez',
    time: 'Monday',
    type: 'outgoing',
    isVideo: false,
    missed: false,
    avatar: 'https://picsum.photos/id/22/200',
  },
  {
    id: 5,
    name: 'Sarah Johnson',
    time: 'Monday',
    type: 'incoming',
    isVideo: true,
    missed: false,
    avatar: 'https://picsum.photos/id/64/200',
  },
]

export default function CallsPage() {
  return (
    <div className="min-h-screen bg-background-white flex flex-col">
      {/* Header - 44px height */}
      <div className="h-11 bg-white border-b border-gray-100 flex items-center px-4">
        <h1 className="text-xl font-bold text-text-dark">Calls</h1>
      </div>

      {/* Calls list */}
      <div className="flex-1 overflow-y-auto pb-[60px]">
        {callsList.map((call) => (
          <div key={call.id} className="flex items-center p-4 border-b border-gray-100 h-[72px]">
            <div className="relative">
              <Image
                src={call.avatar}
                alt={call.name}
                width={48}
                height={48}
                className="rounded-full"
              />
            </div>
            <div className="ml-3 flex-1">
              <div className="flex justify-between">
                <h3 className="text-text-dark font-medium">{call.name}</h3>
                <span className="text-xs text-text-light">{call.time}</span>
              </div>
              <div className="flex items-center mt-1">
                {call.type === 'incoming' ? (
                  call.missed ? (
                    <PhoneMissed className="h-4 w-4 text-red-500 mr-1" />
                  ) : (
                    <PhoneIncoming className="h-4 w-4 text-green-500 mr-1" />
                  )
                ) : (
                  <PhoneOutgoing className="h-4 w-4 text-primary-blue mr-1" />
                )}
                <p className={`text-sm ${call.missed ? 'text-red-500' : 'text-text-light'}`}>
                  {call.type === 'incoming' ? 'Incoming' : 'Outgoing'} {call.isVideo ? 'video' : 'voice'} call
                </p>
              </div>
            </div>
            <button className="ml-2 p-2 rounded-full bg-primary-blue text-white">
              {call.isVideo ? (
                <Video className="h-5 w-5" />
              ) : (
                <Phone className="h-5 w-5" />
              )}
            </button>
          </div>
        ))}
      </div>

      <NavigationBar />
    </div>
  )
} 