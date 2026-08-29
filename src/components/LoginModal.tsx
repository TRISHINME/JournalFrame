import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User as UserIcon, AlertCircle, Loader2, Sparkles, ArrowRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, signInAsGuestDemo, loading, error, clearError } = useAuth();
  
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const getFriendlyErrorMessage = (err: string | null): string | null => {
    if (!err) return null;
    if (err.includes('auth/api-key-not-valid') || err.includes('api-key-not-valid') || err.includes('API key')) {
      return 'Firebase API Key is missing or invalid. Connected via session fallback.';
    }
    if (err.includes('auth/invalid-credential') || err.includes('auth/wrong-password')) {
      return 'Incorrect email or password. Please verify your credentials.';
    }
    if (err.includes('auth/user-not-found')) {
      return 'No account found with this email. Please check the spelling or sign up.';
    }
    if (err.includes('auth/email-already-in-use')) {
      return 'An account with this email already exists. Please switch to Sign In.';
    }
    if (err.includes('auth/weak-password')) {
      return 'Password is too weak. Please use at least 6 characters.';
    }
    if (err.includes('auth/invalid-email')) {
      return 'Please enter a valid email address.';
    }
    if (err.includes('auth/popup-closed-by-user')) {
      return 'Google sign-in window was closed before finishing.';
    }
    if (err.includes('auth/popup-blocked')) {
      return 'Sign-in popup was blocked by browser. Please allow popups or use email sign in.';
    }
    if (err.includes('auth/too-many-requests')) {
      return 'Access temporarily disabled due to many failed attempts. Try again in a few minutes.';
    }
    return err;
  };

  const handleGoogleSignIn = async () => {
    setLocalError(null);
    clearError();
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      // If fallback already handled it, don't set error
      if (err?.code !== 'auth/api-key-not-valid' && !err?.message?.includes('api-key-not-valid')) {
        setLocalError(getFriendlyErrorMessage(err.message || 'Google authentication failed'));
      } else {
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!email.trim() || !password.trim()) {
      setLocalError('Please fill in both email and password.');
      return;
    }

    if (mode === 'signup' && password.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, displayName);
      }
      onClose();
    } catch (err: any) {
      if (err?.code !== 'auth/api-key-not-valid' && !err?.message?.includes('api-key-not-valid')) {
        setLocalError(getFriendlyErrorMessage(err.message || 'Authentication failed'));
      } else {
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoSignIn = () => {
    signInAsGuestDemo('Verified Journaler');
    onClose();
  };

  const displayError = localError || getFriendlyErrorMessage(error);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0A0A0A] rounded-2xl border border-[#222222] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1A1A1A] bg-[#0E0E0E]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center shadow-[0_0_10px_rgba(139,92,246,0.3)]">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-xs font-bold tracking-[0.15em] uppercase text-[#E0E0E0]">
                {mode === 'signin' ? 'Authenticate Journal' : 'Create Vault Account'}
              </h2>
              <p className="text-[10px] text-[#666666] font-mono">
                Zero-Trust Firebase Identity
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#666666] hover:text-[#CCCCCC] rounded hover:bg-[#1A1A1A] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Auth Mode Toggle Tabs */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 p-1 bg-[#111111] rounded-lg border border-[#1A1A1A]">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setLocalError(null);
                clearError();
              }}
              className={`py-1.5 text-xs font-semibold uppercase tracking-wider rounded transition-all ${
                mode === 'signin'
                  ? 'bg-[#222222] text-[#E0E0E0] shadow-xs'
                  : 'text-[#666666] hover:text-[#CCCCCC]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setLocalError(null);
                clearError();
              }}
              className={`py-1.5 text-xs font-semibold uppercase tracking-wider rounded transition-all ${
                mode === 'signup'
                  ? 'bg-[#222222] text-[#E0E0E0] shadow-xs'
                  : 'text-[#666666] hover:text-[#CCCCCC]'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting || loading}
            className="w-full py-2.5 px-4 bg-[#141414] hover:bg-[#1C1C1C] border border-[#2A2A2A] hover:border-[#3A3A3A] text-[#E0E0E0] rounded-xl text-xs font-semibold flex items-center justify-center gap-3 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#888888]" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.97 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            )}
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-[1px] bg-[#1A1A1A]"></div>
            <span className="text-[10px] uppercase font-mono text-[#555555]">or email credentials</span>
            <div className="flex-1 h-[1px] bg-[#1A1A1A]"></div>
          </div>

          {/* Error Banner */}
          {displayError && (
            <div className="p-3 bg-red-950/30 border border-red-500/30 rounded-lg flex items-start gap-2.5 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="leading-tight">{displayError}</div>
            </div>
          )}

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'signup' && (
              <div>
                <label className="block text-[10px] uppercase font-mono text-[#777777] mb-1">
                  Full Name / Journal Alias
                </label>
                <div className="relative">
                  <UserIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#555555]" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full bg-[#111111] border border-[#222222] focus:border-[#F27D26] rounded-lg pl-9 pr-3 py-2 text-xs text-[#E0E0E0] placeholder-[#444444] outline-hidden transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] uppercase font-mono text-[#777777] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#555555]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#111111] border border-[#222222] focus:border-[#F27D26] rounded-lg pl-9 pr-3 py-2 text-xs text-[#E0E0E0] placeholder-[#444444] outline-hidden transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono text-[#777777] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#555555]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#111111] border border-[#222222] focus:border-[#F27D26] rounded-lg pl-9 pr-3 py-2 text-xs text-[#E0E0E0] placeholder-[#444444] outline-hidden transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full py-2.5 px-4 bg-[#E0E0E0] hover:bg-white text-black rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:opacity-50 mt-4"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin text-black" />
              ) : (
                <>
                  <span>{mode === 'signin' ? 'Sign In' : 'Create Vault Account'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick Sandbox / Sandbox Demo Login */}
          <div className="pt-2 border-t border-[#1A1A1A] text-center">
            <button
              type="button"
              onClick={handleDemoSignIn}
              className="text-[11px] text-[#666666] hover:text-[#F27D26] font-mono transition-colors"
            >
              Quick Test: Open with Sandbox Demo Profile
            </button>
          </div>
        </div>

        {/* Footer Security Note */}
        <div className="px-6 py-2.5 bg-[#0E0E0E] border-t border-[#1A1A1A] text-center">
          <p className="text-[10px] text-[#555555] font-mono">
            Tenant isolation bound strictly to authenticated UID
          </p>
        </div>
      </div>
    </div>
  );
};
