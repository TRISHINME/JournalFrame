import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { JournalEntry } from './types';
import { Header } from './components/Header';
import { JournalChat } from './components/JournalChat';
import { EntriesHistory } from './components/EntriesHistory';
import { SecurityAuditModal } from './components/SecurityAuditModal';
import { LoginModal } from './components/LoginModal';
import { fetchEntries } from './services/api';
import { ShieldCheck, Lock, ArrowRight, Loader2 } from 'lucide-react';

function JournalAppContent() {
  const { userProfile, signOutUser, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<'chat' | 'history'>('chat');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Fetch entries whenever userProfile / token changes
  useEffect(() => {
    if (userProfile?.token) {
      loadEntries();
    } else {
      setEntries([]);
    }
  }, [userProfile?.token, userProfile?.uid]);

  const loadEntries = async () => {
    if (!userProfile?.token) return;
    setLoadingEntries(true);
    try {
      const data = await fetchEntries(userProfile.token);
      setEntries(data);
    } catch (err) {
      console.warn('Could not fetch historical entries:', err);
    } finally {
      setLoadingEntries(false);
    }
  };

  const handleEntrySaved = (newEntry: JournalEntry) => {
    setEntries((prev) => [newEntry, ...prev.filter((e) => e.id !== newEntry.id)]);
  };

  const handleDeleteSuccess = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#E0E0E0] flex flex-col antialiased selection:bg-[#F27D26]/20 selection:text-[#F27D26]">
      {/* Top Header */}
      <Header
        user={userProfile}
        onSignIn={() => setIsLoginOpen(true)}
        onSignOut={signOutUser}
        onOpenAudit={() => setIsAuditOpen(true)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        entriesCount={entries.length}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 md:p-8">
        {authLoading ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#F27D26]" />
            <p className="text-xs font-mono text-[#666666] uppercase tracking-wider">
              Initializing Zero-Trust Auth...
            </p>
          </div>
        ) : !userProfile ? (
          /* Unauthenticated Landing / Call to Action */
          <div className="max-w-xl mx-auto my-12 text-center bg-[#0A0A0A] border border-[#1A1A1A] rounded-3xl p-8 sm:p-12 shadow-xl space-y-6 animate-fade-in">
            <div className="w-12 h-12 bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] text-white rounded-xl mx-auto flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)]">
              <Lock className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold tracking-[0.1em] uppercase text-[#E0E0E0]">
                Personal Gemini Journal
              </h2>
              <p className="text-xs sm:text-sm text-[#888888] leading-relaxed">
                Experience zero-trust multi-turn brainstorming and cognitive distortion analysis powered by Gemini 3.5 Flash. All reflections are tenant-isolated in Cloud Firestore.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#111111] border border-[#222222] text-left text-xs space-y-2 text-[#888888] font-mono">
              <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase text-[10px] tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Security Enforcements Active</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-[#777777] text-[11px]">
                <li>Firebase Authentication with Google &amp; Email Credentials</li>
                <li>Server ID Token Verification via Firebase Admin SDK</li>
                <li>Path isolation: /journals/{'{uid}'}/entries/{'{entryId}'}</li>
                <li>GCP Secret Manager runtime key injection (gemini-3.5-flash)</li>
              </ul>
            </div>

            <button
              onClick={() => setIsLoginOpen(true)}
              className="w-full py-3.5 px-6 bg-[#E0E0E0] hover:bg-white text-black rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer"
            >
              <span>Authenticate &amp; Open Journal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Authenticated Experience */
          <div>
            {activeTab === 'chat' ? (
              <JournalChat user={userProfile} onEntrySaved={handleEntrySaved} />
            ) : (
              <EntriesHistory
                user={userProfile}
                entries={entries}
                onDeleteSuccess={handleDeleteSuccess}
                loading={loadingEntries}
                onRefresh={loadEntries}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1A1A1A] py-4 px-6 text-center text-xs text-[#555555] bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-mono text-[10px] text-[#666666]">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_#22c55e]"></span>
            <span className="uppercase">Zero-Trust Architecture</span>
            <span className="text-[#333333]">•</span>
            <span>MODEL: GEMINI-3.5-FLASH</span>
          </div>
          <div className="text-[10px] font-mono text-[#555555]">
            TENANT ISOLATED: /journals/{userProfile ? userProfile.uid : '{uid}'}/entries
          </div>
        </div>
      </footer>

      {/* Security Audit Modal */}
      <SecurityAuditModal
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
        uid={userProfile?.uid || 'unauthenticated'}
      />

      {/* Firebase Authentication Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <JournalAppContent />
    </AuthProvider>
  );
}
