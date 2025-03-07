import Link from 'next/link'
import Image from 'next/image'
import { 
  MessageCircle, 
  Phone, 
  User, 
  Settings, 
  Lock, 
  Bell, 
  Bookmark,
  Archive,
  Clock,
  Languages,
  FileText,
  CheckCircle,
  Users,
  Globe,
  Star,
  Shield,
  Monitor,
  Zap,
  Cloud,
  RefreshCw,
  ArrowRight
} from 'lucide-react'
import NavigationBar from '@/components/layout/NavigationBar'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <div className="w-full max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="text-center lg:text-left relative">
            {/* Background decoration */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-50 rounded-full opacity-50 blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-50 rounded-full opacity-50 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            
            <div className="relative">
              <div className="mb-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-blue mb-2 tracking-tight hover:tracking-wide transition-all duration-300 ease-in-out relative group">
                  NOVA CHAT
                  <span className="absolute -inset-1 bg-blue-50 rounded-lg opacity-0 group-hover:opacity-25 transition-opacity duration-300"></span>
                </h1>
                <p className="text-lg md:text-xl text-text-light mt-2 font-medium tracking-widest animate-fade-in relative group">
                  ENCRYPTED MESSAGING
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-blue transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </p>
              </div>
              <p className="text-xl text-text-dark mb-8 leading-relaxed animate-slide-up">
                Experience secure messaging directly in your browser. No downloads needed - just open, chat, and stay connected with end-to-end encryption.
              </p>
              
              {/* Web Platform Benefits */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: Globe, text: "Available Worldwide" },
                  { icon: Shield, text: "End-to-End Encrypted" },
                  { icon: Monitor, text: "Cross-Platform" },
                  { icon: Zap, text: "Lightning Fast" }
                ].map((benefit, index) => (
                  <div 
                    key={index}
                    className="p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 group"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <benefit.icon className="w-6 h-6 text-primary-blue mb-2 group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="text-sm font-medium text-text-dark group-hover:text-primary-blue transition-colors duration-300">
                      {benefit.text}
                    </h3>
                  </div>
                ))}
              </div>

              {/* Call to Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link 
                  href="/login"
                  className="px-8 py-3 bg-primary-blue text-white rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center group"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <Link 
                  href="#features"
                  className="px-8 py-3 border-2 border-primary-blue text-primary-blue rounded-lg hover:bg-blue-50 transition-colors duration-300 flex items-center justify-center group"
                >
                  Learn More
                  <span className="ml-2 inline-block w-1 h-1 bg-primary-blue rounded-full animate-bounce"></span>
                  <span className="ml-1 inline-block w-1 h-1 bg-primary-blue rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="ml-1 inline-block w-1 h-1 bg-primary-blue rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 flex items-center justify-center lg:justify-start space-x-6">
                <div className="flex items-center text-gray-600 hover:text-primary-blue transition-colors duration-300">
                  <Users className="w-5 h-5 mr-2" />
                  <span className="text-sm">20,000+ Users</span>
                </div>
                <div className="flex items-center text-gray-600 hover:text-primary-blue transition-colors duration-300">
                  <Star className="w-5 h-5 mr-2" />
                  <span className="text-sm">4.8/5 Rating</span>
                </div>
                <div className="flex items-center text-gray-600 hover:text-primary-blue transition-colors duration-300">
                  <Shield className="w-5 h-5 mr-2" />
                  <span className="text-sm">ISO 27001</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Browser preview */}
          <div className="relative hidden lg:block group">
            <div className="bg-white rounded-lg shadow-2xl p-4 transform group-hover:scale-[1.02] transition-transform duration-300">
              {/* Browser URL Bar */}
              <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2 mb-4 group-hover:bg-gray-50 transition-colors duration-300">
                <div className="flex space-x-2 mr-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-sm text-gray-600 flex-1 text-center">chat.novachat.app</div>
              </div>

              {/* Chat Interface Preview */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-primary-blue">A</div>
                  <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                    <p className="text-sm">Hey! How's it going? 👋</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 justify-end">
                  <div className="bg-primary-blue text-white rounded-lg p-3 max-w-[80%]">
                    <p className="text-sm">Great! Just trying out Nova Chat. Love the app ! 😊</p>
                  </div>
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-primary-blue">B</div>
                </div>
              </div>

              {/* Floating Feature Bubbles */}
              <div className="absolute -right-4 top-1/4 transform translate-x-full">
                <div className="space-y-4">
                  {[
                    { icon: Shield, label: "Encrypted" },
                    { icon: Zap, label: "Fast" },
                    { icon: Globe, label: "Global" }
                  ].map((feature, index) => (
                    <div 
                      key={index}
                      className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center group hover:scale-110 transition-transform duration-300"
                      style={{ animationDelay: `${index * 200}ms` }}
                    >
                      <feature.icon className="w-6 h-6 text-primary-blue group-hover:text-blue-600 transition-colors duration-300" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Connection Lines */}
              <div className="absolute -right-4 top-1/4 transform translate-x-full">
                <div className="relative h-full">
                  <div className="absolute left-6 top-6 w-8 h-[120px] border-r-2 border-dashed border-gray-300 group-hover:border-primary-blue transition-colors duration-300"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Grid */}
      <div id="features" className="w-full max-w-5xl mx-auto px-4 pb-16">
        <div className="text-center mb-12 relative">
          {/* Background decoration */}
          <div className="absolute -top-10 left-1/4 w-32 h-32 bg-blue-50 rounded-full opacity-50 blur-3xl"></div>
          <div className="absolute -bottom-10 right-1/4 w-32 h-32 bg-blue-50 rounded-full opacity-50 blur-3xl"></div>
          
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-text-dark mb-4 hover:text-primary-blue transition-colors duration-300 group">
              Powerful Features
              <span className="absolute -inset-1 bg-blue-50 rounded-lg opacity-0 group-hover:opacity-25 transition-opacity duration-300"></span>
            </h2>
            <p className="text-xl text-text-light max-w-2xl mx-auto animate-fade-in relative">
              Everything you need for seamless communication, right in your browser
              <span className="absolute bottom-0 left-1/2 w-24 h-1 bg-primary-blue transform -translate-x-1/2 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Communication */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
            <div className="bg-blue-50 w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors duration-300 relative overflow-hidden">
              <MessageCircle className="w-8 h-8 text-primary-blue relative z-10 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary-blue transition-colors duration-300">Real-time Messaging</h3>
            <ul className="text-text-light space-y-2">
              <li className="flex items-center opacity-0 animate-fade-in [animation-delay:100ms] hover:translate-x-1 transition-transform duration-300">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 group-hover:scale-110 transition-transform duration-300" />
                <span>Instant delivery</span>
              </li>
              <li className="flex items-center opacity-0 animate-fade-in [animation-delay:200ms] hover:translate-x-1 transition-transform duration-300">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 group-hover:scale-110 transition-transform duration-300" />
                <span>Typing indicators</span>
              </li>
              <li className="flex items-center opacity-0 animate-fade-in [animation-delay:300ms] hover:translate-x-1 transition-transform duration-300">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 group-hover:scale-110 transition-transform duration-300" />
                <span>Read receipts</span>
              </li>
            </ul>
          </div>
          
          {/* Security */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
            <div className="bg-blue-50 w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors duration-300 relative overflow-hidden">
              <Lock className="w-8 h-8 text-primary-blue relative z-10 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary-blue transition-colors duration-300">End-to-End Encryption</h3>
            <ul className="text-text-light space-y-2">
              <li className="flex items-center opacity-0 animate-fade-in [animation-delay:400ms] hover:translate-x-1 transition-transform duration-300">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 group-hover:scale-110 transition-transform duration-300" />
                <span>256-bit encryption</span>
              </li>
              <li className="flex items-center opacity-0 animate-fade-in [animation-delay:500ms] hover:translate-x-1 transition-transform duration-300">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 group-hover:scale-110 transition-transform duration-300" />
                <span>Secure key exchange</span>
              </li>
              <li className="flex items-center opacity-0 animate-fade-in [animation-delay:600ms] hover:translate-x-1 transition-transform duration-300">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 group-hover:scale-110 transition-transform duration-300" />
                <span>Private conversations</span>
              </li>
            </ul>
          </div>
          
          {/* Voice & Video */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
            <div className="bg-blue-50 w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors duration-300 relative overflow-hidden">
              <Phone className="w-8 h-8 text-primary-blue relative z-10 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary-blue transition-colors duration-300">Voice & Video Calls</h3>
            <ul className="text-text-light space-y-2">
              <li className="flex items-center opacity-0 animate-fade-in [animation-delay:700ms] hover:translate-x-1 transition-transform duration-300">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 group-hover:scale-110 transition-transform duration-300" />
                <span>HD video quality</span>
              </li>
              <li className="flex items-center opacity-0 animate-fade-in [animation-delay:800ms] hover:translate-x-1 transition-transform duration-300">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 group-hover:scale-110 transition-transform duration-300" />
                <span>Screen sharing</span>
              </li>
              <li className="flex items-center opacity-0 animate-fade-in [animation-delay:900ms] hover:translate-x-1 transition-transform duration-300">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 group-hover:scale-110 transition-transform duration-300" />
                <span>Group calls</span>
              </li>
            </ul>
          </div>
          
          {/* Organization */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
            <div className="bg-blue-50 w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors duration-300 relative overflow-hidden">
              <Bookmark className="w-8 h-8 text-primary-blue relative z-10 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary-blue transition-colors duration-300">Smart Organization</h3>
            <ul className="text-text-light space-y-2">
              <li className="flex items-center opacity-0 animate-fade-in [animation-delay:1000ms] hover:translate-x-1 transition-transform duration-300">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 group-hover:scale-110 transition-transform duration-300" />
                <span>Message bookmarks</span>
              </li>
              <li className="flex items-center opacity-0 animate-fade-in [animation-delay:1100ms] hover:translate-x-1 transition-transform duration-300">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 group-hover:scale-110 transition-transform duration-300" />
                <span>Custom categories</span>
              </li>
              <li className="flex items-center opacity-0 animate-fade-in [animation-delay:1200ms] hover:translate-x-1 transition-transform duration-300">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 group-hover:scale-110 transition-transform duration-300" />
                <span>Search functionality</span>
              </li>
            </ul>
          </div>
          
          {/* Productivity */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
            <div className="bg-blue-50 w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors duration-300 relative overflow-hidden">
              <FileText className="w-8 h-8 text-primary-blue relative z-10 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary-blue transition-colors duration-300">Productivity Tools</h3>
            <ul className="text-text-light space-y-2">
              <li className="flex items-center opacity-0 animate-fade-in [animation-delay:1300ms] hover:translate-x-1 transition-transform duration-300">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 group-hover:scale-110 transition-transform duration-300" />
                <span>Message templates</span>
              </li>
              <li className="flex items-center opacity-0 animate-fade-in [animation-delay:1400ms] hover:translate-x-1 transition-transform duration-300">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 group-hover:scale-110 transition-transform duration-300" />
                <span>Quick responses</span>
              </li>
              <li className="flex items-center opacity-0 animate-fade-in [animation-delay:1500ms] hover:translate-x-1 transition-transform duration-300">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 group-hover:scale-110 transition-transform duration-300" />
                <span>File sharing</span>
              </li>
            </ul>
          </div>
          
          {/* Advanced Features */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
            <div className="bg-blue-50 w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors duration-300 relative overflow-hidden">
              <Languages className="w-8 h-8 text-primary-blue relative z-10 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary-blue transition-colors duration-300">Advanced Features</h3>
            <ul className="text-text-light space-y-2">
              <li className="flex items-center opacity-0 animate-fade-in [animation-delay:1600ms] hover:translate-x-1 transition-transform duration-300">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 group-hover:scale-110 transition-transform duration-300" />
                <span>Message translation</span>
              </li>
              <li className="flex items-center opacity-0 animate-fade-in [animation-delay:1700ms] hover:translate-x-1 transition-transform duration-300">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 group-hover:scale-110 transition-transform duration-300" />
                <span>Message scheduling</span>
              </li>
              <li className="flex items-center opacity-0 animate-fade-in [animation-delay:1800ms] hover:translate-x-1 transition-transform duration-300">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 group-hover:scale-110 transition-transform duration-300" />
                <span>Smart notifications</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Statistics Section */}
      <div className="w-full bg-gradient-to-b from-white to-blue-50 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-dark mb-4">Trusted Worldwide</h2>
            <p className="text-xl text-text-light max-w-2xl mx-auto">
              Join our growing community of users who trust Nova Chat for secure communication
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Users Stat */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1">
              <div className="bg-blue-50 w-16 h-16 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Users className="w-8 h-8 text-primary-blue" />
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-blue mb-2">20,000+</div>
                <div className="text-lg font-medium text-text-dark mb-1">Active Users</div>
                <div className="text-sm text-text-light">Growing daily</div>
              </div>
            </div>

            {/* Messages Stat */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1">
              <div className="bg-blue-50 w-16 h-16 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <MessageCircle className="w-8 h-8 text-primary-blue" />
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-blue mb-2">10M+</div>
                <div className="text-lg font-medium text-text-dark mb-1">Messages Daily</div>
                <div className="text-sm text-text-light">Instant delivery</div>
              </div>
            </div>

            {/* Countries Stat */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1">
              <div className="bg-blue-50 w-16 h-16 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Globe className="w-8 h-8 text-primary-blue" />
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-blue mb-2">100+</div>
                <div className="text-lg font-medium text-text-dark mb-1">Countries</div>
                <div className="text-sm text-text-light">Global reach</div>
              </div>
            </div>

            {/* Security Stat */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1">
              <div className="bg-blue-50 w-16 h-16 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Lock className="w-8 h-8 text-primary-blue" />
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-blue mb-2">256-bit</div>
                <div className="text-lg font-medium text-text-dark mb-1">Encryption</div>
                <div className="text-sm text-text-light">Bank-grade security</div>
              </div>
            </div>
          </div>

          {/* Additional Trust Indicators */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="flex items-center justify-center mb-3">
                <Shield className="w-6 h-6 text-green-500 mr-2" />
                <span className="text-lg font-medium">GDPR Compliant</span>
              </div>
              <p className="text-text-light text-sm">Your data privacy is our priority</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="flex items-center justify-center mb-3">
                <Star className="w-6 h-6 text-yellow-400 mr-2" />
                <span className="text-lg font-medium">4.8/5 User Rating</span>
              </div>
              <p className="text-text-light text-sm">Based on 10,000+ reviews</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="flex items-center justify-center mb-3">
                <CheckCircle className="w-6 h-6 text-primary-blue mr-2" />
                <span className="text-lg font-medium">99.9% Uptime</span>
              </div>
              <p className="text-text-light text-sm">Reliable service you can trust</p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Comparison */}
      <div className="w-full max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-text-dark mb-8 text-center hover:text-primary-blue transition-colors duration-300">
          Why Choose Nova Chat?
        </h2>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
            {/* Free Plan */}
            <div className="p-6 hover:bg-blue-50 transition-colors duration-300 group">
              <h3 className="text-xl font-semibold text-primary-blue mb-4 group-hover:scale-105 transition-transform duration-300">Free Plan</h3>
              <ul className="space-y-3">
                <li className="flex items-center opacity-0 animate-fade-in [animation-delay:100ms]">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  <span>Unlimited Messages</span>
                </li>
                <li className="flex items-center opacity-0 animate-fade-in [animation-delay:200ms]">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  <span>Group Chats</span>
                </li>
                <li className="flex items-center opacity-0 animate-fade-in [animation-delay:300ms]">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  <span>Voice & Video Calls</span>
                </li>
                <li className="flex items-center opacity-0 animate-fade-in [animation-delay:400ms]">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  <span>Basic Message Tools</span>
                </li>
                <li className="flex items-center opacity-0 animate-fade-in [animation-delay:500ms]">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  <span>End-to-End Encryption</span>
                </li>
                <li className="flex items-center opacity-0 animate-fade-in [animation-delay:600ms]">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  <span>File Sharing</span>
                </li>
              </ul>
              <div className="mt-6 text-center">
                <Link href="/login" className="inline-block bg-primary-blue text-white px-6 py-2 rounded-full font-medium hover:bg-opacity-90 transition-colors">
                  Get Started
                </Link>
              </div>
            </div>
            
            {/* Pro Features */}
            <div className="p-6 bg-blue-50 hover:bg-blue-100 transition-colors duration-300 group relative">
              <div className="absolute top-0 right-0 bg-primary-blue text-white text-xs px-3 py-1 rounded-bl-lg">
                Popular
              </div>
              <h3 className="text-xl font-semibold text-primary-blue mb-4 group-hover:scale-105 transition-transform duration-300">Pro Features</h3>
              <ul className="space-y-3">
                <li className="flex items-center opacity-0 animate-fade-in [animation-delay:100ms]">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  <span>Message Templates</span>
                </li>
                <li className="flex items-center opacity-0 animate-fade-in [animation-delay:200ms]">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  <span>Advanced Organization</span>
                </li>
                <li className="flex items-center opacity-0 animate-fade-in [animation-delay:300ms]">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  <span>Message Translation</span>
                </li>
                <li className="flex items-center opacity-0 animate-fade-in [animation-delay:400ms]">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  <span>Message Scheduling</span>
                </li>
                <li className="flex items-center opacity-0 animate-fade-in [animation-delay:500ms]">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  <span>Priority Support</span>
                </li>
                <li className="flex items-center opacity-0 animate-fade-in [animation-delay:600ms]">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  <span>Advanced Analytics</span>
                </li>
              </ul>
              <div className="mt-6 text-center">
                <Link href="/login" className="inline-block bg-primary-blue text-white px-6 py-2 rounded-full font-medium hover:bg-opacity-90 transition-colors">
                  Contact Sales
                </Link>
              </div>
            </div>
            
            {/* Enterprise */}
            <div className="p-6 hover:bg-blue-50 transition-colors duration-300 group">
              <h3 className="text-xl font-semibold text-primary-blue mb-4 group-hover:scale-105 transition-transform duration-300">Enterprise</h3>
              <ul className="space-y-3">
                <li className="flex items-center opacity-0 animate-fade-in [animation-delay:100ms]">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  <span>Custom Branding</span>
                </li>
                <li className="flex items-center opacity-0 animate-fade-in [animation-delay:200ms]">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  <span>Admin Controls</span>
                </li>
                <li className="flex items-center opacity-0 animate-fade-in [animation-delay:300ms]">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  <span>API Access</span>
                </li>
                <li className="flex items-center opacity-0 animate-fade-in [animation-delay:400ms]">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  <span>24/7 Support</span>
                </li>
                <li className="flex items-center opacity-0 animate-fade-in [animation-delay:500ms]">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  <span>SLA Guarantee</span>
                </li>
                <li className="flex items-center opacity-0 animate-fade-in [animation-delay:600ms]">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  <span>Custom Integration</span>
                </li>
              </ul>
              <div className="mt-6 text-center">
                <Link href="/contact" className="inline-block bg-primary-blue text-white px-6 py-2 rounded-full font-medium hover:bg-opacity-90 transition-colors">
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <NavigationBar />
      
      {/* Call-to-action */}
      <div className="w-full bg-gradient-to-br from-primary-blue to-blue-700 text-white py-20 px-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-24 h-24 bg-white/10 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-white/10 rounded-full animate-pulse [animation-delay:1000ms]"></div>
          <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-white/10 rounded-full animate-pulse [animation-delay:2000ms]"></div>
          <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-white/10 rounded-full transform translate-x-1/2 translate-y-1/2 animate-pulse [animation-delay:3000ms]"></div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-fade-in">
              Ready to Experience Secure Messaging?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto animate-slide-up">
              Join thousands of users who trust Nova Chat for their secure communication needs. Get started in seconds.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="flex items-center justify-center space-x-3 bg-white/10 rounded-lg p-4 backdrop-blur-sm hover:bg-white/20 transition-colors">
              <Lock className="w-6 h-6 text-blue-200" />
              <span className="text-blue-100">End-to-End Encryption</span>
            </div>
            <div className="flex items-center justify-center space-x-3 bg-white/10 rounded-lg p-4 backdrop-blur-sm hover:bg-white/20 transition-colors">
              <Zap className="w-6 h-6 text-blue-200" />
              <span className="text-blue-100">Instant Setup</span>
            </div>
            <div className="flex items-center justify-center space-x-3 bg-white/10 rounded-lg p-4 backdrop-blur-sm hover:bg-white/20 transition-colors">
              <Globe className="w-6 h-6 text-blue-200" />
              <span className="text-blue-100">Available Worldwide</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/login" 
              className="inline-flex items-center bg-white text-primary-blue px-8 py-3 rounded-full font-medium hover:bg-opacity-90 hover:scale-105 hover:shadow-lg transition-all duration-300 text-lg group"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="#features" 
              className="inline-flex items-center bg-transparent text-white border-2 border-white px-8 py-3 rounded-full font-medium hover:bg-white hover:text-primary-blue transition-all duration-300 text-lg"
            >
              Learn More
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-blue-100">
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              <span>20,000+ Active Users</span>
            </div>
            <div className="flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-400" />
              <span>4.8/5 Rating</span>
            </div>
            <div className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-green-400" />
              <span>GDPR Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 