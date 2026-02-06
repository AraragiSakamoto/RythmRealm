import React from 'react';
import { Icons } from '../components/Icons';

export default function AuthModal({
  isOpen,
  onClose,
  mode,
  setMode,
  email,
  setEmail,
  password,
  setPassword,
  username,
  setUsername,
  error,
  loading,
  onLogin,
  onRegister
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-purple-500/50 rounded-3xl w-full max-w-md shadow-2xl shadow-purple-500/20 animate-bounce-in" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <span className="text-3xl">
              {mode === 'login' ? '🔐' : mode === 'verification' ? '📧' : '✨'}
            </span>
            {mode === 'login' ? 'Welcome Back!' : mode === 'verification' ? 'Check Email' : 'Join Rhythm Realm'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-xl transition-all text-slate-400 hover:text-white">
            <Icons.Close />
          </button>
        </div>

        {mode === 'verification' ? (
          <div className="p-8 text-center animate-fade-in">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-500/50 animate-pulse-slow">
              <span className="text-4xl">📩</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Verification Link Sent!</h3>
            <p className="text-slate-400 mb-6 font-medium">
              We sent a link to <span className="text-green-400 font-bold">{email}</span>.
              <br /><span className="text-sm opacity-80 mt-2 block">Click it to activate your account. Check Spam if needed!</span>
            </p>
            <button
              onClick={onClose}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 rounded-xl font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95"
            >
              Got it!
            </button>
            <button
              onClick={() => setMode('login')}
              className="mt-4 text-slate-500 hover:text-slate-300 text-sm font-bold"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={mode === 'login' ? onLogin : onRegister} className="p-6 space-y-4" autoComplete="off">
            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm">
                ⚠️ {error}
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  placeholder="Your display name"
                  className="w-full p-4 bg-slate-800 border-2 border-slate-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-all"
                  required
                  minLength={3}
                  autoComplete="off"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                placeholder="your@email.com"
                className="w-full p-4 bg-slate-800 border-2 border-slate-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-all"
                required
                autoComplete="off"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                placeholder="••••••••"
                className="w-full p-4 bg-slate-800 border-2 border-slate-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-all"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full p-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 rounded-xl font-bold text-white text-lg transition-all shadow-lg shadow-purple-500/30 disabled:opacity-50"
            >
              {loading ? '⏳ Please wait...' : (mode === 'login' ? '🚀 Login' : '🎉 Create Account')}
            </button>

            <div className="text-center text-slate-400 text-sm">
              {mode === 'login' ? (
                <>Don't have an account? <button type="button" onClick={() => { setMode('register'); }} className="text-purple-400 hover:text-purple-300 font-bold">Sign up</button></>
              ) : (
                <>Already have an account? <button type="button" onClick={() => { setMode('login'); }} className="text-purple-400 hover:text-purple-300 font-bold">Login</button></>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
