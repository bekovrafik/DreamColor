import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface SavedBook {
  id: string;
  title: string;
  date: string;
  imageUrl: string; // Cover image
  pages: string[]; // All pages
  theme: string;
}

interface AppContextType {
  childName: string;
  setChildName: (name: string) => void;
  theme: string;
  setTheme: (theme: string) => void;
  generatedImages: string[];
  setGeneratedImages: (imgs: string[]) => void;
  uploadedImage: string | null;
  setUploadedImage: (img: string | null) => void;
  chatHistory: ChatMessage[];
  addChatMessage: (role: 'user' | 'model', text: string) => void;
  clearChat: () => void;
  savedBooks: SavedBook[];
  saveBook: (book: Omit<SavedBook, 'id' | 'date'>) => void;
  deleteBook: (id: string) => void;
  resetAdventure: () => void;
  loadBook: (book: SavedBook) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  logout: () => void;
  // Plan Logic
  credits: number;
  isPaidUser: boolean; // True if they have ever purchased
  purchaseCredits: (pack: 'single' | 'party') => void;
  deductCredits: (amount: number) => boolean;
  checkFreeLimit: () => { allowed: boolean; waitTimeStr?: string };
  recordFreeGeneration: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize from local storage
  const [childName, setChildNameState] = useState(() => localStorage.getItem('dreamcolor_childName') || '');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('dreamcolor_theme') === 'dark');
  
  // Plan State
  const [credits, setCredits] = useState(() => {
    const stored = localStorage.getItem('dreamcolor_credits');
    return stored ? parseInt(stored, 10) : 0;
  });
  
  const [isPaidUser, setIsPaidUser] = useState(() => localStorage.getItem('dreamcolor_isPaidUser') === 'true');

  const [lastFreeGenerationTime, setLastFreeGenerationTime] = useState(() => {
    const stored = localStorage.getItem('dreamcolor_lastFreeGen');
    return stored ? parseInt(stored, 10) : 0;
  });

  const [theme, setTheme] = useState('');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  
  const [savedBooks, setSavedBooks] = useState<SavedBook[]>(() => {
    try {
      const saved = localStorage.getItem('dreamcolor_books');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Persist Credits & Status
  useEffect(() => {
    localStorage.setItem('dreamcolor_credits', credits.toString());
  }, [credits]);

  useEffect(() => {
    localStorage.setItem('dreamcolor_isPaidUser', isPaidUser.toString());
  }, [isPaidUser]);

  // Persist Child Name
  const setChildName = (name: string) => {
    setChildNameState(name);
    localStorage.setItem('dreamcolor_childName', name);
  };

  // Handle Dark Mode Persistence
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('dreamcolor_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('dreamcolor_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const addChatMessage = (role: 'user' | 'model', text: string) => {
    setChatHistory((prev) => [...prev, { role, text }]);
  };

  const clearChat = () => {
    setChatHistory([]);
  };

  const saveBook = (book: Omit<SavedBook, 'id' | 'date'>) => {
    const newBook: SavedBook = {
      ...book,
      id: crypto.randomUUID(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
    const updatedBooks = [newBook, ...savedBooks];
    setSavedBooks(updatedBooks);
    localStorage.setItem('dreamcolor_books', JSON.stringify(updatedBooks));
  };

  const deleteBook = (id: string) => {
    const updatedBooks = savedBooks.filter(book => book.id !== id);
    setSavedBooks(updatedBooks);
    localStorage.setItem('dreamcolor_books', JSON.stringify(updatedBooks));
  };

  const resetAdventure = () => {
    setTheme('');
    setUploadedImage(null);
    setGeneratedImages([]);
    setChatHistory([]);
  };

  const loadBook = (book: SavedBook) => {
      setTheme(book.theme);
      setGeneratedImages(book.pages || [book.imageUrl]);
      setUploadedImage(null);
      setChatHistory([]);
  };

  const logout = () => {
      setChildName('');
      localStorage.removeItem('dreamcolor_childName');
      setCredits(0);
      setIsPaidUser(false);
      localStorage.removeItem('dreamcolor_credits');
      localStorage.removeItem('dreamcolor_isPaidUser');
  };

  // Plan Logic
  const purchaseCredits = (pack: 'single' | 'party') => {
      setIsPaidUser(true);
      // Single Adventure ($2.99) = 6 Credits (5 pages + 1 cover)
      // Party Pack ($29.99) = 30 Credits (5 Books)
      const amountToAdd = pack === 'single' ? 6 : 30;
      setCredits(prev => prev + amountToAdd);
  };

  const deductCredits = (amount: number) => {
    if (credits >= amount) {
        setCredits(prev => prev - amount);
        return true;
    }
    return false;
  };

  const checkFreeLimit = () => {
      // If user has credits, they should use them via the Paid flow. 
      // This check is specifically for the 24h free cooldown.
      const now = Date.now();
      const hours24 = 24 * 60 * 60 * 1000;
      const diff = now - lastFreeGenerationTime;

      if (diff > hours24) {
          return { allowed: true };
      } else {
          const remaining = hours24 - diff;
          const hours = Math.floor(remaining / (1000 * 60 * 60));
          const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
          return { 
              allowed: false, 
              waitTimeStr: `${hours}h ${minutes}m` 
          };
      }
  };

  const recordFreeGeneration = () => {
      const now = Date.now();
      setLastFreeGenerationTime(now);
      localStorage.setItem('dreamcolor_lastFreeGen', now.toString());
  };

  return (
    <AppContext.Provider
      value={{
        childName,
        setChildName,
        theme,
        setTheme,
        generatedImages,
        setGeneratedImages,
        uploadedImage,
        setUploadedImage,
        chatHistory,
        addChatMessage,
        clearChat,
        savedBooks,
        saveBook,
        deleteBook,
        resetAdventure,
        loadBook,
        darkMode,
        toggleDarkMode,
        logout,
        credits,
        isPaidUser,
        purchaseCredits,
        deductCredits,
        checkFreeLimit,
        recordFreeGeneration
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};