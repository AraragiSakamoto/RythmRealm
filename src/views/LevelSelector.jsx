import React from 'react';
import { PixelMusicBackground } from './components/PixelMusicBackground';
import { Icons } from './components/Icons';
import AchievementNotification from './components/AchievementNotification';
import ProfileModal from './modals/ProfileModal';
import { getUnlockedLevels } from '../utils/gameLogic';

const ScenePreview = ({ renderScene, tempo = 100 }) => {
    const [pulse, setPulse] = React.useState(0);

    React.useEffect(() => {
        let animationFrame;

        const animate = () => {
            const now = Date.now();
            // Synced to tempo (half-time for smoother preview)
            const speed = (tempo / 60) * Math.PI * 0.5;
            const p = (Math.sin(now / 1000 * speed) + 1) / 2;
            setPulse(p);
            animationFrame = requestAnimationFrame(animate);
        };

        animate();
        return () => cancelAnimationFrame(animationFrame);
    }, [tempo]);

    if (!renderScene) return null;

    // Simulate all instruments hitting for the preview
    const visuals = {
        pulse,
        kick: pulse,
        snare: pulse,
        hihat: pulse,
        bass: pulse,
        synth: pulse,
        perc: pulse,
        other: pulse
    };

    return renderScene(visuals);
};

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
                  relative p-6 rounded-3xl text-left transition-all duration-300 group overflow-hidden border
                  ${level.unlocked
                            ? `bg-black/40 hover:bg-black/60 border-white/10 hover:border-white/30 shadow-lg hover:shadow-[0_0_30px_${level.color === 'from-cyan-500 to-blue-600' ? '#06b6d4' : '#8b5cf6'}_0.6] hover:-translate-y-1`
                            : 'bg-black/60 border-white/5 grayscale opacity-60 cursor-not-allowed'}
                `}
                    >
                        {/* Scenario Animation */}
                        {level.renderScene && <ScenePreview renderScene={level.renderScene} tempo={level.tempo} />}

                        {/* Old Glows Removed - ScenePreview replaces them */}

                        <div className="relative z-10 flex flex-col h-full pointer-events-none">
                            <div className="flex justify-between items-start mb-6">
                                {/* Icon Badge */}
                                <div className={`
                                    w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 border border-white/10
                                    ${level.unlocked ? `bg-gradient-to-br ${level.color} text-white` : 'bg-white/5 text-slate-600'}
                                `}>
                                    {level.icon}
                                </div>

                                {/* Status Chip */}
                                {level.unlocked && levelProgress && levelProgress[level.id]?.completed && (
                                    <div className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black px-3 py-1.5 rounded-full tracking-widest uppercase shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                                        Completed
                                    </div>
                                )}
                            </div>

                            <h3 className={`text-3xl font-display font-black mb-3 tracking-tight transition-colors ${level.unlocked ? 'text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300' : 'text-slate-600'}`}>
                                {level.name}
                            </h3>

                            <p className={`text-sm font-medium mb-8 leading-relaxed ${level.unlocked ? 'text-slate-300' : 'text-slate-600'}`}>
                                {level.objective}
                            </p>

                            <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4">
                                <div className="flex items-center gap-3">
                                    <span className={`text-[10px] px-2.5 py-1 rounded-md font-black uppercase tracking-wider backdrop-blur-sm ${level.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400 border border-green-500/20' :
                                        level.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20' :
                                            'bg-red-500/20 text-red-400 border border-red-500/20'
                                    }`}>
                                        {level.difficulty}
                                    </span>
                                </div>

                                {level.unlocked ? (
                                    <span className="text-[10px] text-neon-purple font-bold uppercase tracking-wider flex items-center gap-1 group-hover:text-white transition-colors">
                                        +XP REWARD <Icons.ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                ) : (
                                    <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider flex items-center gap-1">
                                        <Icons.Lock className="w-3 h-3" /> Locked
                                    </span>
                                )}
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
