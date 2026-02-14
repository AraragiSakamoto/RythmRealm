import React from 'react';
import { Icons } from '../components/Icons';

export default function AchievementsModal({ isOpen, onClose, allAchievements, loading, userAchievements }) {
  if (!isOpen) return null;

  const unlockedIds = new Set(userAchievements.map(a => a.achievement_id));

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-green-500/50 rounded-3xl w-full max-w-3xl shadow-2xl shadow-green-500/20 animate-bounce-in max-h-[80vh] flex flex-col">
        <div className="p-6 border-b border-slate-700 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-3">
              <span className="text-3xl">🏅</span> Achievements
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              {userAchievements.length} / {allAchievements.length} unlocked
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-xl transition-all text-slate-400 hover:text-white">
            <Icons.Close />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {loading ? (
            <div className="text-center py-12 text-slate-400">
              <div className="text-5xl mb-4 animate-bounce">⏳</div>
              <p>Loading achievements...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {allAchievements.map((achievement) => {
                const isUnlocked = unlockedIds.has(achievement.id);
                return (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-2xl flex items-center gap-4 transition-all ${isUnlocked
                      ? 'bg-gradient-to-br from-slate-800 to-slate-800 border-l-4 border-green-500 hover:bg-slate-750'
                      : 'bg-slate-900/50 border-l-4 border-slate-700 opacity-60 grayscale'
                      }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-3xl shrink-0 ${isUnlocked ? 'bg-slate-700' : 'bg-slate-800'}`}>
                      {achievement.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-white truncate">{achievement.name}</div>
                      <div className="text-xs text-slate-400 line-clamp-2">{achievement.description}</div>
                      {isUnlocked && <div className="text-xs text-green-400 font-bold mt-1">+{achievement.xp} XP</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
