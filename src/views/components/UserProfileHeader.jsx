import React from 'react';
import { Icons } from './Icons';

export default function UserProfileHeader({
  user,
  userProfile,
  onShowLeaderboard,
  onShowAchievements,
  onShowProfile,
  onLogout,
  onLogin
}) {
  return (
    <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
      {user ? (
        <>
          {/* Leaderboard Button */}
          <button
            onClick={onShowLeaderboard}
            className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 rounded-xl shadow-lg transition-all hover:scale-105"
            title="Leaderboard"
          >
            <span className="text-xl">🏆</span>
          </button>

          {/* Achievements Button */}
          <button
            onClick={onShowAchievements}
            className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 rounded-xl shadow-lg transition-all hover:scale-105"
            title="Achievements"
          >
            <span className="text-xl">🏅</span>
          </button>

          {/* User Profile - Clickable to open profile */}
          <button
            onClick={onShowProfile}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-700 hover:bg-slate-700/80 transition-all cursor-pointer"
            title="View Profile"
          >
            <div className="text-right">
              <div className="text-sm font-bold text-white">{userProfile?.username || 'Player'}</div>
              <div className="text-xs text-slate-400">Lvl {userProfile?.level || 1} • {userProfile?.rank_title || 'Beginner'}</div>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-lg font-black text-white">
              {(userProfile?.username || 'P')[0].toUpperCase()}
            </div>
          </button>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="p-3 bg-slate-800/80 hover:bg-red-500/30 rounded-xl text-slate-400 hover:text-red-400 transition-all border border-slate-700 hover:border-red-500/50"
            title="Logout"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
          </button>
        </>
      ) : (
          <button
            onClick={onLogin}
            className="group px-5 py-2.5 rounded-xl font-bold text-white relative overflow-hidden transition-all hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-pink opacity-80 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute inset-[1px] bg-slate-900 rounded-[10px] z-0"></div>
            <div className="relative z-10 flex items-center justify-center gap-2 text-white group-hover:text-neon-cyan transition-colors font-black tracking-wide uppercase text-sm whitespace-nowrap">
              <span>Login / Sign Up</span>
            </div>
          </button>
      )}
    </div>
  );
}
