import React from 'react';
import { PixelMusicBackground } from '../components/PixelMusicBackground';
import { Icons } from '../components/Icons';
import AchievementNotification from '../components/AchievementNotification';
import ProfileModal from './modals/ProfileModal';
import { getUnlockedLevels } from '../../utils/gameLogic';

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

            <div className="relative z-10 px-6 py-6 flex items-center justify-between border-b border-white/10 bg-black/30 backdrop-blur-sm">
                <button onClick={() => onSetView('modes')} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl shadow-lg transition-all active:scale-95">
                    <Icons.ChevronLeft />
                </button>
                <h2 className="text-3xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">SELECT LEVEL</h2>
                <button
                    onClick={() => setShowProfileModal(true)}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl font-black shadow-lg hover:scale-105 transition-transform"
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
                                ? `bg-gradient-to-br from-slate-800 to-slate-900 hover:scale-[1.02] border-${level.color.split('-')[1]}-700 shadow-xl`
                                : 'bg-slate-900/50 grayscale opacity-70 cursor-not-allowed border-slate-800'}
                `}
                    >
                        {level.unlocked && (
                            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${level.color} opacity-20 rounded-bl-full`}></div>
                        )}

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg ${level.unlocked ? `bg-gradient-to-br ${level.color}` : 'bg-slate-800'}`}>
                                    {level.icon}
                                </div>
                                {level.unlocked && levelProgress && levelProgress[level.id]?.completed && (
                                    <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-bounce">
                                        COMPLETED
                                    </div>
                                )}
                            </div>

                            <h3 className="text-2xl font-black mb-1">{level.name}</h3>
                            <p className="text-sm opacity-60 font-medium mb-4">{level.objective}</p>

                            <div className="flex items-center gap-2">
                                <span className={`text-xs px-2 py-1 rounded-lg font-bold ${level.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                                    level.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                        'bg-red-500/20 text-red-400'
                                    }`}>
                                    {level.difficulty.toUpperCase()}
                                </span>
                                {!level.unlocked && <span className="text-xs text-slate-500 font-bold">🔒 LOCKED</span>}
                                {level.unlocked && <span className="text-xs text-purple-400 font-bold">+XP REWARD</span>}
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
