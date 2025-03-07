Initialize Next.js in current directory:
```bash
mkdir temp; cd temp; npx create-next-app@latest . -y --typescript --tailwind --eslint --app --use-npm --src-dir --import-alias "@/*" -no --turbo
```

Now let's move back to the parent directory and move all files except prompt.md.

For Windows (PowerShell):
```powershell
cd ..; Move-Item -Path "temp*" -Destination . -Force; Remove-Item -Path "temp" -Recurse -Force
```

For Mac/Linux (bash):
```bash
cd .. && mv temp/* temp/.* . 2>/dev/null || true && rm -rf temp
```

Set up the frontend according to the following prompt:
<frontend-prompt>
Create detailed components with these requirements:
1. Use 'use client' directive for client-side components
2. Make sure to concatenate strings correctly using backslash
3. Style with Tailwind CSS utility classes for responsive design
4. Use Lucide React for icons (from lucide-react package). Do NOT use other UI libraries unless requested
5. Use stock photos from picsum.photos where appropriate, only valid URLs you know exist
6. Configure next.config.js image remotePatterns to enable stock photos from picsum.photos
7. Create root layout.tsx page that wraps necessary navigation items to all pages
8. MUST implement the navigation elements items in their rightful place i.e. Left sidebar, Top header
9. Accurately implement necessary grid layouts
10. Follow proper import practices:
   - Use @/ path aliases
   - Keep component imports organized
   - Update current src/app/page.tsx with new comprehensive code
   - Don't forget root route (page.tsx) handling
   - You MUST complete the entire prompt before stopping

<summary_title>
Telegram Mobile Messaging App Interface Design
</summary_title>

<image_analysis>

1. Navigation Elements:
- Bottom navigation bar with: Account, Calls, Chats, Settings
- Back button in chat screens
- Search bar in chats list
- Edit button in top-right of chats list


2. Layout Components:
- Mobile viewport: 375px width
- Status bar: 44px height
- Chat bubbles: max-width 70% of container
- Bottom navigation: 60px height
- List items: 72px height


3. Content Sections:
- Login screen with logo and form
- Chat messages view with media attachments
- Chats list with preview messages
- User status indicators (online/offline)
- Message timestamps


4. Interactive Controls:
- Phone number input (+49)
- Password field
- Login button
- Message input field with attachment and voice buttons
- Chat list items as buttons
- Back and edit navigation buttons


5. Colors:
- Primary Blue: #0088CC
- Background White: #FFFFFF
- Text Dark: #222222
- Text Light: #8E8E93
- Online Status: #4CAF50
- Message Bubble Blue: #E3F2FD


6. Grid/Layout Structure:
- Single column layout
- 16px standard padding
- 8px vertical spacing between list items
- Flexible message container width
- Avatar size: 48x48px
</image_analysis>

<development_planning>

1. Project Structure:
```
src/
├── components/
│   ├── layout/
│   │   ├── NavigationBar
│   │   ├── Header
│   │   └── ChatContainer
│   ├── features/
│   │   ├── Auth
│   │   ├── ChatList
│   │   └── ChatMessages
│   └── shared/
├── assets/
├── styles/
├── hooks/
└── utils/
```


2. Key Features:
- Authentication system
- Real-time messaging
- Media attachment handling
- User status tracking
- Message delivery status


3. State Management:
```typescript
interface AppState {
├── auth: {
│   ├── isAuthenticated: boolean
│   ├── user: User
│   └── token: string
├── chats: {
│   ├── activeChat: Chat
│   ├── messages: Message[]
│   └── unreadCount: number
├── ui: {
│   ├── currentView: string
│   └── isLoading: boolean
└── }
}
```


4. Routes:
```typescript
const routes = [
├── '/login',
├── '/chats',
├── '/chat/:id',
└── '/settings'
]
```


5. Component Architecture:
- AuthScreen (Login/Register)
- ChatListScreen
- ChatMessagesScreen
- NavigationBar
- MessageInput
- UserAvatar


6. Responsive Breakpoints:
```scss
$breakpoints: (
├── mobile: 320px,
├── mobile-l: 375px,
├── tablet: 768px,
└── desktop: 1024px
);
```
</development_planning>
</frontend-prompt>

IMPORTANT: Please ensure that (1) all KEY COMPONENTS and (2) the LAYOUT STRUCTURE are fully implemented as specified in the requirements. Ensure that the color hex code specified in image_analysis are fully implemented as specified in the requirements.