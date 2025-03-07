import { useState, useEffect, useRef, useMemo } from 'react';
import { X, Plus, Edit2, Trash2, Save, Tag, Info, Star, Eye, Share2, Download, Upload, Copy, Check, Zap, History, RotateCcw, Info as InfoIcon } from 'lucide-react';
import { useRealtime, MessageTemplate } from '@/contexts/RealtimeContext';

interface MessageTemplatesProps {
  onSelectTemplate: (text: string) => void;
  onClose: () => void;
}

// Template variables with descriptions
const TEMPLATE_VARIABLES = {
  user: 'Current user\'s name',
  recipient: 'Chat recipient\'s name',
  time: 'Current time',
  date: 'Current date',
  group: 'Group/Channel name (if applicable)',
} as const;

// Common phrases and suggestions
const COMMON_PHRASES = {
  'Greetings': [
    'Hello {recipient}',
    'Hi there',
    'Good morning',
    'Good afternoon',
    'Good evening',
  ],
  'Thanks': [
    'Thank you for your message',
    'Thanks for the update',
    'I appreciate your help',
  ],
  'Closing': [
    'Best regards, {user}',
    'Kind regards',
    'Thanks and regards',
  ],
  'Meeting': [
    'Can we schedule a meeting?',
    'Are you available for a quick call?',
    'Let\'s discuss this in our next meeting',
  ],
  'Status': [
    'I\'ll look into this and get back to you',
    'I\'m working on it',
    'Here\'s a status update:',
  ],
} as const;

interface TemplateVersion {
  text: string;
  category: string;
  timestamp: number;
  editor: string;
}

interface TemplateHistory {
  [templateId: string]: TemplateVersion[];
}

