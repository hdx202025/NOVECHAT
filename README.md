# Nova Chat - Secure Mobile Messaging App

A secure, encrypted messaging app built with Next.js and Tailwind CSS, compatible with both Android and iOS devices.

## Deployment Instructions

### Prerequisites

1. Create accounts on:
   - [Vercel](https://vercel.com)
   - [Supabase](https://supabase.com)

2. Install dependencies:
   ```bash
   npm install
   ```

### Supabase Setup

1. Create a new Supabase project
2. Go to Project Settings > API
3. Copy the Project URL and anon/public key
4. Add these URLs to your Supabase Authentication Settings:
   - Site URL: `https://your-domain.vercel.app`
   - Redirect URLs:
     - `https://your-domain.vercel.app/auth/callback`
     - `https://your-domain.vercel.app/auth/signin`
     - `https://your-domain.vercel.app/auth/signup`

### Local Development

1. Create a `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

2. Generate PWA icons:
   ```bash
   npm run generate-icons
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

### Vercel Deployment

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your GitHub repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy!

## Features

- End-to-end encryption using Web Crypto API
- Biometric authentication (fingerprint/face recognition)
- Real-time messaging with message status indicators
- Group chat functionality
- Voice messaging and audio recording
- File sharing (images, documents, audio, video)
- Message reactions with emoji
- Read receipts for individual and group chats
- Typing indicators
- Message forwarding to other chats
- Message deletion (for me/for everyone)
- Message search within conversations
- Message pinning for important information
- Message scheduling for future delivery
- Message translation to multiple languages
- Message reminders for follow-ups
- Message templates for quick responses
- Message bookmarking with notes and categories
- Chat archiving for better organization
- Push notifications for new messages
- Notification center for managing alerts
- Mobile-first responsive design
- Progressive Web App (PWA) support for Android and iOS
- Offline capabilities with service worker
- Chat list with user status indicators
- Individual chat conversations
- Message input with attachment options
- User authentication
- Bottom navigation bar
- Clean, modern UI

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Web Crypto API for encryption
- Web Authentication API (WebAuthn) for biometrics
- Web Push API for notifications
- Service Workers for offline support
- PWA capabilities for mobile installation
- Context API for state management
- Supabase
- Vercel

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── NavigationBar.tsx
│   │   └── Header.tsx
│   ├── features/
│   │   ├── ChatListItem.tsx
│   │   ├── ChatMessage.tsx
│   │   ├── GroupChatCreator.tsx
│   │   ├── MediaControls.tsx
│   │   ├── MessageReactions.tsx
│   │   ├── ReadReceipts.tsx
│   │   ├── MessageActions.tsx
│   │   ├── PinnedMessages.tsx
│   │   ├── MessageSearch.tsx
│   │   ├── MessageScheduler.tsx
│   │   ├── ScheduledMessages.tsx
│   │   ├── MessageTranslator.tsx
│   │   ├── MessageReminder.tsx
│   │   ├── MessageTemplates.tsx
│   │   ├── BookmarksManager.tsx
│   │   ├── ArchivedChats.tsx
│   │   ├── TypingIndicator.tsx
│   │   └── NotificationCenter.tsx
│   └── shared/
│       └── UserAvatar.tsx
├── contexts/
│   └── RealtimeContext.tsx
├── app/
│   ├── page.tsx (Home)
│   ├── login/page.tsx
│   ├── chats/
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── chat/[id]/page.tsx
│   ├── profile/page.tsx
│   ├── settings/page.tsx
│   └── calls/page.tsx
├── hooks/
│   ├── useEncryption.ts
│   ├── useBiometrics.ts
│   ├── useNotifications.ts
│   ├── useMedia.ts
│   └── useResponsive.ts
├── utils/
│   ├── encryption.ts
│   ├── biometrics.ts
│   ├── notifications.ts
│   ├── media.ts
│   └── formatters.ts
└── styles/
    └── globals.css
```

## Components

### Layout Components

- **NavigationBar**: Bottom navigation bar with links to main sections of the app.
- **Header**: Top header bar with title, back button, and notification center.

### Feature Components

- **ChatListItem**: Displays a single chat item in the chat list with user avatar, name, last message, time, and unread count.
- **ChatMessage**: Displays a single message in the chat with text, time, and styling based on sender. Supports media attachments like images, audio, video, and documents.
- **GroupChatCreator**: Modal component for creating new group chats with contact selection.
- **MediaControls**: Interface for recording voice messages and attaching files to messages.
- **MessageReactions**: Allows users to react to messages with emoji and displays reaction counts.
- **ReadReceipts**: Shows who has read a message in individual and group chats.
- **MessageActions**: Provides options for forwarding, deleting, copying messages, bookmarking, and archiving chats.
- **PinnedMessages**: Displays and manages pinned messages in a conversation.
- **MessageSearch**: Allows users to search for messages within a conversation.
- **MessageScheduler**: Interface for scheduling messages to be sent at a future time.
- **ScheduledMessages**: Displays and manages scheduled messages for a conversation.
- **MessageTranslator**: Translates messages to different languages.
- **MessageReminder**: Sets reminders for messages to follow up on later.
- **MessageTemplates**: Manages reusable message templates for quick responses.
- **BookmarksManager**: Manages bookmarked messages with notes and categories for easy reference.
- **ArchivedChats**: Displays and manages archived conversations.
- **TypingIndicator**: Displays an animated indicator when someone is typing a message.
- **NotificationCenter**: Manages and displays notifications with support for different types (message, call, system).

### Shared Components

- **UserAvatar**: Reusable avatar component that displays either an image or initials with optional online status indicator.

## Contexts

- **RealtimeContext**: Provides real-time messaging functionality and state management for chats and messages.

## Hooks

- **useEncryption**: Manages encryption keys and provides methods for encrypting and decrypting messages.
- **useBiometrics**: Manages biometric authentication using the Web Authentication API.
- **useNotifications**: Manages push notifications using the Web Push API.
- **useMedia**: Manages voice recording, file sharing functionality.
- **useResponsive**: Detects device type, orientation, and operating system for responsive design.

## Utilities

- **encryption.ts**: Implements end-to-end encryption using the Web Crypto API.
- **biometrics.ts**: Implements biometric authentication using the Web Authentication API.
- **notifications.ts**: Implements push notifications using the Web Push API.
- **media.ts**: Handles voice recording, file validation, and media processing.
- **formatters.ts**: Provides utility functions for formatting dates, times, and file sizes.

## Pages

- **Home**: Landing page with app introduction and features.
- **Login**: User authentication page with phone number, password, and biometric options.
- **Chats**: List of all chat conversations with search functionality and group chat creation.
- **Chat/[id]**: Individual chat conversation with message history, input, and message status indicators.
- **Profile**: User profile page with editable information.
- **Settings**: App settings page with security, notification, and appearance options.
- **Calls**: List of recent calls with call type indicators.

## Mobile Compatibility

Nova Chat is designed as a Progressive Web App (PWA) that can be installed on both Android and iOS devices:

- **Android**: Users can install the app from Chrome by selecting "Add to Home Screen"
- **iOS**: Users can install the app from Safari by selecting "Add to Home Screen"

The app provides a native-like experience with:
- Offline functionality
- Home screen icon
- Full-screen mode
- Responsive design that adapts to different screen sizes and orientations

## Security Features

### End-to-End Encryption

Nova Chat uses the Web Crypto API to implement end-to-end encryption:

- Messages are encrypted on the sender's device before transmission
- Only the recipient with the correct key can decrypt messages
- Encryption keys are securely stored on the device
- The app uses AES-GCM encryption with 256-bit keys

### Biometric Authentication

Nova Chat supports biometric authentication using the Web Authentication API:

- Users can register their biometric data (fingerprint, face recognition)
- Biometric data never leaves the device
- Authentication is handled by the device's secure enclave
- Provides a convenient and secure way to log in

### Push Notifications

Nova Chat implements push notifications using the Web Push API:

- Users receive notifications for new messages even when the app is closed
- Notifications are encrypted for privacy
- Users can control notification permissions
- Notifications work on both Android and iOS devices

## Notification System

Nova Chat includes a comprehensive notification system:

- **Notification Center**: Central hub for viewing and managing all notifications
- **Multiple Notification Types**: Support for message, call, and system notifications
- **Real-time Alerts**: Instant notifications for new messages and calls
- **Customizable Settings**: Users can control which notifications they receive
- **Read/Unread Status**: Visual indicators for unread notifications
- **Notification Actions**: Quick actions like marking as read or dismissing notifications

## Real-time Messaging

Nova Chat provides a real-time messaging experience:

- **Message Status Indicators**: Shows when messages are sent, delivered, and read
- **Typing Indicators**: Displays when someone is typing a message with animated dots
- **Instant Message Delivery**: Messages appear instantly in the chat
- **Offline Support**: Messages are queued when offline and sent when back online
- **Group Chat Support**: Create and manage group conversations with multiple participants
- **Voice Messages**: Record and send voice messages with playback controls
- **File Sharing**: Share images, documents, audio, and video files with previews
- **Message Reactions**: React to messages with emoji reactions
- **Read Receipts**: See who has read your messages in group chats
- **Message Forwarding**: Forward messages to other chats with optional text
- **Message Deletion**: Delete messages for yourself or for everyone in the chat
- **Message Search**: Search for specific text within conversations
- **Message Pinning**: Pin important messages for quick access
- **Message Scheduling**: Schedule messages to be sent at a specific date and time
- **Message Translation**: Translate messages to different languages
- **Message Reminders**: Set reminders for important messages to follow up on later
- **Message Templates**: Save and reuse frequently used messages as templates

## Media Sharing Features

Nova Chat includes comprehensive media sharing capabilities:

- **Voice Messages**: Record, preview, and send voice messages with duration display
- **Image Sharing**: Send images with thumbnails and full-size viewing
- **Document Sharing**: Share PDF and other document types with size information
- **Audio/Video Sharing**: Share audio and video files with built-in players
- **Media Preview**: Preview media before sending with the option to add captions
- **File Size Limits**: Automatic validation of file sizes and types for optimal performance

## Message Management

Nova Chat includes comprehensive message management capabilities:

- **Message Forwarding**: Forward messages to one or multiple chats
- **Message Deletion**: Delete messages for yourself or for everyone (if you're the sender)
- **Copy Text**: Easily copy message text to clipboard
- **Reply to Messages**: Reply directly to specific messages in a conversation
- **Message Context Menu**: Access message options through a convenient context menu
- **Forwarded Message Indicators**: Clear indication of forwarded messages with source information
- **Deleted Message Indicators**: Visual indication of deleted messages
- **Message Search**: Search for text within conversations with result navigation
- **Message Pinning**: Pin important messages for quick reference
- **Pinned Message Browser**: View and navigate through all pinned messages
- **Message Scheduling**: Schedule messages to be sent at a future date and time
- **Scheduled Message Management**: View and cancel scheduled messages
- **Message Translation**: Translate messages to and from multiple languages
- **Language Detection**: Automatic detection of message language
- **Message Reminders**: Set reminders for important messages to follow up on later
- **Reminder Quick Options**: Predefined reminder times for common follow-up periods
- **Message Templates**: Save frequently used messages as templates for quick reuse
- **Template Categories**: Organize templates into categories for easy access
- **Template Management**: Create, edit, and delete message templates
- **Message Bookmarking**: Save important messages with notes for future reference
- **Bookmark Categories**: Organize bookmarked messages into custom categories
- **Bookmark Notes**: Add personal notes to bookmarked messages
- **Bookmark Search**: Search through bookmarked messages
- **Chat Archiving**: Archive less frequently used chats to reduce clutter
- **Archive Management**: View and restore archived chats as needed

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Building for Production

To build the app for production deployment:

```bash
npm run build
```

This will generate a static export in the `out` directory that can be deployed to any static hosting service.

## Color Scheme

- Primary Blue: #0088CC
- Background White: #FFFFFF
- Text Dark: #222222
- Text Light: #8E8E93
- Online Status: #4CAF50
- Message Bubble Blue: #E3F2FD

## Layout Specifications

- Mobile viewport: 375px width
- Status bar: 44px height
- Chat bubbles: max-width 70% of container
- Bottom navigation: 60px height
- List items: 72px height

## License

MIT 