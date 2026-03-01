import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { speak } from '../services/tts';
import { LANGUAGES } from '../types';
import { Volume2, Bookmark, BookmarkCheck, ArrowLeft, MessageCircle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { ChatBox } from './ChatBox';

export const ResultCard = () => {
  const { currentResult, setView, previousView, notebook, addToNotebook, removeFromNotebook } = useAppContext();
  const [showChat, setShowChat] = useState(false);

  if (!currentResult) return null;

  const isSaved = notebook.some((n) => n.id === currentResult.id);
  const targetLang = LANGUAGES.find((l) => l.code === currentResult.targetLang);

  const handleToggleSave = () => {
    if (isSaved) {
      removeFromNotebook(currentResult.id);
    } else {
      addToNotebook(currentResult);
    }
  };

  const playAudio = (text: string) => {
    if (targetLang) {
      speak(text, targetLang.ttsCode);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-4 border-white overflow-hidden mb-20"
    >
      <div className="p-4 flex items-center justify-between border-b-4 border-slate-50">
        <button onClick={() => setView(previousView === 'notebook' ? 'notebook' : 'home')} className="p-3 hover:bg-[#FFF0F5] text-slate-400 hover:text-[#FF8DA1] rounded-2xl transition-all hover:-translate-y-1">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex gap-3">
          <button
            onClick={() => setShowChat(!showChat)}
            className="p-3 bg-[#E0FFFF] hover:bg-[#B0E0E6] text-[#00CED1] rounded-2xl transition-all flex items-center gap-2 px-5 font-bold shadow-[0_4px_0_rgb(176,224,230)] hover:-translate-y-1 active:translate-y-1 active:shadow-none"
          >
            <MessageCircle className="w-5 h-5" />
            Chat
          </button>
          <button
            onClick={handleToggleSave}
            className={`p-3 rounded-2xl transition-all flex items-center justify-center shadow-[0_4px_0_rgb(255,182,193)] hover:-translate-y-1 active:translate-y-1 active:shadow-none ${
              isSaved ? 'bg-[#FF69B4] text-white border-[#FF69B4]' : 'bg-[#FFF0F5] text-[#FF69B4] border-[#FFF0F5]'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-6 h-6 fill-current" /> : <Bookmark className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight drop-shadow-sm">
                {currentResult.word}
              </h1>
              <button
                onClick={() => playAudio(currentResult.word)}
                className="p-3 bg-[#FFFACD] hover:bg-[#F0E68C] text-[#DAA520] rounded-2xl transition-all shrink-0 shadow-[0_4px_0_rgb(240,230,140)] hover:-translate-y-1 active:translate-y-1 active:shadow-none"
              >
                <Volume2 className="w-6 h-6" />
              </button>
            </div>
            <div className="mb-4">
              <span className="text-lg font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">{currentResult.query}</span>
            </div>
            <p className="text-base text-slate-600 mb-6 leading-relaxed bg-slate-50 p-4 rounded-2xl border-2 border-slate-100">
              {currentResult.explanation}
            </p>
          </div>

          <div className="w-full md:w-48 h-48 shrink-0 rounded-[2rem] overflow-hidden bg-[#FFF0F5] flex items-center justify-center border-4 border-white shadow-lg rotate-2 hover:rotate-0 transition-all duration-300">
            {currentResult.imageUrl ? (
              <img src={currentResult.imageUrl} alt={currentResult.word} className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center text-[#FF8DA1]">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <span className="text-sm font-bold">Drawing...</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <div className="bg-[#E0FFFF] rounded-3xl p-6 border-4 border-white shadow-sm relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/40 rounded-full blur-xl"></div>
            <h3 className="text-sm font-black text-[#00CED1] uppercase tracking-wider mb-3">How to use it like a pro</h3>
            <p className="text-slate-700 leading-relaxed">{currentResult.usage}</p>
          </div>

          <div>
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-4 ml-2">Examples</h3>
            <div className="space-y-4">
              {currentResult.examples.map((ex, idx) => (
                <div key={idx} className="bg-white border-2 border-slate-100 p-5 rounded-3xl flex gap-4 items-start group hover:border-[#FFB6C1] transition-colors shadow-sm">
                  <button
                    onClick={() => playAudio(ex.target)}
                    className="p-3 bg-[#FFF0F5] text-[#FF8DA1] rounded-2xl shadow-sm opacity-50 group-hover:opacity-100 transition-all shrink-0 mt-1 hover:scale-110"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                  <div>
                    <p className="text-base text-slate-800 mb-1">{ex.target}</p>
                    <p className="text-sm text-slate-500">{ex.native}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showChat && (
        <div className="border-t-4 border-slate-50 bg-[#F8FAFC] p-6">
          <ChatBox word={currentResult.word} targetLang={targetLang?.name || ''} nativeLang={LANGUAGES.find(l => l.code === currentResult.nativeLang)?.name || ''} />
        </div>
      )}
    </motion.div>
  );
};