export default function MessageTemplates({ onSelectTemplate, onClose }: MessageTemplatesProps) {
  const { 
    getMessageTemplates, 
    getMessageTemplateCategories,
    saveMessageTemplate,
    deleteMessageTemplate,
    updateMessageTemplate,
    incrementTemplateUsage,
    currentUser,
    chats
  } = useRealtime();

  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newTemplate, setNewTemplate] = useState({ text: '', category: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);
  const [newCategory, setNewCategory] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showVariablesHelp, setShowVariablesHelp] = useState(false);
  const [showPreview, setShowPreview] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedTemplateForShare, setSelectedTemplateForShare] = useState<MessageTemplate | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importData, setImportData] = useState('');
  const [importError, setImportError] = useState('');
  const [showCopiedIndicator, setShowCopiedIndicator] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [autoCompleteAnchor, setAutoCompleteAnchor] = useState('');
  const suggestionTimeoutRef = useRef<NodeJS.Timeout>();
  const [showHistory, setShowHistory] = useState(false);
  const [selectedTemplateHistory, setSelectedTemplateHistory] = useState<string | null>(null);
  const [templateHistory, setTemplateHistory] = useState<TemplateHistory>({});

  // Load templates, categories, and favorites
  useEffect(() => {
    setTemplates(getMessageTemplates());
    setCategories(getMessageTemplateCategories());
    const savedFavorites = localStorage.getItem('template_favorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  // Save favorites to localStorage when changed
  useEffect(() => {
    localStorage.setItem('template_favorites', JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  // Load template history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('template_history');
    if (savedHistory) {
      setTemplateHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save history to localStorage when changed
  useEffect(() => {
    localStorage.setItem('template_history', JSON.stringify(templateHistory));
  }, [templateHistory]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Close modal with Escape
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Save template with Ctrl/Cmd + Enter
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (editingTemplate) {
          handleUpdateTemplate();
        } else if (newTemplate) {
          handleAddTemplate();
        }
        return;
      }

      // Create new template with Ctrl/Cmd + N
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        setNewTemplate({ text: '', category: '' });
        return;
      }

      // Focus search with Ctrl/Cmd + F
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        const searchInput = document.getElementById('template-search');
        searchInput?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [editingTemplate, newTemplate, onClose]);

  // Process template variables
  const processTemplate = (text: string): string => {
    let processedText = text;
    const currentUser = { name: 'John Doe' }; // Replace with actual user data
    const currentChat = { name: 'Chat Name', isGroup: false }; // Replace with actual chat data

    // Replace variables with actual values
    Object.entries(TEMPLATE_VARIABLES).forEach(([variable, _]) => {
      const pattern = new RegExp(`{${variable}}`, 'g');
      let value = '';

      switch (variable) {
        case 'user':
          value = currentUser.name;
          break;
        case 'recipient':
          value = currentChat.isGroup ? 'group members' : 'recipient name';
          break;
        case 'time':
          value = new Date().toLocaleTimeString();
          break;
        case 'date':
          value = new Date().toLocaleDateString();
          break;
        case 'group':
          value = currentChat.isGroup ? currentChat.name : '';
          break;
      }

      processedText = processedText.replace(pattern, value);
    });

    return processedText;
  };

  // Toggle favorite status
  const toggleFavorite = (templateId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(templateId)) {
        newFavorites.delete(templateId);
      } else {
        newFavorites.add(templateId);
      }
      return newFavorites;
    });
  };

  // Filter templates based on search, category, and favorites
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesFavorites = !showFavoritesOnly || favorites.has(template.id);
    return matchesSearch && matchesCategory && matchesFavorites;
  });

  // Sort templates with favorites first
  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    const aIsFavorite = favorites.has(a.id);
    const bIsFavorite = favorites.has(b.id);
    if (aIsFavorite && !bIsFavorite) return -1;
    if (!aIsFavorite && bIsFavorite) return 1;
    return b.usageCount - a.usageCount;
  });

  // Handle selecting a template
  const handleSelectTemplate = (template: MessageTemplate) => {
    incrementTemplateUsage(template.id);
    onSelectTemplate(processTemplate(template.text));
    onClose();
  };

  // Handle adding a new template
  const handleAddTemplate = () => {
    if (!newTemplate.text.trim()) return;

    const templateId = saveMessageTemplate(newTemplate.text, newTemplate.category);
    setTemplates(getMessageTemplates());
    setNewTemplate({ text: '', category: '' });
    setShowAddForm(false);
  };

  // Handle adding a new category
  const handleAddCategory = () => {
    if (!newCategory.trim()) return;

    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    setNewCategory('');
    setShowAddCategory(false);
  };

  // Add version to history
  const addToHistory = (templateId: string, version: TemplateVersion) => {
    setTemplateHistory(prev => {
      const newHistory = { ...prev };
      if (!newHistory[templateId]) {
        newHistory[templateId] = [];
      }
      newHistory[templateId] = [version, ...newHistory[templateId].slice(0, 9)];
      return newHistory;
    });
  };

  // Handle restoring a previous version
  const handleRestoreVersion = (templateId: string, version: TemplateVersion) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    addToHistory(templateId, {
      text: template.text,
      category: template.category,
      timestamp: Date.now(),
      editor: currentUser.name
    });

    updateMessageTemplate(templateId, {
      text: version.text,
      category: version.category,
      createdAt: template.createdAt,
      usageCount: template.usageCount
    });

    setTemplates(getMessageTemplates());
    setShowHistory(false);
    setSelectedTemplateHistory(null);
  };

  // Handle updating a template
  const handleUpdateTemplate = () => {
    if (!editingTemplate || !editingTemplate.text.trim()) return;

    const currentTemplate = templates.find(t => t.id === editingTemplate.id);
    if (currentTemplate) {
      addToHistory(editingTemplate.id, {
        text: currentTemplate.text,
        category: currentTemplate.category,
        timestamp: Date.now(),
        editor: currentUser.name
      });
    }

    updateMessageTemplate(editingTemplate.id, {
      text: editingTemplate.text,
      category: editingTemplate.category,
      createdAt: editingTemplate.createdAt,
      usageCount: editingTemplate.usageCount
    });

    setTemplates(getMessageTemplates());
    setEditingTemplate(null);
  };

  // Handle deleting a template
  const handleDeleteTemplate = (templateId: string) => {
    deleteMessageTemplate(templateId);
    setTemplates(getMessageTemplates());
  };

  // Format date for display
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format relative time for history display
  const formatRelativeTime = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  // Get frequently used phrases from templates
  const frequentPhrases = useMemo(() => {
    const phrases: { text: string; count: number }[] = [];
    templates.forEach(template => {
      // Split template text into phrases
      const templatePhrases = template.text
        .split(/[.!?]/)
        .map(phrase => phrase.trim())
        .filter(phrase => phrase.length > 10);

      templatePhrases.forEach(phrase => {
        const existing = phrases.find(p => p.text === phrase);
        if (existing) {
          existing.count += template.usageCount;
        } else {
          phrases.push({ text: phrase, count: template.usageCount });
        }
      });
    });

    // Return top 5 most used phrases
    return phrases
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(p => p.text);
  }, [templates]);

  // Generate suggestions based on input
  const generateSuggestions = (text: string) => {
    if (!text.trim()) {
      return [];
    }

    const suggestions: string[] = [];
    const input = text.toLowerCase();

    // Check common phrases
    Object.values(COMMON_PHRASES).flat().forEach(phrase => {
      if (phrase.toLowerCase().includes(input)) {
        suggestions.push(phrase);
      }
    });

    // Check existing templates
    templates.forEach(template => {
      if (template.text.toLowerCase().includes(input)) {
        suggestions.push(template.text);
      }
    });

    // Check frequent phrases
    frequentPhrases.forEach(phrase => {
      if (phrase.toLowerCase().includes(input)) {
        suggestions.push(phrase);
      }
    });

    // Remove duplicates and limit to 5 suggestions
    return Array.from(new Set(suggestions)).slice(0, 5);
  };

  // Handle input changes with auto-complete
  const handleTemplateInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const isNewTemplate = !editingTemplate;
    
    if (isNewTemplate) {
      setNewTemplate(prev => ({ ...prev, text }));
    } else {
      setEditingTemplate(prev => prev ? { ...prev, text } : null);
    }

    // Clear any existing timeout
    if (suggestionTimeoutRef.current) {
      clearTimeout(suggestionTimeoutRef.current);
    }

    // Set new timeout for suggestions
    suggestionTimeoutRef.current = setTimeout(() => {
      const newSuggestions = generateSuggestions(text);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
      setSelectedSuggestionIndex(-1);
    }, 300);

    // Update auto-complete anchor
    const lastWord = text.split(/\s+/).pop() || '';
    setAutoCompleteAnchor(lastWord);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: string) => {
    const isNewTemplate = !editingTemplate;
    const currentText = isNewTemplate ? newTemplate.text : (editingTemplate?.text || '');
    const words = currentText.split(/\s+/);
    words.pop(); // Remove the last word (anchor)
    const newText = [...words, suggestion].join(' ');

    if (isNewTemplate) {
      setNewTemplate(prev => ({ ...prev, text: newText }));
    } else {
      setEditingTemplate(prev => prev ? { ...prev, text: newText } : null);
    }

    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };

  // Handle keyboard navigation for suggestions
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSuggestionSelect(suggestions[selectedSuggestionIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  // Update the template form JSX to include suggestions
  const renderTemplateInput = (
    value: string,
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void,
    placeholder: string
  ) => (
    <div className="relative">
      <textarea
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full p-2 border border-gray-300 rounded-lg mb-2"
        rows={4}
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 bottom-full mb-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              onClick={() => handleSuggestionSelect(suggestion)}
              className={`w-full text-left px-3 py-2 hover:bg-gray-50 ${
                index === selectedSuggestionIndex ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center">
                <Zap className="w-4 h-4 text-blue-500 mr-2" />
                <span>{suggestion}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // Handle sharing a template
  const handleShare = (template: MessageTemplate) => {
    const shareData = {
      text: template.text,
      category: template.category,
      timestamp: Date.now()
    };
    
    const shareCode = btoa(JSON.stringify(shareData));
    setSelectedTemplateForShare(template);
    setShowShareModal(true);
    navigator.clipboard.writeText(shareCode).then(() => {
      setShowCopiedIndicator(true);
      setTimeout(() => setShowCopiedIndicator(false), 2000);
    });
  };

  // Handle importing templates
  const handleImport = async (shareCode: string) => {
    try {
      const importData = JSON.parse(atob(shareCode));
      if (!importData.text || !importData.category) {
        throw new Error('Invalid template data');
      }

      const templateId = saveMessageTemplate(importData.text, importData.category);
      setTemplates(getMessageTemplates());
      setShowImportModal(false);
      setImportData('');
      setImportError('');
    } catch (error) {
      setImportError('Invalid share code. Please check and try again.');
    }
  };

  // Handle file import
  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (Array.isArray(data)) {
        data.forEach(template => {
          if (template.text && template.category) {
            saveMessageTemplate(template.text, template.category);
          }
        });
        setTemplates(getMessageTemplates());
        setShowImportModal(false);
      } else {
        throw new Error('Invalid file format');
      }
    } catch (error) {
      setImportError('Invalid file format. Please use a valid JSON file.');
    }
  };

  // Handle exporting templates
  const handleExport = () => {
    const exportData = templates.map(template => ({
      text: template.text,
      category: template.category,
      createdAt: template.createdAt,
      usageCount: template.usageCount
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nova-chat-templates-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header with import/export buttons */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium">Message Templates</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowImportModal(true)}
              className="text-gray-500 hover:text-gray-700"
              title="Import Templates"
            >
              <Upload className="w-5 h-5" />
            </button>
            <button
              onClick={handleExport}
              className="text-gray-500 hover:text-gray-700"
              title="Export Templates"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowVariablesHelp(!showVariablesHelp)}
              className="text-gray-500 hover:text-gray-700"
              title="Template Variables Help"
            >
              <InfoIcon className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Template Variables Help */}
        {showVariablesHelp && (
          <div className="p-4 bg-blue-50 border-b">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Available Template Variables:</h3>
            <ul className="space-y-1">
              {Object.entries(TEMPLATE_VARIABLES).map(([variable, description]) => (
                <li key={variable} className="text-sm">
                  <code className="bg-blue-100 px-1 rounded">{`{${variable}}`}</code>
                  <span className="text-blue-700 ml-2">{description}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 text-sm text-blue-900">
              <strong>Keyboard Shortcuts:</strong>
              <ul className="mt-1">
                <li><kbd className="bg-blue-100 px-1 rounded">Esc</kbd> Close modal</li>
                <li><kbd className="bg-blue-100 px-1 rounded">Ctrl/Cmd + Enter</kbd> Save template</li>
                <li><kbd className="bg-blue-100 px-1 rounded">Ctrl/Cmd + N</kbd> New template</li>
                <li><kbd className="bg-blue-100 px-1 rounded">Ctrl/Cmd + F</kbd> Focus search</li>
              </ul>
            </div>
          </div>
        )}

        {/* Search and filters */}
        <div className="p-4 border-b">
          <input
            id="template-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates (Ctrl/Cmd + F)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex items-center space-x-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <button
              onClick={() => setShowAddCategory(true)}
              className="p-2 text-blue-500 hover:text-blue-600"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`p-2 ${showFavoritesOnly ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-600`}
            >
              <Star className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Templates list with history button */}
        <div className="flex-1 overflow-y-auto p-4">
          {sortedTemplates.map(template => (
            <div key={template.id} className="mb-4 p-3 border rounded-lg">
              {editingTemplate?.id === template.id ? (
                <div>
                  {renderTemplateInput(
                    editingTemplate.text,
                    handleTemplateInput,
                    "Edit template text..."
                  )}
                  <div className="flex justify-between items-center">
                    <select
                      value={editingTemplate.category}
                      onChange={(e) => setEditingTemplate({
                        ...editingTemplate,
                        category: e.target.value
                      })}
                      className="p-2 border border-gray-300 rounded-lg"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    <button
                      onClick={handleUpdateTemplate}
                      className="text-green-500 hover:text-green-600"
                    >
                      <Save className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm text-gray-900">{template.text}</p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleFavorite(template.id)}
                        className={`${favorites.has(template.id) ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-600`}
                      >
                        <Star className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowPreview(template.id)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTemplateHistory(template.id);
                          setShowHistory(true);
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <History className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingTemplate(template)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleShare(template)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <Tag className="w-3 h-3 mr-1" />
                      {template.category}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>Used {template.usageCount} times</span>
                      <span>•</span>
                      <span>{formatDate(template.createdAt)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSelectTemplate(template)}
                    className="mt-2 w-full py-1 text-sm text-blue-500 hover:text-blue-600"
                  >
                    Use Template
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add template button */}
        <div className="p-4 border-t">
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Template
          </button>
        </div>

        {/* Add template form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 w-full max-w-md mx-4">
              <h3 className="text-lg font-medium mb-4">Add New Template</h3>
              <div className="mb-2 text-sm text-gray-600">
                Available variables: {Object.keys(TEMPLATE_VARIABLES).join(', ')}
              </div>
              {renderTemplateInput(
                newTemplate.text,
                handleTemplateInput,
                "Enter template text... Use variables like {user} or {date}"
              )}
              <select
                value={newTemplate.category}
                onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg mb-4"
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTemplate}
                  disabled={!newTemplate.text.trim() || !newTemplate.category}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
                >
                  Save Template (Ctrl/Cmd + Enter)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add category form */}
        {showAddCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 w-full max-w-md mx-4">
              <h3 className="text-lg font-medium mb-4">Add New Category</h3>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter category name..."
                className="w-full p-2 border border-gray-300 rounded-lg mb-4"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowAddCategory(false)}
                  className="px-4 py-2 text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCategory}
                  disabled={!newCategory.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
                >
                  Add Category
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Preview modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 w-full max-w-md mx-4">
              <h3 className="text-lg font-medium mb-4">Template Preview</h3>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-gray-900">
                  {processTemplate(templates.find(t => t.id === showPreview)?.text || '')}
                </p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowPreview(null)}
                  className="px-4 py-2 text-gray-500 hover:text-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Template History Modal */}
        {showHistory && selectedTemplateHistory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Template History</h3>
                <button
                  onClick={() => {
                    setShowHistory(false);
                    setSelectedTemplateHistory(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {templateHistory[selectedTemplateHistory]?.map((version, index) => (
                  <div key={version.timestamp} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-sm text-gray-900">{version.text}</div>
                      <button
                        onClick={() => handleRestoreVersion(selectedTemplateHistory, version)}
                        className="text-blue-500 hover:text-blue-600"
                        title="Restore this version"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <Tag className="w-3 h-3 mr-1" />
                        {version.category}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>Edited by {version.editor}</span>
                        <span>•</span>
                        <span>{formatRelativeTime(version.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {(!templateHistory[selectedTemplateHistory] || 
                  templateHistory[selectedTemplateHistory].length === 0) && (
                  <div className="text-center text-gray-500 py-8">
                    No history available
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Share Modal */}
        {showShareModal && selectedTemplateForShare && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 w-full max-w-md mx-4">
              <h3 className="text-lg font-medium mb-4">Share Template</h3>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Share code:</p>
                <div className="flex items-center bg-gray-50 p-2 rounded-lg">
                  <input
                    type="text"
                    value={btoa(JSON.stringify({
                      text: selectedTemplateForShare.text,
                      category: selectedTemplateForShare.category,
                      timestamp: Date.now()
                    }))}
                    readOnly
                    className="flex-1 bg-transparent outline-none"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(btoa(JSON.stringify({
                        text: selectedTemplateForShare.text,
                        category: selectedTemplateForShare.category,
                        timestamp: Date.now()
                      })));
                      setShowCopiedIndicator(true);
                      setTimeout(() => setShowCopiedIndicator(false), 2000);
                    }}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    {showCopiedIndicator ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setShowShareModal(false);
                    setSelectedTemplateForShare(null);
                  }}
                  className="px-4 py-2 text-gray-500 hover:text-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Import Modal */}
        {showImportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 w-full max-w-md mx-4">
              <h3 className="text-lg font-medium mb-4">Import Templates</h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Paste share code:</p>
                <input
                  type="text"
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  placeholder="Enter share code..."
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
                {importError && (
                  <p className="text-sm text-red-500 mt-1">{importError}</p>
                )}
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Or import from file:</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400"
                >
                  <Upload className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-sm">Choose JSON file</span>
                </button>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setShowImportModal(false);
                    setImportData('');
                    setImportError('');
                  }}
                  className="px-4 py-2 text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleImport(importData)}
                  disabled={!importData.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
                >
                  Import
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 