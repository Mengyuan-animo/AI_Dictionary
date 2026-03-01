import { useAppContext } from '../context/AppContext';
import { BookOpen, Trash2, PlayCircle, Layers } from 'lucide-react';
import { motion } from 'motion/react';
import { LANGUAGES } from '../types';

export const Notebook = () => {
  const { notebook, removeFromNotebook, setView, setCurrentResult } = useAppContext();

  if (notebook.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-4 border-white">
          <BookOpen className="w-12 h-12 text-[#FFB6C1]" />
        </div>
        <h2 className="text-3xl font-black text-slate-700 mb-4 drop-shadow-sm">Your notebook is empty</h2>
        <p className="text-slate-500 font-medium text-lg">Save words you want to remember, and they'll show up here.</p>
        <button
          onClick={() => setView('home')}
          className="mt-8 px-8 py-4 bg-[#00CED1] text-white rounded-2xl font-bold hover:bg-[#20B2AA] transition-all shadow-[0_4px_0_rgb(0,180,180)] hover:-translate-y-1 active:translate-y-1 active:shadow-none"
        >
          Start Exploring
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <h1 className="text-4xl font-black text-slate-800 flex items-center gap-4 drop-shadow-sm">
          <div className="p-3 bg-[#FFFACD] rounded-2xl shadow-[0_4px_0_rgb(240,230,140)]">
            <BookOpen className="w-8 h-8 text-[#DAA520]" />
          </div>
          My Notebook
        </h1>
        <div className="flex gap-4 w-full md:w-auto">
          <button
            onClick={() => setView('flashcards')}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-[#FFFACD] hover:bg-[#F0E68C] text-[#DAA520] font-black rounded-2xl transition-all shadow-[0_4px_0_rgb(240,230,140)] hover:-translate-y-1 active:translate-y-1 active:shadow-none border-2 border-[#FFFACD]"
          >
            <Layers className="w-6 h-6" />
            Study Mode
          </button>
          <button
            onClick={() => setView('story')}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-[#FFB6C1] hover:bg-[#FF8DA1] text-white font-black rounded-2xl transition-all shadow-[0_4px_0_rgb(255,140,150)] hover:-translate-y-1 active:translate-y-1 active:shadow-none border-2 border-[#FFB6C1]"
          >
            <PlayCircle className="w-6 h-6" />
            Make a Story
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {notebook.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-4 border-white hover:border-[#E0FFFF] transition-all group relative overflow-hidden cursor-pointer hover:-translate-y-2"
            onClick={() => {
              setCurrentResult(item);
              setView('result');
            }}
          >
            <div className="absolute top-2 right-2 p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromNotebook(item.id);
                }}
                className="p-3 bg-[#FFF0F5] text-[#FF8DA1] hover:bg-[#FFB6C1] hover:text-white rounded-2xl transition-all shadow-sm"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            
            <div>
              {item.imageUrl && (
                <div className="w-full h-40 rounded-3xl overflow-hidden mb-6 bg-[#FFF0F5] border-2 border-slate-50">
                  <img src={item.imageUrl} alt={item.query} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
              )}
              <h3 className="text-3xl font-black text-slate-800 mb-2 truncate drop-shadow-sm">{item.query}</h3>
              <p className="text-slate-400 font-medium text-sm truncate uppercase tracking-wider">
                {LANGUAGES.find(l => l.code === item.targetLang)?.name || item.targetLang}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
