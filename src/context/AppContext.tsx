import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, LANGUAGES, DictionaryResult } from '../types';
import { getNotebook, saveToNotebook, removeFromNotebook, getHistory, saveToHistory, clearHistory as clearStorageHistory } from '../services/storage';

interface AppState {
  nativeLang: Language;
  setNativeLang: (lang: Language) => void;
  targetLang: Language;
  setTargetLang: (lang: Language) => void;
  notebook: DictionaryResult[];
  addToNotebook: (item: DictionaryResult) => void;
  removeFromNotebook: (id: string) => void;
  history: string[];
  addToHistory: (query: string) => void;
  clearHistory: () => void;
  currentResult: DictionaryResult | null;
  setCurrentResult: (result: DictionaryResult | null) => void;
  view: 'home' | 'result' | 'notebook' | 'flashcards' | 'story';
  previousView: 'home' | 'result' | 'notebook' | 'flashcards' | 'story';
  setView: (view: 'home' | 'result' | 'notebook' | 'flashcards' | 'story') => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [nativeLang, setNativeLang] = useState<Language>(LANGUAGES[0]);
  const [targetLang, setTargetLang] = useState<Language>(LANGUAGES[1]); // Default to Mandarin Chinese
  const [notebook, setNotebook] = useState<DictionaryResult[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [currentResult, setCurrentResult] = useState<DictionaryResult | null>(null);
  const [view, setView] = useState<'home' | 'result' | 'notebook' | 'flashcards' | 'story'>('home');
  const [previousView, setPreviousView] = useState<'home' | 'result' | 'notebook' | 'flashcards' | 'story'>('home');

  useEffect(() => {
    setNotebook(getNotebook());
    setHistory(getHistory());
  }, []);

  const handleAddToNotebook = (item: DictionaryResult) => {
    saveToNotebook(item);
    setNotebook(getNotebook());
  };

  const handleRemoveFromNotebook = (id: string) => {
    removeFromNotebook(id);
    setNotebook(getNotebook());
  };

  const handleAddToHistory = (query: string) => {
    saveToHistory(query);
    setHistory(getHistory());
  };

  const handleClearHistory = () => {
    clearStorageHistory();
    setHistory([]);
  };

  const handleSetView = (newView: 'home' | 'result' | 'notebook' | 'flashcards' | 'story') => {
    setPreviousView(view);
    setView(newView);
  };

  return (
    <AppContext.Provider
      value={{
        nativeLang,
        setNativeLang,
        targetLang,
        setTargetLang,
        notebook,
        addToNotebook: handleAddToNotebook,
        removeFromNotebook: handleRemoveFromNotebook,
        history,
        addToHistory: handleAddToHistory,
        clearHistory: handleClearHistory,
        currentResult,
        setCurrentResult,
        view,
        previousView,
        setView: handleSetView,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
