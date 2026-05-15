import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Bot, User, Loader2, Sparkles, MinusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

export default function AIChatbot() {
  const { token, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState('');
  const getGreeting = () => {
    if (!user?.name) return 'there';
    const name = user.name;
    const parts = name.split(' ');
    // If name is "Remera Manager", "Kimironko Manager", etc.
    if (parts.length > 1 && (parts[0] === 'Remera' || parts[0] === 'Kimironko')) {
      return parts.slice(1).join(' '); // Returns "Manager" or "Cashier"
    }
    return parts[0]; // Returns "Magda" or "Rosette"
  };

  const [messages, setMessages] = useState([
    { role: 'bot', text: `Hi ${getGreeting()}! I'm your StockSync AI. How can I help you manage your inventory today?` }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/ai/chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      
      setMessages(prev => [...prev, { role: 'bot', text: data.reply || "I'm sorry, I'm having trouble connecting to my brain right now." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "Error: Could not reach the AI service." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-violet-600 hover:bg-violet-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 z-50 group"
      >
        <Sparkles className="w-6 h-6 animate-pulse group-hover:rotate-12 transition-transform"/>
        <div className="absolute -top-2 -right-1 bg-rose-500 text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-white">AI</div>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 w-96 ${minimized ? 'h-16' : 'h-[500px]'} bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden transition-all z-50`}>
      {/* Header */}
      <div className="bg-violet-600 p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
            <Bot className="w-6 h-6 text-white"/>
          </div>
          <div>
            <h3 className="text-sm font-black text-white">StockSync AI</h3>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>
              <span className="text-[10px] font-bold text-violet-100 uppercase tracking-widest">Active Assistant</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setMinimized(!minimized)} className="p-2 text-violet-200 hover:text-white transition-colors">
            <MinusCircle className="w-4 h-4"/>
          </button>
          <button onClick={() => setIsOpen(false)} className="p-2 text-violet-200 hover:text-white transition-colors">
            <X className="w-5 h-5"/>
          </button>
        </div>
      </div>

      {!minimized && (
        <>
          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-sky-100 text-sky-600' : 'bg-violet-100 text-violet-600'}`}>
                    {msg.role === 'user' ? <User className="w-4 h-4"/> : <Bot className="w-4 h-4"/>}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm font-medium ${
                    msg.role === 'user' 
                      ? 'bg-sky-600 text-white rounded-tr-none' 
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-2 items-center bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <Loader2 className="w-4 h-4 animate-spin text-violet-500"/>
                  <span className="text-xs font-bold text-slate-400">AI is thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
            <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-violet-500 transition-all">
              <input 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about stock, sales, or users..."
                className="flex-1 bg-transparent border-none outline-none px-3 text-sm text-slate-800 dark:text-slate-200 font-medium"
              />
              <button 
                type="submit"
                disabled={!input.trim() || loading}
                className="w-10 h-10 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-xl flex items-center justify-center transition-all shadow-md active:scale-95"
              >
                <Send className="w-4 h-4"/>
              </button>
            </div>
            <p className="text-[9px] text-center text-slate-400 mt-2 font-bold uppercase tracking-tighter">Powered by Python AI Intelligence</p>
          </form>
        </>
      )}
    </div>
  );
}
