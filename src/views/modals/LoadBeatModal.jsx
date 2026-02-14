import React, { useState } from 'react';
import { Icons } from '../components/Icons';

export default function LoadBeatModal({ isOpen, onClose, savedBeats, onLoad, onDelete, onToggleFavorite }) {
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl animate-bounce-in max-h-[80vh] flex flex-col">
        <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-4 flex items-center gap-3">
          <span className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center text-white">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 002-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
          </span>
          Load a Beat
        </h2>

        {/* Favorites Filter Toggle */}
        {savedBeats.length > 0 && (
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200">
            <button
              onClick={() => setShowFavoritesOnly(false)}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${!showFavoritesOnly ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
            >
              All ({savedBeats.length})
            </button>
            <button
              onClick={() => setShowFavoritesOnly(true)}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-1 ${showFavoritesOnly ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
            >
              ⭐ Favorites ({savedBeats.filter(b => b.favorite).length})
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-3 mb-4">
          {savedBeats.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <div className="text-5xl mb-4">🎵</div>
              <p className="font-bold">No saved beats yet!</p>
              <p className="text-sm">Create a beat and save it to see it here.</p>
            </div>
          ) : (
            (() => {
              const beatsToShow = showFavoritesOnly ? savedBeats.filter(b => b.favorite) : savedBeats;
              if (beatsToShow.length === 0) {
                return (
                  <div className="text-center py-12 text-slate-400">
                    <div className="text-5xl mb-4">⭐</div>
                    <p className="font-bold">No favorites yet!</p>
                    <p className="text-sm">Tap the star icon on a beat to add it to favorites.</p>
                  </div>
                );
              }
              return beatsToShow.map((beat) => (
                <div key={beat.id} className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-2xl transition-all group ${beat.favorite ? 'bg-amber-50 border-2 border-amber-200' : 'bg-slate-50 hover:bg-slate-100'}`}>
                  {/* Favorite Toggle */}
                  <button
                    onClick={() => onToggleFavorite(beat.id)}
                    className={`p-2 rounded-xl transition-all ${beat.favorite ? 'text-amber-500 hover:text-amber-600' : 'text-slate-300 hover:text-amber-400'}`}
                    title={beat.favorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    {beat.favorite ? '⭐' : '☆'}
                  </button>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center text-white text-lg sm:text-xl shrink-0">🎶</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-800 truncate">{beat.name}</div>
                    <div className="text-xs text-slate-400">{beat.date} • {beat.tempo} BPM • {beat.activeInstrumentIds.length} tracks</div>
                  </div>
                  <button
                    onClick={() => onLoad(beat)}
                    className="px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-400 to-indigo-500 text-white rounded-xl font-bold hover:scale-105 transition-all shadow-md text-sm"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => onDelete(beat)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title="Delete beat"
                  >
                    <Icons.Trash />
                  </button>
                </div>
              ));
            })()
          )}
        </div>
        <button
          onClick={() => { onClose(); setShowFavoritesOnly(false); }}
          className="w-full p-4 bg-slate-100 hover:bg-slate-200 rounded-2xl font-bold text-slate-600 transition-all"
        >
          Close
        </button>
      </div>
    </div>
  );
}
