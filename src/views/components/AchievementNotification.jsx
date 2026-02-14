import React from 'react';

export default function AchievementNotification({ achievement }) {
  if (!achievement) return null;

  return (
    <div className="fixed top-4 sm:top-20 left-2 right-2 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-[150] animate-bounce-in">
      <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 px-4 sm:px-8 py-4 sm:py-5 rounded-2xl shadow-2xl shadow-amber-500/50 flex items-center gap-3 sm:gap-4 border-2 border-yellow-300 max-w-md mx-auto">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/30 rounded-xl flex items-center justify-center text-2xl sm:text-4xl animate-bounce shadow-lg shrink-0">
          {achievement.icon}
        </div>
        <div className="min-w-0">
          <div className="text-xs sm:text-sm font-bold text-yellow-100 uppercase tracking-wide flex items-center gap-1 sm:gap-2">
            <span className="text-base sm:text-xl">🎉</span> Achievement! <span className="text-base sm:text-xl">🎉</span>
          </div>
          <div className="text-lg sm:text-2xl font-black text-white drop-shadow-lg truncate">{achievement.name}</div>
          <div className="text-xs sm:text-sm text-yellow-100 font-bold">+{achievement.xp} XP</div>
          <div className="text-[10px] sm:text-xs text-yellow-200 mt-1 line-clamp-2">{achievement.description}</div>
        </div>
      </div>
    </div>
  );
}
