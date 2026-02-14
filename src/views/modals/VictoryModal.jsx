import React from 'react';
import { Icons } from '../components/Icons';
import Button from '../components/Button';

export default function VictoryModal({ isOpen, onClose, score, user, onLogin, onHome, onSaveTutorialScore }) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white border-8 border-yellow-400 rounded-[3rem] p-12 max-w-md w-full text-center shadow-2xl transform scale-100">
        <div className="text-yellow-400 mx-auto mb-6 flex justify-center drop-shadow-lg animate-bounce"><Icons.Trophy /></div>
        <h2 className="text-5xl font-black text-slate-800 mb-2 tracking-tight">YOU DID IT!</h2>
        <p className="text-slate-500 mb-4 font-bold text-xl">
          {score >= 90 ? "PERFECT RHYTHM! 🏆" : score >= 70 ? "GREAT BEAT! 🎵" : "GOOD START! 👍"}
        </p>
        <div className="flex justify-center gap-3 mb-8 text-yellow-400">
          <Icons.Star />
          {score >= 70 && <Icons.Star />}
          {score >= 90 && <Icons.Star />}
        </div>
        
        {/* Score Details for logged in users */}
        {user && (
          <div className="mb-6 p-4 bg-slate-100 rounded-2xl text-left">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-600 font-bold">Score:</span>
              <span className="text-2xl font-black text-purple-600">+{Math.round(score * 10)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-600 font-bold">Accuracy:</span>
              <span className="text-lg font-bold text-green-600">{Math.round(score)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 font-bold">XP Earned:</span>
              <span className="text-lg font-bold text-amber-600">+{Math.round(score)} XP</span>
            </div>
          </div>
        )}

        {!user && (
          <div className="mb-6 p-4 bg-purple-100 rounded-2xl">
            <p className="text-purple-700 font-bold text-sm mb-2">🔐 Login to save your scores!</p>
            <button
              onClick={() => { onClose(); onLogin(); }}
              className="px-4 py-2 bg-purple-500 text-white rounded-xl font-bold text-sm hover:bg-purple-400 transition-all"
            >
              Login Now
            </button>
          </div>
        )}

        <Button onClick={() => {
          onSaveTutorialScore?.();
          onClose();
          onHome?.();
        }} size="lg" className="w-full">Back to Menu</Button>
      </div>
    </div>
  );
}
