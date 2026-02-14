import React from 'react';

export default function VerificationModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[70] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-900 border-2 border-green-500/50 rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-bounce-in text-center relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>

        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-500/50 animate-pulse-slow">
          <span className="text-4xl text-green-400">📧</span>
        </div>

        <h3 className="text-2xl font-black text-white mb-2">Check Your Email!</h3>
        <p className="text-slate-400 mb-6 leading-relaxed">
          We've sent a verification link to your email.
          <br /><br />
          Please click the link to activate your account and start making beats!
        </p>

        <button
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 rounded-xl font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95"
        >
          OK, I'll Check It!
        </button>
      </div>
    </div>
  );
}
