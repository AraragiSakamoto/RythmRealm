import React from 'react';
import { Icons } from '../components/Icons';
import { GAME_LEVELS } from '../../utils/constants';

export default function ProfileModal({ isOpen, onClose, user, userProfile, levelProgress, onLogout, onLogin }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-purple-500/50 rounded-3xl w-full max-w-lg shadow-2xl animate-bounce-in max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <span className="text-3xl">👤</span> My Profile
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-xl transition-all text-slate-400 hover:text-white">
            <Icons.Close />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {user && userProfile ? (
            <>
              {/* Profile Header */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-3xl font-black text-white">
                  {(userProfile.username || 'P')[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">{userProfile.username}</h3>
                  <p className="text-purple-400">{userProfile.rank_title || 'Beginner'}</p>
                  <p className="text-slate-500 text-sm">{userProfile.email}</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-800 rounded-xl p-4 text-center">
                  <div className="text-3xl font-black text-purple-400">{userProfile.level || 1}</div>
                  <div className="text-xs text-slate-500 uppercase">Level</div>
                </div>
                <div className="bg-slate-800 rounded-xl p-4 text-center">
                  <div className="text-3xl font-black text-amber-400">{userProfile.total_score?.toLocaleString() || 0}</div>
                  <div className="text-xs text-slate-500 uppercase">Total XP</div>
                </div>
                <div className="bg-slate-800 rounded-xl p-4 text-center">
                  <div className="text-3xl font-black text-green-400">{userProfile.total_beats_created || 0}</div>
                  <div className="text-xs text-slate-500 uppercase">Beats Created</div>
                </div>
                <div className="bg-slate-800 rounded-xl p-4 text-center">
                  <div className="text-3xl font-black text-cyan-400">{Object.values(levelProgress || {}).filter(p => p?.completed).length}</div>
                  <div className="text-xs text-slate-500 uppercase">Levels Done</div>
                </div>
              </div>

              {/* XP Progress */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">XP to Next Level</span>
                  <span className="text-white font-bold">{(userProfile.experience_points || 0) % 1000} / 1000</span>
                </div>
                <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    style={{ width: `${((userProfile.experience_points || 0) % 1000) / 10}%` }}
                  ></div>
                </div>
              </div>

              {/* Streak */}
              <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl p-4 border border-orange-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🔥</span>
                    <span className="text-white font-bold">Current Streak</span>
                  </div>
                  <div className="text-2xl font-black text-orange-400">{userProfile.current_streak || 0} days</div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={() => onLogout(true)}
                className="w-full p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 font-bold hover:bg-red-500/30 transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">👤</div>
              <h3 className="text-xl font-bold text-white mb-2">Not Logged In</h3>
              <p className="text-slate-400 mb-6">Login to save your progress and compete on the leaderboard!</p>
              <button
                onClick={() => { onClose(); onLogin(); }}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold text-white"
              >
                Login / Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
