import { AppProvider, useAppContext } from './context/AppContext';
import { Layout } from './components/Layout';
import { LanguageSelector } from './components/LanguageSelector';
import { SearchBar } from './components/SearchBar';
import { ResultCard } from './components/ResultCard';
import { Notebook } from './components/Notebook';
import { Flashcards } from './components/Flashcards';
import { StoryView } from './components/StoryView';
import { motion, AnimatePresence } from 'motion/react';

const MainContent = () => {
  const { view } = useAppContext();

  return (
    <Layout>
      <AnimatePresence mode="wait">
        {view === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="flex flex-col items-center justify-center min-h-[50vh] max-w-2xl mx-auto w-full"
          >
            <div className="text-center mb-8 relative">
              <motion.div 
                animate={{ y: [0, -10, 0] }} 
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="absolute -top-12 -left-12 w-20 h-20 bg-[#E0FFFF] rounded-full -z-10 blur-xl opacity-70"
              />
              <motion.div 
                animate={{ y: [0, 10, 0] }} 
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -bottom-8 -right-8 w-24 h-24 bg-[#FFFACD] rounded-full -z-10 blur-xl opacity-70"
              />
              <h1 className="text-4xl md:text-6xl font-black text-slate-800 tracking-tight mb-4 drop-shadow-sm">
                Learn any word,<br />
                <span className="text-[#FF8DA1]">
                  instantly.
                </span>
              </h1>
              <p className="text-base md:text-xl text-slate-500 font-bold bg-white/50 inline-block px-4 md:px-6 py-2 rounded-full border-2 border-white shadow-sm">
                Type or say a word to get started! 🎈
              </p>
            </div>
            <div className="w-full space-y-4">
              <LanguageSelector />
              <SearchBar />
            </div>
          </motion.div>
        )}

        {view === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', bounce: 0.4 }}
            className="w-full"
          >
            <ResultCard />
          </motion.div>
        )}

        {view === 'notebook' && (
          <motion.div
            key="notebook"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full"
          >
            <Notebook />
          </motion.div>
        )}

        {view === 'flashcards' && (
          <motion.div
            key="flashcards"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full"
          >
            <Flashcards />
          </motion.div>
        )}

        {view === 'story' && (
          <motion.div
            key="story"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full"
          >
            <StoryView />
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
