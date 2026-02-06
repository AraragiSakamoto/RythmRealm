import React from 'react';
import { PixelMusicBackground } from './components/PixelMusicBackground';
import { Icons } from './components/Icons';
import AchievementNotification from './components/AchievementNotification';
import ProfileModal from './modals/ProfileModal';
import { getUnlockedLevels } from '../utils/gameLogic';

export default function LevelSelector({
    user,
    userProfile,
    levelProgress,
    currentTheme,
    achievementNotification,
    onSetView,
    onSelectLevel,
    onLogout,
    showProfileModal,
    setShowProfileModal
}) {
    const unlockedLevels = getUnlockedLevels(levelProgress);

    return (
        <div className="h-screen w-full text-white flex flex-col overflow-hidden font-sans relative">
            <PixelMusicBackground theme={currentTheme} />

            <AchievementNotification achievement={achievementNotification} />

            <div className="relative z-10 px-6 py-6 flex items-center justify-between border-b border-white/10 glass-panel">
                <button onClick={() => onSetView('modes')} className="glass-button p-3 rounded-2xl shadow-lg active:scale-95">
                    <Icons.ChevronLeft />
                </button>
                <h2 className="text-3xl font-display font-black bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-transparent neon-text">SELECT LEVEL</h2>
                <button
                    onClick={() => setShowProfileModal(true)}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center text-xl font-bold shadow-lg hover:scale-105 transition-transform border border-white/20"
                >
                    {(userProfile?.username || 'P')[0].toUpperCase()}
                </button>
            </div>

            <div className="relative z-10 flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {unlockedLevels.map((level) => (
                    <button
                        key={level.id}
                        disabled={!level.unlocked}
                        onClick={() => onSelectLevel(level)}
                        className={`
                  relative p-6 rounded-3xl text-left transition-all duration-300 group overflow-hidden border-b-8 active:border-b-0 active:translate-y-2
                  ${level.unlocked
                            ? `glass-panel hover:bg-white/5 hover:scale-[1.02] border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_${level.color === 'from-cyan-500 to-blue-600' ? '#06b6d4' : '#8b5cf6'}_0.4]`
                            : 'bg-black/40 grayscale opacity-70 cursor-not-allowed border-white/5'}
                `}
                    >
                        {level.unlocked && (
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${level.color} opacity-20 rounded-bl-full filter blur-xl group-hover:opacity-30 transition-opacity`}></div>
                        )}

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-lg transition-transform group-hover:scale-110 ${level.unlocked ? `bg-gradient-to-br ${level.color}` : 'bg-white/10'}`}>
                                    {level.icon}
                                </div>
                                {level.unlocked && levelProgress && levelProgress[level.id]?.completed && (
                                    <div className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg animate-bounce tracking-wider">
                                        COMPLETED
                                    </div>
                                )}
                            </div>

                            <h3 className="text-2xl font-display font-black mb-1 group-hover:text-neon-cyan transition-colors">{level.name}</h3>
                            <p className="text-sm opacity-60 font-medium mb-4 line-clamp-2">{level.objective}</p>

                            <div className="flex items-center gap-2">
                                <span className={`text-xs px-2 py-1 rounded-lg font-bold ${level.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                                    level.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                        'bg-red-500/20 text-red-400'
                                    }`}>
                                    {level.difficulty.toUpperCase()}
                                </span>
                                {!level.unlocked && <span className="text-xs text-slate-500 font-bold">🔒 LOCKED</span>}
                                {level.unlocked && <span className="text-xs text-neon-purple font-bold">+XP REWARD</span>}
                            </div>
                        </div>
                    </button>
                ))}
            </div>
            
             <ProfileModal
                isOpen={showProfileModal}
                onClose={() => setShowProfileModal(false)}
                user={user}
                userProfile={userProfile}
                levelProgress={levelProgress}
                onLogout={onLogout}
                onLogin={() => { /* Handle logic if needed, usually logged in here */ }}
            />
        </div>
    );
}
