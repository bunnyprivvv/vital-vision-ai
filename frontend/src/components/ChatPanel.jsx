import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, User, ChevronRight } from 'lucide-react';
import ReactiveBot from './ReactiveBot';

const ChatPanel = ({ logs = [] }) => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'SENTINEL_AI active. I am your strategic health bridge. You can initialize a diagnostic scan using the quick links below or ask me any health-related question.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [botStatus, setBotStatus] = useState('idle');
  const [suggestions, setSuggestions] = useState([]);
  const endRef = useRef(null);

  const latestScore = logs.length > 0 ? logs[0].data.score : 100;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const activeScans = logs.map(l => l.type);
    const newSuggestions = [];

    if (!activeScans.includes('HemaScan')) {
      newSuggestions.push({ id: 'hema', text: 'START_HEMA_SCAN', path: '/hemascan' });
    }
    if (!activeScans.includes('AudioTriage')) {
      newSuggestions.push({ id: 'audio', text: 'START_AUDIO_SCAN', path: '/audiotriage' });
    }
    
    setSuggestions(newSuggestions);
  }, [logs]);

  const sendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setBotStatus('thinking');

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/chat`, {
        message: userMessage.text,
        currentScore: latestScore
      });
      
      setBotStatus('responding');
      setMessages(prev => [...prev, { sender: 'bot', text: res.data.reply }]);
      setTimeout(() => setBotStatus('idle'), 2000);
    } catch (err) {
      setBotStatus('idle');
      setMessages(prev => [...prev, { sender: 'bot', text: 'CONNECTION_STALLED. Please retry your request or check your uplink.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[650px] gap-8">
      
      {/* 1. Bot Visual Deck */}
      <div className="tech-ticket flex flex-col items-center justify-center py-12 bg-white/[0.01] border-white/5 mx-auto w-full relative overflow-hidden group">
        <div className="absolute top-4 left-4 flex flex-col gap-1 opacity-20">
           <span className="text-[6px] font-black uppercase tracking-widest">Model: SENTINEL_V11</span>
           <span className="text-[6px] font-black uppercase tracking-widest">Status: NOMINAL</span>
        </div>
        
        <ReactiveBot status={botStatus} size={140} />
        
        <div className="mt-8 flex flex-col items-center gap-2">
           <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyber-cyan">SENTINEL_OPERATIONAL</span>
           <div className="flex items-center gap-3">
              <div className={`w-1.5 h-1.5 rounded-full ${botStatus === 'idle' ? 'bg-cyber-lime' : 'bg-sunset-orange'} animate-pulse shadow-[0_0_8px_currentColor]`} />
              <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest">{botStatus.toUpperCase()} // LISTENING</span>
           </div>
        </div>
      </div>

      {/* 2. Message Thread */}
      <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar flex flex-col gap-10 pb-4">
        {messages.map((msg, i) => (
          <div 
            key={i}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} transition-all`}
          >
            <div className={`
              max-w-[90%] p-6 text-[10px] uppercase font-black tracking-widest leading-relaxed relative
              ${msg.sender === 'user' 
                ? 'bg-white text-black border border-white' 
                : 'bg-white/[0.03] text-white/70 border border-white/5'}
            `}>
              <div className={`absolute top-0 ${msg.sender === 'user' ? 'right-0 -translate-y-1/2' : 'left-0 -translate-y-1/2'} flex items-center gap-2 px-2 py-1 bg-black border border-white/10`}>
                 <span className="text-[6px] font-bold text-white/40">{msg.sender === 'user' ? 'OPERATOR_77' : 'SYSTEM_REPLY'}</span>
              </div>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* 3. Input Deck */}
      <div className="mt-auto pt-8 border-t border-white/5">
        <div className="flex flex-col gap-3 mb-8">
           <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.4em]">Quick Launch Protocols</span>
           <div className="flex flex-wrap gap-3">
              {suggestions.map(s => (
                <button 
                  key={s.id} 
                  onClick={() => { window.location.href = s.path; }}
                  className="px-4 py-3 bg-white/[0.02] border border-white/5 text-[8px] font-black text-white/30 hover:text-cyber-cyan hover:bg-cyber-cyan/5 hover:border-cyber-cyan/20 transition-all uppercase tracking-[0.2em] cursor-none clickable flex items-center gap-2"
                >
                  <ChevronRight size={10} /> {s.text}
                </button>
              ))}
           </div>
        </div>
        
        <form onSubmit={sendMessage} className="relative flex items-center gap-4 group">
           <input 
             type="text" 
             value={input}
             onChange={(e) => setInput(e.target.value)}
             placeholder="Type message or health command..."
             disabled={loading}
             className="flex-1 bg-white/[0.02] border border-white/5 p-5 text-[11px] text-white placeholder-white/10 focus:outline-none focus:border-cyber-cyan/30 transition-all font-black tracking-[0.3em] cursor-none clickable"
           />
           <button type="submit" disabled={loading} className="p-5 bg-white text-black hover:bg-cyber-cyan transition-all cursor-none clickable">
             <Send size={18} />
           </button>
        </form>
      </div>

    </div>
  );
};

export default ChatPanel;
