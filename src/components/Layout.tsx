import { ReactNode } from 'react';
import { useAppContext } from '../context/AppContext';
import { BookOpen, Search, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

export const Layout = ({ children }: { children: ReactNode }) => {
  const { view, setView, notebook } = useAppContext();

  return (
    <div className="min-h-screen bg-[#FFF0F5] font-sans text-slate-800 selection:bg-pink-200 selection:text-pink-900 overflow-x-hidden">
      <header className="sticky top-0 z-50 pt-4 px-4 pb-2">
        <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-md border-4 border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          <div
            className="flex items-center gap-2 md:gap-3 cursor-pointer group"
            onClick={() => setView('home')}
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#FFB6C1] rounded-2xl flex items-center justify-center shadow-[0_4px_0_rgb(255,140,150)] group-hover:-translate-y-1 group-active:translate-y-1 group-active:shadow-none transition-all">
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tight text-[#FF8DA1] drop-shadow-sm">
              LingoPop
            </span>
          </div>

          <nav className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setView('home')}
              className={cn(
                'px-3 py-2 md:px-5 md:py-3 rounded-xl md:rounded-2xl font-bold text-sm transition-all flex items-center gap-2 border-2',
                view === 'home' || view === 'result'
                  ? 'bg-[#E0FFFF] text-[#00CED1] border-[#00CED1] shadow-[0_4px_0_rgb(0,206,209)] -translate-y-1'
                  : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50 hover:-translate-y-1 hover:shadow-[0_4px_0_rgb(241,245,249)]'
              )}
            >
              <Search className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Search</span>
            </button>
            <button
              onClick={() => setView('notebook')}
              className={cn(
                'px-3 py-2 md:px-5 md:py-3 rounded-xl md:rounded-2xl font-bold text-sm transition-all flex items-center gap-2 relative border-2',
                view === 'notebook' || view === 'flashcards' || view === 'story'
                  ? 'bg-[#FFFACD] text-[#DAA520] border-[#DAA520] shadow-[0_4px_0_rgb(218,165,32)] -translate-y-1'
                  : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50 hover:-translate-y-1 hover:shadow-[0_4px_0_rgb(241,245,249)]'
              )}
            >
              <BookOpen className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Notebook</span>
              {notebook.length > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 md:w-6 md:h-6 bg-[#FF69B4] text-white text-[10px] md:text-xs font-black rounded-full flex items-center justify-center shadow-md border-2 border-white animate-bounce">
                  {notebook.length}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12 min-h-[calc(100vh-6rem)]">
        {children}
      </main>
    </div>
  );
};
