import React from 'react';

export default function SaveBeatModal({ isOpen, onClose, beatName, setBeatName, onSave }) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-bounce-in">
        <h2 className="text-2xl font-black text-slate-800 mb-4 flex items-center gap-3">
          <span className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center text-white">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
          </span>
          Save Your Beat
        </h2>
        <input
          type="text"
          placeholder="Enter beat name..."
          value={beatName}
          onChange={(e) => setBeatName(e.target.value)}
          className="w-full p-4 border-2 border-slate-200 rounded-2xl text-lg font-bold text-slate-700 focus:outline-none focus:border-green-400 mb-4"
          autoFocus
        />
        <div className="flex gap-3">
          <button
            onClick={() => { onClose(); setBeatName(''); }}
            className="flex-1 p-4 bg-slate-100 hover:bg-slate-200 rounded-2xl font-bold text-slate-600 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(beatName)}
            className="flex-1 p-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl font-bold text-white hover:scale-[1.02] transition-all shadow-lg"
          >
            💾 Save Beat
          </button>
        </div>
      </div>
    </div>
  );
}
