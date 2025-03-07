import { useState, useEffect } from 'react';
import { Globe, X, Check, RotateCcw } from 'lucide-react';
import { useRealtime, Message } from '@/contexts/RealtimeContext';

interface MessageTranslatorProps {
  message: Message;
  onClose: () => void;
}

export default function MessageTranslator({ message, onClose }: MessageTranslatorProps) {
  const { translateMessage, getAvailableLanguages } = useRealtime();
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState('');
  
  // Get available languages
  const languages = getAvailableLanguages();
  
  // Check if the message already has translations
  useEffect(() => {
    if (message.translations && selectedLanguage && message.translations[selectedLanguage]) {
      setTranslatedText(message.translations[selectedLanguage]);
    } else {
      setTranslatedText('');
    }
  }, [message, selectedLanguage]);
  
  // Handle language selection
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value);
    setError('');
  };
  
  // Handle translation
  const handleTranslate = async () => {
    if (!selectedLanguage) {
      setError('Please select a language');
      return;
    }
    
    try {
      setIsTranslating(true);
      setError('');
      
      const translated = await translateMessage(message.chatId, message.id, selectedLanguage);
      setTranslatedText(translated);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsTranslating(false);
    }
  };
  
  // Reset translation
  const handleReset = () => {
    setTranslatedText('');
    setSelectedLanguage('');
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium flex items-center">
          <Globe className="w-4 h-4 mr-1 text-blue-500" />
          Translate Message
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {/* Original message */}
      <div className="mb-4">
        <div className="text-xs text-gray-500 mb-1">Original message:</div>
        <div className="p-3 bg-gray-100 rounded-lg text-sm">
          {message.text}
        </div>
        {message.originalLanguage && (
          <div className="text-xs text-gray-500 mt-1">
            Detected language: {
              languages.find(lang => lang.code === message.originalLanguage)?.name || 
              message.originalLanguage
            }
          </div>
        )}
      </div>
      
      {/* Language selector */}
      <div className="mb-4">
        <label className="block text-xs text-gray-500 mb-1">
          Translate to:
        </label>
        <select
          value={selectedLanguage}
          onChange={handleLanguageChange}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select language</option>
          {languages.map(lang => (
            <option 
              key={lang.code} 
              value={lang.code}
              disabled={lang.code === message.originalLanguage}
            >
              {lang.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* Translation actions */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={handleTranslate}
          disabled={!selectedLanguage || isTranslating}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center ${
            selectedLanguage && !isTranslating
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Globe className="w-4 h-4 mr-1" />
          {isTranslating ? 'Translating...' : 'Translate'}
        </button>
        
        <button
          onClick={handleReset}
          disabled={!translatedText}
          className={`py-2 px-3 rounded-lg ${
            translatedText
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="mb-4 text-sm text-red-500">{error}</div>
      )}
      
      {/* Translated text */}
      {translatedText && (
        <div>
          <div className="text-xs text-gray-500 mb-1 flex items-center">
            <span>Translation ({
              languages.find(lang => lang.code === selectedLanguage)?.name || 
              selectedLanguage
            }):</span>
            <Check className="w-3 h-3 ml-1 text-green-500" />
          </div>
          <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-lg text-sm">
            {translatedText}
          </div>
        </div>
      )}
    </div>
  );
} 