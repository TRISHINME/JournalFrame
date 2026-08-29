import React from 'react';
import { UserProfile } from '../types';
import { ShieldCheck, LogIn, LogOut, User, Sparkles, BookOpen, Layers } from 'lucide-react';

interface Props {
  user: UserProfile | null;
  onSignIn: () => void;
  onSignOut: () => void;
  onOpenAudit: () => void;
  activeTab: 'chat' | 'history';
  onTabChange: (tab: 'chat' | 'history') => void;
  entriesCount: number;
}

export const Header: React.FC<Props> = ({
  user,
  onSignIn,
  onSignOut,
  onOpenAudit,
  activeTab,
  onTabChange,
  entriesCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#1A1A1A] py-3 px-4 sm:px-8 transition-all">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Left Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center shadow-[0_0_12px_rgba(139,92,246,0.3)]">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-[#E0E0E0]">
                Gemini Journal
              </h1>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#141414] border border-[#222222]">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></span>
                <span className="text-[10px] font-mono text-[#888888] uppercase">
                  gemini-3.5-flash
                </span>
              </div>
            </div>
            <p className="text-[11px] text-[#555555] hidden sm:block">
              Cognitive Bias & Sentiment Analyzer · Tenant-Isolated Firestore
            </p>
          </div>
        </div>

        {/* Middle Navigation Tabs */}
        <div className="flex items-center bg-[#111111] p-1 rounded-lg border border-[#222222] self-start md:self-auto">
          <button
            onClick={() => onTabChange('chat')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-medium tracking-wide uppercase transition-all ${
              activeTab === 'chat'
                ? 'bg-[#222222] text-[#E0E0E0] shadow-xs'
                : 'text-[#666666] hover:text-[#CCCCCC]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Reflect & Chat</span>
          </button>
          <button
            onClick={() => onTabChange('history')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-medium tracking-wide uppercase transition-all ${
              activeTab === 'history'
                ? 'bg-[#222222] text-[#E0E0E0] shadow-xs'
                : 'text-[#666666] hover:text-[#CCCCCC]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Journal Vault</span>
            {entriesCount > 0 && (
              <span className="px-1.5 py-0.2 bg-[#1A1A1A] border border-[#2A2A2A] rounded text-[10px] text-[#888888] font-mono">
                {entriesCount}
              </span>
            )}
          </button>
        </div>

        {/* Right Security & User Actions */}
        <div className="flex items-center gap-2.5 self-end md:self-auto">
          {/* Security Audit Button */}
          <button
            onClick={onOpenAudit}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#111111] hover:bg-[#161616] text-[#888888] hover:text-emerald-400 border border-[#222222] hover:border-emerald-500/30 rounded text-xs font-medium tracking-wider uppercase transition-colors"
            title="Zero-Trust Architecture & Directives Audit"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span className="hidden sm:inline">Security Directives</span>
          </button>

          {/* User Profile / Auth State */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-[#1A1A1A]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#222222] border border-[#333333] flex items-center justify-center text-[10px] font-mono text-[#CCCCCC] overflow-hidden">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                  ) : (
                    user.displayName ? user.displayName.slice(0, 2).toUpperCase() : <User className="w-3.5 h-3.5 text-[#888]" />
                  )}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-medium text-[#CCCCCC] truncate max-w-[120px]">{user.displayName}</div>
                  <div className="text-[9px] text-[#555555] font-mono truncate max-w-[120px]">
                    /journals/{user.uid.slice(0, 6)}...
                  </div>
                </div>
              </div>
              <button
                onClick={onSignOut}
                className="p-1.5 text-[#555555] hover:text-[#CCCCCC] rounded hover:bg-[#1A1A1A] transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onSignIn}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#E0E0E0] hover:bg-white text-black rounded text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
