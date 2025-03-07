Set up the page structure according to the following prompt:
   
<page-structure-prompt>
Next.js route structure based on navigation menu items (excluding main route). Make sure to wrap all routes with the component:

Routes:
- /account
- /calls
- /chats
- /settings

Page Implementations:
/account:
Core Purpose: User profile management and account settings
Key Components
- Profile information editor
- Account statistics dashboard
- Security settings panel
- Subscription management interface
- Connected devices list
Layout Structure
- Two-column layout for desktop
- Single column stack for mobile
- Sticky navigation sidebar
- Scrollable main content area

/calls:
Core Purpose: Voice and video call management
Key Components
- Call history list
- Contact picker
- Video

/audio call initiator
- Call quality settings
- Recent contacts carousel
Layout Structure:
- Three-panel layout (contacts, history, details)
- Collapsible panels for mobile
- Floating action button for new calls
- Full-screen call view

/chats:
Core Purpose: Text-based communication hub
Key Components
- Chat list with preview
- Message thread viewer
- Message composer
- Media attachment handler
- Search functionality
Layout Structure
- Split view (conversations

/settings:
Core Purpose: Application configuration and preferences
Key Components
- Settings categories menu
- Theme switcher
- Notification preferences
- Privacy controls
- Language selector
Layout Structure
- Categorized settings panels
- Expandable sections
- Form-based controls
- Toast notifications for changes

Layouts:
MainLayout:
Applicable routes
- All routes
Core components
- Header with navigation
- Sidebar navigation
- User status indicator
- Search bar
- Footer
Responsive behavior
- Collapsible sidebar on mobile
- Sticky header
- Adaptive content width
- Bottom navigation bar on mobile

DashboardLayout
Applicable routes
- /account
- /settings
Core components
- Breadcrumb navigation
- Action toolbar
- Content cards
- Status indicators
Responsive behavior
- Grid to single column
- Collapsible sections
- Scrollable content area

CommunicationLayout
Applicable routes
- /calls
- /chats
Core components
- Contact list
- Activity feed
- Communication controls
- Media preview
Responsive behavior
- Panel-based to stack layout
- Swipeable interfaces
- Picture-in-picture for calls
- Dynamic height adjustments
</page-structure-prompt>