import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft, ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Flashcards = () => {
  const { notebook, setView } = useAppContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (notebook.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-black text-slate-700 mb-6 drop-shadow-sm">No cards to study</h2>
        <button onClick={() => setView('home')} className="px-8 py-4 bg-[#00CED1] text-white rounded-2xl font-bold hover:bg-[#20B2AA] transition-all shadow-[0_4px_0_rgb(0,180,180)] hover:-translate-y-1 active:translate-y-1 active:shadow-none">
          Go back
        </button>
      </div>
    );
  }

  const currentCard = notebook[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % notebook.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + notebook.length) % notebook.length);
    }, 150);
  };

  return (
    <div className="w-full max-w-md mx-auto h-[80vh] flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => setView('notebook')} className="p-3 hover:bg-[#FFF0F5] text-slate-400 hover:text-[#FF8DA1] rounded-2xl transition-all hover:-translate-y-1">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <span className="font-black text-slate-400 tracking-widest uppercase text-sm bg-white px-4 py-2 rounded-full shadow-sm border-2 border-slate-50">
          {currentIndex + 1} / {notebook.length}
        </span>
        <div className="w-12"></div>
      </div>

      <div className="flex-1 relative perspective-1000">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex + (isFlipped ? '-flipped' : '-front')}
            initial={{ rotateY: isFlipped ? -90 : 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: isFlipped ? 90 : -90, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsFlipped(!isFlipped)}
            className="absolute inset-0 w-full h-full cursor-pointer"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="w-full h-full bg-white rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-4 border-[#E0FFFF] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-[#FFB6C1] transition-colors">
              <div className="absolute top-6 right-6 opacity-50 group-hover:opacity-100 transition-opacity">
                <RotateCw className="w-6 h-6 text-[#00CED1]" />
              </div>

              {!isFlipped ? (
                // Front
                <>
                  {currentCard.imageUrl && (
                    <div className="w-56 h-56 rounded-[2rem] overflow-hidden mb-8 border-4 border-[#FFF0F5] shadow-lg rotate-3 group-hover:rotate-0 transition-all duration-300">
                      <img src={currentCard.imageUrl} alt={currentCard.query} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <h2 className="text-5xl font-black text-slate-800 tracking-tight drop-shadow-sm">{currentCard.query}</h2>
                </>
              ) : (
                // Back
                <div className="w-full h-full flex flex-col justify-center overflow-y-auto custom-scrollbar">
                  <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-2 drop-shadow-sm">{currentCard.word}</h2>
                  <h3 className="text-xl md:text-2xl font-black text-[#FF8DA1] mb-6 drop-shadow-sm">{currentCard.explanation}</h3>
                  <div className="space-y-4 text-left w-full">
                    {currentCard.examples.map((ex, idx) => (
                      <div key={idx} className="bg-[#FFF0F5] p-4 rounded-3xl border-2 border-white shadow-sm">
                        <p className="text-base text-slate-800 mb-1">{ex.target}</p>
                        <p className="text-sm text-slate-500">{ex.native}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-6 mt-10">
        <button
          onClick={handlePrev}
          className="p-5 bg-white hover:bg-[#E0FFFF] text-slate-400 hover:text-[#00CED1] rounded-2xl shadow-[0_4px_0_rgb(241,245,249)] hover:shadow-[0_4px_0_rgb(176,224,230)] transition-all active:translate-y-1 active:shadow-none border-2 border-slate-100 hover:border-[#E0FFFF]"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button
          onClick={handleNext}
          className="p-5 bg-white hover:bg-[#FFFACD] text-slate-400 hover:text-[#DAA520] rounded-2xl shadow-[0_4px_0_rgb(241,245,249)] hover:shadow-[0_4px_0_rgb(240,230,140)] transition-all active:translate-y-1 active:shadow-none border-2 border-slate-100 hover:border-[#FFFACD]"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};
