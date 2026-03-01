import { useState, FormEvent, useRef, useEffect } from 'react';
import { Search, Loader2, History, Mic, MicOff } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { lookupWord, generateImage } from '../services/ai';
import { v4 as uuidv4 } from 'uuid';
import { DictionaryResult } from '../types';
import { cn } from '../lib/utils';

export const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { nativeLang, targetLang, setCurrentResult, setView, history, addToHistory, clearHistory } = useAppContext();
  const historyRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (historyRef.current && !historyRef.current.contains(event.target as Node)) {
        setShowHistory(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    // Setup Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
        // Optional: auto-search after voice input
        // executeSearch(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        if (event.error !== 'no-speech') {
          console.error('Speech recognition error', event.error);
        }
        setIsListening(false);
        if (event.error === 'not-allowed') {
          alert('Microphone access was denied. Please allow microphone access in your browser settings to use voice search.');
        } else if (event.error === 'no-speech') {
          // Silently handle no-speech timeout, or you could add a gentle toast here
          console.log('No speech detected. Microphone turned off.');
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        // Try to set language to target language for better recognition if they are speaking target lang,
        // or native lang if they are speaking native lang. Let's default to targetLang or nativeLang based on what's more likely.
        // Usually they want to search a word in the target language.
        recognitionRef.current.lang = targetLang.ttsCode || 'en-US';
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        alert('Speech recognition is not supported in your browser.');
      }
    }
  };

  const executeSearch = async (searchQuery: string) => {
    if (!searchQuery.trim() || isLoading) return;

    setIsLoading(true);
    setShowHistory(false);
    addToHistory(searchQuery.trim());
    
    try {
      const resultData = await lookupWord(searchQuery, targetLang.name, nativeLang.name);
      
      const partialResult: DictionaryResult = {
        ...resultData,
        id: uuidv4(),
        query: searchQuery,
        targetLang: targetLang.code,
        nativeLang: nativeLang.code,
        createdAt: Date.now(),
      };

      setCurrentResult(partialResult);
      setView('result');
      setQuery('');
      setIsLoading(false);

      // Fetch image in background
      try {
        const imageUrl = await generateImage(resultData.imagePrompt);
        setCurrentResult((prev) => prev ? { ...prev, imageUrl } : null);
      } catch (imgError) {
        console.error('Failed to generate image:', imgError);
      }
    } catch (error) {
      console.error('Search failed:', error);
      alert('Oops! Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    executeSearch(query);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto" ref={historyRef}>
      <form onSubmit={handleSearch} className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowHistory(true)}
          placeholder={isListening ? "Listening..." : "Type a word..."}
          className={cn(
            "w-full pl-4 md:pl-8 pr-[140px] md:pr-[180px] py-4 md:py-6 bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-4 outline-none text-base md:text-xl font-bold transition-all placeholder:text-slate-300 placeholder:font-medium",
            isListening ? "border-[#FFB6C1] ring-4 ring-[#FFB6C1]/20" : "border-white focus:border-[#E0FFFF] focus:ring-4 focus:ring-[#E0FFFF]/50"
          )}
          disabled={isLoading}
        />
        <div className="absolute right-2 md:right-3 flex items-center gap-1 md:gap-2">
          <button
            type="button"
            onClick={toggleListening}
            className={cn(
              "p-2 md:p-3 rounded-2xl transition-all border-2",
              isListening 
                ? "bg-[#FFB6C1] text-white border-[#FFB6C1] animate-pulse shadow-[0_4px_0_rgb(255,140,150)] -translate-y-1" 
                : "bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100 hover:text-[#FF8DA1] hover:-translate-y-1 hover:shadow-[0_4px_0_rgb(241,245,249)]"
            )}
            title="Voice Input"
          >
            {isListening ? <Mic className="w-5 h-5 md:w-6 md:h-6" /> : <MicOff className="w-5 h-5 md:w-6 md:h-6" />}
          </button>
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 md:p-3 text-slate-400 hover:text-[#DAA520] transition-all rounded-2xl bg-slate-50 border-2 border-slate-100 hover:-translate-y-1 hover:shadow-[0_4px_0_rgb(241,245,249)]"
            title="Search History"
          >
            <History className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="p-3 md:p-4 bg-[#00CED1] hover:bg-[#20B2AA] disabled:bg-slate-200 disabled:border-slate-200 disabled:shadow-none disabled:translate-y-0 text-white rounded-2xl transition-all flex items-center justify-center shrink-0 border-2 border-[#00CED1] shadow-[0_4px_0_rgb(0,180,180)] hover:-translate-y-1 active:translate-y-1 active:shadow-none"
          >
            {isLoading ? <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" /> : <Search className="w-5 h-5 md:w-6 md:h-6" />}
          </button>
        </div>
      </form>

      {showHistory && history.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-[2rem] shadow-xl border-4 border-white overflow-hidden z-50">
          <div className="flex items-center justify-between p-5 border-b-2 border-slate-50 bg-slate-50/50">
            <span className="text-sm font-black text-slate-400 uppercase tracking-wider">Recent Searches</span>
            <button
              type="button"
              onClick={clearHistory}
              className="text-sm font-bold text-slate-400 hover:text-[#FF8DA1] transition-colors bg-white px-3 py-1 rounded-full shadow-sm"
            >
              Clear
            </button>
          </div>
          <ul className="max-h-60 overflow-y-auto py-2">
            {history.map((item, idx) => (
              <li key={idx}>
                <button
                  type="button"
                  onClick={() => {
                    setQuery(item);
                    executeSearch(item);
                  }}
                  className="w-full text-left px-6 py-4 hover:bg-[#FFF0F5] text-slate-700 transition-colors flex items-center gap-4 font-bold text-lg group"
                >
                  <History className="w-5 h-5 text-slate-300 group-hover:text-[#FF8DA1] transition-colors shrink-0" />
                  <span className="truncate">{item}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
