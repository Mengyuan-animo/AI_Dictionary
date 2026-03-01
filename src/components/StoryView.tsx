import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { generateStory } from '../services/ai';
import { ArrowLeft, Loader2, BookOpen, Sparkles } from 'lucide-react';
import { StoryResult } from '../types';
import { motion } from 'motion/react';

export const StoryView = () => {
  const { notebook, setView, targetLang, nativeLang } = useAppContext();
  const [story, setStory] = useState<StoryResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStory = async () => {
      if (notebook.length === 0) return;
      
      // Select up to 10 random words to keep the story focused
      const words = notebook
        .sort(() => 0.5 - Math.random())
        .slice(0, 10)
        .map((n) => n.word);

      try {
        const result = await generateStory(words, targetLang.name, nativeLang.name);
        setStory(result);
      } catch (error) {
        console.error('Failed to generate story:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStory();
  }, [notebook, targetLang.name, nativeLang.name]);

  if (notebook.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-black text-slate-700 mb-6 drop-shadow-sm">Add words to your notebook first</h2>
        <button onClick={() => setView('home')} className="px-8 py-4 bg-[#00CED1] text-white rounded-2xl font-bold hover:bg-[#20B2AA] transition-all shadow-[0_4px_0_rgb(0,180,180)] hover:-translate-y-1 active:translate-y-1 active:shadow-none">
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto pb-20">
      <div className="flex items-center mb-10 gap-6">
        <button onClick={() => setView('notebook')} className="p-3 hover:bg-[#FFF0F5] text-slate-400 hover:text-[#FF8DA1] rounded-2xl transition-all hover:-translate-y-1">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-4xl font-black text-slate-800 flex items-center gap-4 drop-shadow-sm">
          <div className="p-3 bg-[#FFB6C1] rounded-2xl shadow-[0_4px_0_rgb(255,140,150)]">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          Story Time
        </h1>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-4 border-white">
          <Loader2 className="w-16 h-16 text-[#FFB6C1] animate-spin mb-8" />
          <h2 className="text-3xl font-black text-slate-700 mb-4 drop-shadow-sm">Weaving your words into a tale...</h2>
          <p className="text-slate-500 font-bold text-lg">This might take a few seconds.</p>
        </div>
      ) : story ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-4 border-white overflow-hidden"
        >
          <div className="p-8 md:p-12 bg-[#E0FFFF] text-[#00CED1] relative overflow-hidden border-b-4 border-white">
            <BookOpen className="w-64 h-64 absolute -right-10 -bottom-10 text-white opacity-50 rotate-12" />
            <h2 className="text-3xl md:text-4xl font-black leading-tight relative z-10 drop-shadow-sm">
              {story.storyTarget}
            </h2>
          </div>
          <div className="p-8 md:p-12 bg-[#FFF0F5]">
            <h3 className="text-sm font-black text-[#FF8DA1] uppercase tracking-wider mb-6">Translation</h3>
            <p className="text-xl text-slate-700 leading-relaxed font-bold">
              {story.storyNative}
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="text-center py-20 bg-white rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-4 border-white">
          <h2 className="text-3xl font-black text-[#FF8DA1] mb-4 drop-shadow-sm">Oops! The storyteller fell asleep.</h2>
          <p className="text-slate-500 mb-8 font-bold text-lg">Failed to generate the story. Please try again.</p>
          <button onClick={() => setView('notebook')} className="px-8 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-all shadow-[0_4px_0_rgb(226,232,240)] hover:-translate-y-1 active:translate-y-1 active:shadow-none">
            Go back
          </button>
        </div>
      )}
    </div>
  );
};
