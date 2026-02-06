import React from 'react';
import { Icons } from '../components/Icons';

export default function LeaderboardModal({ isOpen, onClose, title, data, loading, user, userRank, isLevelMode }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-amber-500/50 rounded-3xl w-full max-w-2xl shadow-2xl shadow-amber-500/20 animate-bounce-in max-h-[80vh] flex flex-col">
        <div className="p-6 border-b border-slate-700 flex items-center justify-between shrink-0">
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <span className="text-3xl">🏆</span> {title}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-xl transition-all text-slate-400 hover:text-white">
            <Icons.Close />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {loading ? (
            <div className="text-center py-12 text-slate-400">
              <div className="text-5xl mb-4 animate-bounce">⏳</div>
              <p>Loading leaderboard...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <div className="text-5xl mb-4">👥</div>
              <p>No scores yet. Be the first!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {data.map((item, index) => {
                const rank = index + 1;
                const isCurrentUser = user && (isLevelMode ? item.user_id === user.id : item.id === user.id);
                // Handle data structure difference between level leaderboard (joins profiles) and global (profiles table directly)
                const profile = isLevelMode ? item.profiles : item;
                const scoreVal = isLevelMode ? item.score : item.total_score;

                const medalEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '';

                return (
                  <div
                    key={isLevelMode ? item.id : item.id}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all ${isCurrentUser
                      ? 'bg-purple-500/30 border-2 border-purple-500'
                      : rank <= 3
                        ? 'bg-amber-500/10 border border-amber-500/30'
                        : 'bg-slate-800/50 border border-slate-700/50'
                      }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg ${rank === 1 ? 'bg-amber-400 text-amber-900' :
                      rank === 2 ? 'bg-slate-300 text-slate-700' :
                        rank === 3 ? 'bg-amber-600 text-amber-100' :
                          'bg-slate-700 text-slate-300'
                      }`}>
                      {medalEmoji || rank}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{profile?.username || 'Unknown'}</span>
                        {isCurrentUser && <span className="text-xs bg-purple-500 px-2 py-0.5 rounded-full text-white">You</span>}
                      </div>
                      <div className="text-xs text-slate-400">
                        {profile?.rank_title || 'Beginner'}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-black text-xl text-white">{scoreVal?.toLocaleString() || 0}</div>
                      <div className="text-xs text-slate-400">
                        {isLevelMode ? `Accuracy: ${item.accuracy || 0}%` : `${item.total_beats_created || 0} beats`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {userRank && userRank > 100 && (
          <div className="p-4 border-t border-slate-700 shrink-0">
            <div className="text-center text-slate-400 text-sm">
              Your rank: <span className="text-purple-400 font-bold">#{userRank}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
