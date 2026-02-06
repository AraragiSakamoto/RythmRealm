import React from 'react';

export default function DeleteConfirmModal({ beat, onConfirm, onCancel }) {
  if (!beat) return null;

  return (
    <div className="absolute inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-bounce-in text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🗑️</span>
        </div>
        <h3 className="text-xl font-black text-slate-800 mb-2">Delete Beat?</h3>
        <p className="text-slate-500 mb-1">Are you sure you want to delete</p>
        <p className="text-lg font-bold text-slate-800 mb-4">"{beat.name}"</p>
        <p className="text-xs text-red-500 mb-6">⚠️ This action cannot be undone!</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 p-3 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-600 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(beat)}
            className="flex-1 p-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 rounded-xl font-bold text-white transition-all shadow-lg"
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
}
