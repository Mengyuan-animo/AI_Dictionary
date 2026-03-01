import { useAppContext } from '../context/AppContext';
import { LANGUAGES } from '../types';
import { ArrowRightLeft } from 'lucide-react';

export const LanguageSelector = () => {
  const { nativeLang, setNativeLang, targetLang, setTargetLang } = useAppContext();

  const handleSwap = () => {
    setNativeLang(targetLang);
    setTargetLang(nativeLang);
  };

  return (
    <div className="flex items-center justify-between bg-white p-3 md:p-5 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-4 border-white mb-4 md:mb-8 relative z-10">
      <div className="flex-1 flex flex-col bg-slate-50 p-3 md:p-4 rounded-3xl border-2 border-slate-100 min-w-0">
        <label className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-wider mb-1 md:mb-2 truncate">I speak</label>
        <select
          value={nativeLang.code}
          onChange={(e) => setNativeLang(LANGUAGES.find((l) => l.code === e.target.value) || LANGUAGES[0])}
          className="bg-transparent text-sm md:text-xl font-bold text-slate-700 outline-none appearance-none cursor-pointer w-full truncate"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleSwap}
        className="p-3 md:p-4 bg-[#FFB6C1] hover:bg-[#FF8DA1] text-white rounded-2xl transition-all flex-shrink-0 mx-2 md:mx-4 shadow-[0_4px_0_rgb(255,140,150)] hover:-translate-y-1 active:translate-y-1 active:shadow-none z-10"
        aria-label="Swap languages"
      >
        <ArrowRightLeft className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      <div className="flex-1 flex flex-col items-end text-right bg-slate-50 p-3 md:p-4 rounded-3xl border-2 border-slate-100 min-w-0">
        <label className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-wider mb-1 md:mb-2 truncate w-full text-right">I want to learn</label>
        <select
          value={targetLang.code}
          onChange={(e) => setTargetLang(LANGUAGES.find((l) => l.code === e.target.value) || LANGUAGES[3])}
          className="bg-transparent text-sm md:text-xl font-bold text-[#00CED1] outline-none appearance-none cursor-pointer text-right w-full truncate"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
