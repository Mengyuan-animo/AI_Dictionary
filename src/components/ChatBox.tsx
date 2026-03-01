import { useState, useEffect, useRef, FormEvent } from 'react';
import { createChatSession } from '../services/ai';
import { Send, Loader2, Bot, User } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

export const ChatBox = ({ word, targetLang, nativeLang }: { word: string; targetLang: string; nativeLang: string }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatSessionRef.current = createChatSession(word, targetLang, nativeLang);
    setMessages([
      {
        id: 'welcome',
        text: `Hi! I'm your language buddy. Got any questions about "${word}"? Let's chat!`,
        isUser: false,
      },
    ]);
  }, [word, targetLang, nativeLang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !chatSessionRef.current) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { id: Date.now().toString(), text: userMessage, isUser: true }]);
    setIsLoading(true);

    try {
      const response = await chatSessionRef.current.sendMessage({ message: userMessage });
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString() + 'ai', text: response.text, isUser: false },
      ]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString() + 'err', text: 'Oops, my brain froze! Try again?', isUser: false },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[400px] bg-white rounded-[2rem] border-4 border-[#E0FFFF] shadow-sm overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.map((msg) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id}
            className={cn(
              "flex gap-4 max-w-[85%]",
              msg.isUser ? "ml-auto flex-row-reverse" : ""
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
              msg.isUser ? "bg-[#FFFACD] text-[#DAA520]" : "bg-[#E0FFFF] text-[#00CED1]"
            )}>
              {msg.isUser ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
            </div>
            <div className={cn(
              "p-4 rounded-3xl font-medium leading-relaxed",
              msg.isUser 
                ? "bg-[#FFFACD] text-slate-800 rounded-tr-none" 
                : "bg-slate-50 border-2 border-slate-100 text-slate-700 rounded-tl-none"
            )}>
              {msg.text}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 max-w-[85%]">
            <div className="w-10 h-10 rounded-2xl bg-[#E0FFFF] text-[#00CED1] flex items-center justify-center shrink-0 shadow-sm">
              <Bot className="w-6 h-6" />
            </div>
            <div className="p-4 rounded-3xl rounded-tl-none bg-slate-50 border-2 border-slate-100 text-slate-700 flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-[#00CED1]" />
              <span className="font-bold text-sm text-slate-400">Thinking...</span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="p-4 bg-slate-50 border-t-2 border-slate-100 flex gap-2 relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything..."
          className="w-full pl-6 pr-16 py-4 bg-white rounded-2xl border-2 border-slate-100 focus:border-[#00CED1] focus:ring-4 focus:ring-[#00CED1]/20 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="absolute right-6 top-6 p-3 bg-[#00CED1] hover:bg-[#20B2AA] disabled:bg-slate-200 text-white rounded-xl transition-all shadow-[0_4px_0_rgb(0,180,180)] hover:-translate-y-1 active:translate-y-1 active:shadow-none disabled:shadow-none disabled:translate-y-0"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
