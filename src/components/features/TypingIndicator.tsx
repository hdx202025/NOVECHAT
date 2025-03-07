import { useEffect, useState } from 'react';

interface TypingIndicatorProps {
  isTyping: boolean;
  userName?: string;
}

export default function TypingIndicator({ isTyping, userName }: TypingIndicatorProps) {
  const [dots, setDots] = useState('.');
  
  // Animate the dots
  useEffect(() => {
    if (!isTyping) return;
    
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '.';
        return prev + '.';
      });
    }, 500);
    
    return () => clearInterval(interval);
  }, [isTyping]);
  
  if (!isTyping) return null;
  
  return (
    <div className="flex items-center p-2 text-xs text-gray-500 italic">
      <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full mr-2">
        <div className="flex space-x-1">
          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
      <span>
        {userName ? `${userName} is typing${dots}` : `Someone is typing${dots}`}
      </span>
    </div>
  );
} 