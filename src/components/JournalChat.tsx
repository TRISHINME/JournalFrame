import React, { useState, useRef, useEffect } from 'react';
import { JournalMessage, JournalEntry, UserProfile } from '../types';
import { sendJournalChat } from '../services/api';
import { CognitiveAnalysisCard } from './CognitiveAnalysisCard';
import { Send, Sparkles, RefreshCcw, Lock, ArrowRight, CornerDownLeft, Bot, User, CheckCircle } from 'lucide-react';

interface Props {
  user: UserProfile;
  onEntrySaved: (entry: JournalEntry) => void;
}

const PROMPT_STARTERS = [
  "I've been feeling overwhelmed by all my pending tasks, and worried I'll fail everyone.",
  "I have a big career transition ahead, but I keep doubting if I'm qualified enough.",
  "I had a difficult interaction with a teammate and I can't stop replaying what I did wrong.",
  "I'm brainstorming how to build a daily mindfulness routine without falling off track.",
];

export const JournalChat: React.FC<Props> = ({ user, onEntrySaved }) => {
  const [messages, setMessages] = useState<JournalMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latestTenantPath, setLatestTenantPath] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputMessage;
    if (!textToSend.trim() || loading) return;

    setError(null);
    const userMsg: JournalMessage = {
      role: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputMessage('');
    setLoading(true);

    try {
      // Format history array for the backend multi-turn endpoint
      const history = messages.map(m => ({
        role: m.role,
        text: m.text,
      }));

      const res = await sendJournalChat(user.token, userMsg.text, history);

      const modelMsg: JournalMessage = {
        role: 'model',
        text: res.reply,
        summary: res.summary,
        cognitiveAnalysis: res.cognitiveAnalysis,
        timestamp: res.createdAt,
      };

      setMessages([...newMessages, modelMsg]);
      setLatestTenantPath(res.tenantPath);
      onEntrySaved(res.entry);
    } catch (err: any) {
      setError(err.message || 'An error occurred while communicating with Gemini 3.5 Flash.');
    } finally {
      setLoading(false);
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewSession = () => {
    setMessages([]);
    setInputMessage('');
    setError(null);
    setLatestTenantPath(null);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto space-y-6">
      {/* Session Controls & Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-[#0A0A0A] rounded-xl border border-[#1A1A1A] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#555555] uppercase tracking-widest font-bold">Active Session</span>
              <span className="text-[10px] font-mono text-[#888888]">
                /journals/{user.uid}/entries
              </span>
            </div>
            <p className="text-[11px] text-[#666666]">
              Multi-turn cognitive reflection · Enforced CBT distortion mapping &amp; tenant isolation
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={handleNewSession}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium tracking-wide uppercase text-[#888888] hover:text-[#E0E0E0] bg-[#141414] hover:bg-[#1A1A1A] border border-[#222222] rounded transition-colors"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              <span>New Session</span>
            </button>
          )}
        </div>
      </div>

      {/* Messages Thread Container */}
      <div className="flex-1 space-y-6 min-h-[350px]">
        {messages.length === 0 ? (
          /* Empty state with prompt starters */
          <div className="bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-6 sm:p-8 text-center space-y-6 shadow-xs">
            <div className="w-10 h-10 rounded bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] text-white mx-auto flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.3)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-lg sm:text-xl font-bold tracking-[0.1em] uppercase text-[#E0E0E0]">
                Record a Thought
              </h3>
              <p className="text-xs text-[#888888] leading-relaxed">
                Reflect openly or brainstorm through challenges. Gemini 3.5 Flash detects cognitive distortions and constructs CBT reframing perspectives in real-time.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left max-w-2xl mx-auto">
              {PROMPT_STARTERS.map((starter, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(starter)}
                  className="group p-3.5 rounded-lg border border-[#222222] bg-[#111111] hover:bg-[#161616] hover:border-[#333333] transition-all text-xs text-[#CCCCCC] font-serif italic leading-relaxed flex items-start justify-between gap-2"
                >
                  <span>"{starter}"</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#555555] group-hover:text-[#F27D26] shrink-0 mt-0.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className="space-y-3">
              {msg.role === 'user' ? (
                /* User Thought Card */
                <div className="flex flex-col items-end gap-1.5">
                  <div className="max-w-2xl bg-[#1A1A1A] border border-[#2A2A2A] text-[#E0E0E0] rounded-xl rounded-tr-none p-4 shadow-md">
                    <p className="text-[13px] sm:text-sm leading-relaxed font-serif italic text-[#EAEAEA] whitespace-pre-wrap">
                      {msg.text}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[9px] text-[#555555] uppercase font-mono tracking-tighter">
                    <span>{user.displayName}</span>
                    <span>·</span>
                    <span>{msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                  </div>
                </div>
              ) : (
                /* Gemini 2.5 Flash Response & Cognitive Analysis */
                <div className="flex flex-col items-start gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B5CF6]">
                      Gemini Analyst
                    </span>
                    <span className="text-[9px] text-[#555555] font-mono">
                      {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>

                  <div className="max-w-2xl w-full space-y-4">
                    {/* Conversational Reply */}
                    <div className="bg-[#111111] border border-[#222222] rounded-xl rounded-tl-none p-5 shadow-xs">
                      <p className="text-sm text-[#CCCCCC] leading-relaxed whitespace-pre-wrap font-normal">
                        {msg.text}
                      </p>
                    </div>

                    {/* Isolated Cognitive Analysis & Sentiment Card */}
                    {msg.cognitiveAnalysis && (
                      <CognitiveAnalysisCard
                        analysis={msg.cognitiveAnalysis}
                        summary={msg.summary}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex flex-col items-start gap-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] animate-pulse"></div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B5CF6]">
                Gemini Analyst
              </span>
            </div>
            <div className="bg-[#111111] border border-[#222222] rounded-xl p-4 shadow-xs flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F27D26] animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#F27D26] animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#F27D26] animate-bounce [animation-delay:0.4s]"></span>
              </div>
              <span className="text-xs text-[#777777] font-medium">
                Formulating reflection &amp; evaluating cognitive distortion patterns...
              </span>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-rose-950/30 border border-rose-800/50 rounded-xl text-xs text-rose-300 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-rose-400 hover:text-rose-200 font-semibold ml-2 uppercase text-[10px] tracking-wider"
            >
              Dismiss
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="sticky bottom-4 bg-[#050505] pt-2">
        <div className="bg-[#111111] border border-[#222222] focus-within:border-[#F27D26] rounded-xl p-3.5 shadow-xl transition-all">
          <textarea
            ref={textareaRef}
            rows={3}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              messages.length === 0
                ? "Record a new thought or reflection (e.g. 'I feel like I am failing because...')"
                : "Continue exploring, brainstorming, or replying to Gemini..."
            }
            className="w-full text-sm text-[#E0E0E0] placeholder:text-[#555555] bg-transparent border-0 resize-none focus:outline-none focus:ring-0"
          />

          <div className="flex items-center justify-between pt-2.5 border-t border-[#1C1C1C] mt-1">
            <div className="flex items-center gap-2 text-[10px] text-[#555555] font-mono">
              <Lock className="w-3 h-3 text-[#555555]" />
              <span className="hidden sm:inline">ZERO-TRUST AUTH</span>
              {latestTenantPath && (
                <span className="inline-flex items-center gap-1 text-emerald-400">
                  <CheckCircle className="w-3 h-3 text-emerald-500" /> Stored: {latestTenantPath}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] text-[#555555] font-mono hidden sm:inline">Enter ↵</span>
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || loading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#E0E0E0] hover:bg-white disabled:bg-[#222222] text-black disabled:text-[#555555] rounded text-xs font-bold uppercase tracking-wider shadow-xs transition-all disabled:cursor-not-allowed"
              >
                <span>Record</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
